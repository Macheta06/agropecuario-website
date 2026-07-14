/**
 * @file scripts/ai-classifier.ts
 * @description Script de clasificación masiva de productos utilizando la API de OpenAI.
 *
 * Flujo:
 * 1. Se conecta a MongoDB Atlas.
 * 2. Carga todas las categorías disponibles y mapea sus nombres/normalizaciones a ObjectId.
 * 3. Recupera todos los productos actualmente asignados a la categoría "Otros / Varios" (límite 3000).
 * 4. Envía lotes de 50 productos a gpt-4o-mini con un formato estructurado JSON.
 * 5. Mapea la respuesta de vuelta a los IDs de categorías reales.
 * 6. Actualiza de manera masiva (BulkWrite) el categoryId de los productos en MongoDB.
 * 7. Cierra la conexión de base de datos.
 *
 * Uso:
 *   npm run script:clasificar
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import { OpenAI } from 'openai';
import { connectDB } from '../config/database';
import { ProductModel } from '../models/product.model';
import { CategoryModel } from '../models/category.model';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const nameToIdMap = new Map<string, mongoose.Types.ObjectId>();
const normalizedMap = new Map<string, mongoose.Types.ObjectId>();

/**
 * Normaliza un string para comparación robusta (remueve acentos, minúsculas, espacios, caracteres especiales).
 */
const normalizeStr = (str: string): string =>
  str.toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quita tildes y diéresis
    .replace(/[^a-z0-9]/g, '');      // Conserva solo letras y números

/**
 * Mapea el nombre de la categoría retornado por la IA a su respectivo ObjectId.
 */
const mapCategoriaId = (name: string): mongoose.Types.ObjectId | null => {
  if (!name) return null;
  const exactName = name.trim();
  
  // Coincidencia exacta
  if (nameToIdMap.has(exactName)) {
    return nameToIdMap.get(exactName)!;
  }
  
  // Coincidencia normalizada
  const norm = normalizeStr(name);
  if (normalizedMap.has(norm)) {
    return normalizedMap.get(norm)!;
  }
  
  return null;
};

export const clasificarConIA = async (): Promise<void> => {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await connectDB();

    console.log('📚 Cargando categorías de la base de datos...');
    const categoriasDB = await CategoryModel.find({});
    if (categoriasDB.length === 0) {
      console.error('❌ No se encontraron categorías en la base de datos.');
      await mongoose.disconnect();
      return;
    }

    categoriasDB.forEach((c) => {
      const id = c._id as mongoose.Types.ObjectId;
      nameToIdMap.set(c.name, id);
      normalizedMap.set(normalizeStr(c.name), id);
    });

    const CATEGORIAS_PERMITIDAS = categoriasDB.map(c => c.name);
    console.log(`✅ Categorías cargadas exitosamente (${CATEGORIAS_PERMITIDAS.length}):`);
    CATEGORIAS_PERMITIDAS.forEach(name => console.log(`   - ${name}`));

    // 1. Buscar la categoría origen ("Otros / Varios")
    const categoriaOtros = categoriasDB.find(c => c.slug === 'otros-varios');
    if (!categoriaOtros) {
      console.error('❌ Categoría "Otros / Varios" (slug: otros-varios) no encontrada en la base de datos.');
      await mongoose.disconnect();
      return;
    }
    const categoriaOtrosId = categoriaOtros._id as mongoose.Types.ObjectId;

    // 2. Traer productos huérfanos (máximo 3000)
    console.log('🔍 Consultando productos huérfanos...');
    const productos = await ProductModel.find({ categoryId: categoriaOtrosId }).limit(3000);
    console.log(`ℹ️ Encontrados ${productos.length} productos en la categoría "Otros / Varios".`);

    if (productos.length === 0) {
      console.log('✅ No hay productos pendientes por clasificar.');
      await mongoose.disconnect();
      return;
    }

    // 3. Procesar en lotes de 50
    const tamañoLote = 50;
    const totalLotes = Math.ceil(productos.length / tamañoLote);

    for (let i = 0; i < productos.length; i += tamañoLote) {
      const lote = productos.slice(i, i + tamañoLote);
      const loteNum = i / tamañoLote + 1;
      console.log(`\n📦 Procesando lote ${loteNum} de ${totalLotes}...`);

      // Enviamos datos mínimos para ahorrar tokens
      const datosParaIA = lote.map((p) => ({
        id: p._id,
        nombre: p.name,
        descripcion: p.description
      }));

      const prompt = `
        Eres un experto bodeguero de un almacén agropecuario y ferretería.
        Clasifica cada uno de los productos de la lista en UNA de las siguientes categorías exactas:
        ${CATEGORIAS_PERMITIDAS.map(c => `- "${c}"`).join('\n')}

        Reglas:
        1. Debes elegir ÚNICAMENTE una de las categorías listadas arriba.
        2. Devuelve un objeto JSON con una propiedad "resultado" que contenga un arreglo de objetos. Cada objeto debe tener exactamente las propiedades "id" y "categoria" (el nombre de la categoría elegida).
        3. Sé muy preciso:
           - Venenos para insectos van en "Insecticidas".
           - Venenos para ratas/ratones van en "Control Roedores".
           - Control plagas en general, babosas, caracoles van en "Control Plagas" o "Insecticidas".
           - Abonos, tierra, semillas de plantas/pasto van en "Semillas y Fertilizantes".
           - Palas, azadones, machetes, riego, mangueras van en "Herramientas agrícolas".
           - Cables, bombillos, enchufes, interruptores van en "Eléctricos".
           - Pinturas, brochas, rodillos, disolventes van en "Pinturas".
           - Cascos, guantes, botas de seguridad, gafas protectoras, botiquines van en "Seguridad Industrial".
           - Jabones, escobas, desinfectantes van en "Hogar y aseo".
           - Cemento, tubos PVC, tejas, yeso van en "Construcción".
           - Clavos, tornillos, cerraduras, herramientas manuales generales (martillos, destornilladores) van en "Ferretería".
        4. Devuelve ÚNICAMENTE el JSON. Sin comentarios, texto explicativo ni formato markdown.

        Productos a clasificar:
        ${JSON.stringify(datosParaIA)}
      `;

      try {
        const completion = await openai.chat.completions.create({
          messages: [
            { role: 'system', content: 'Eres un clasificador de inventario experto que solo responde con JSON válido conteniendo la clave "resultado".' },
            { role: 'user', content: prompt }
          ],
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
        });

        const content = completion.choices[0].message.content || '{"resultado":[]}';
        const respuestaJSON = JSON.parse(content);
        const clasificaciones = respuestaJSON.resultado || respuestaJSON;

        if (!Array.isArray(clasificaciones)) {
          console.warn(`⚠️ La respuesta de la IA para el lote ${loteNum} no tiene el formato esperado.`);
          continue;
        }

        // Actualización masiva (BulkWrite)
        const operacionesBulk = [];
        for (const item of clasificaciones) {
          const mappedId = mapCategoriaId(item.categoria);
          if (mappedId) {
            operacionesBulk.push({
              updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(item.id) },
                update: { categoryId: mappedId },
              },
            });
          } else {
            console.warn(`⚠️ No se pudo mapear la categoría "${item.categoria}" del producto con ID ${item.id}. Se mantiene en Otros / Varios.`);
          }
        }

        if (operacionesBulk.length > 0) {
          const result = await ProductModel.bulkWrite(operacionesBulk);
          console.log(`✅ Lote ${loteNum} procesado exitosamente: ${result.modifiedCount} productos clasificados.`);
        } else {
          console.log(`ℹ️ Lote ${loteNum} completado sin cambios.`);
        }
      } catch (error) {
        console.error(`❌ Error al procesar el lote ${loteNum}:`, error);
      }
    }

    console.log('\n🎉 ¡Clasificación masiva completada con éxito!');
    await mongoose.disconnect();
    console.log('🔌 Conexión con MongoDB cerrada.');
  } catch (error) {
    console.error('❌ Error general en el clasificador masivo:', error);
    try {
      await mongoose.disconnect();
    } catch {}
    process.exit(1);
  }
};

// Ejecución directa si se llama por terminal
clasificarConIA().catch((err) => {
  console.error('❌ Error fatal al iniciar el clasificador:', err);
  process.exit(1);
});
