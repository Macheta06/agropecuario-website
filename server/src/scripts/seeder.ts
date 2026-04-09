/**
 * @file scripts/seeder.ts
 * @description Script de carga masiva del inventario desde el archivo Excel.
 *
 * Patrón de diseño aplicado:
 * - **Strategy Pattern**: La función `classifyProduct` encapsula la lógica de
 *   categorización como una estrategia intercambiable. Cada categoría tiene su
 *   propia lista de palabras clave; se puede agregar/modificar sin tocar el resto.
 *
 * Flujo:
 * 1. Lee el archivo Excel desde la ruta especificada.
 * 2. Limpia y normaliza los datos (nombre, precio, SKU).
 * 3. Clasifica cada artículo en una categoría mediante búsqueda de palabras clave.
 * 4. Hace un upsert masivo en MongoDB usando bulkWrite para eficiencia.
 *
 * Uso:
 *   npm run seed
 */

import 'dotenv/config';
import path from 'path';
import * as XLSX from 'xlsx';
import mongoose from 'mongoose';
import { connectDB } from '../config/database';
import { CategoryModel } from '../models/category.model';
import { ProductModel } from '../models/product.model';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURACIÓN DE CATEGORÍAS (Patrón Strategy)
// Cada entrada define un nombre de categoría y las palabras clave que la activan.
// El orden importa: la primera coincidencia gana.
// ─────────────────────────────────────────────────────────────────────────────

interface CategoryRule {
  name: string;
  slug: string;
  keywords: string[];
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    name: 'Ferretería',
    slug: 'ferreteria',
    keywords: [
      'PUNTILLA', 'CLAVO', 'TORNILLO', 'TUERCA', 'ARANDELA', 'REMACHE',
      'BISAGRA', 'CANDADO', 'CHAZOS', 'CHAZO', 'ALAMBRE', 'MALLA',
      'LLAVE', 'MARTILLO', 'DESTORNILLADOR', 'ALICATE', 'PINZA',
      'SERRUCHO', 'SEGUETA', 'CEPILLO', 'FORMÓN', 'CINCEL', 'COMPRESOR',
      'TALADRO', 'ESMERIL', 'FRESA', 'BROCA', 'LIMA', 'METRO', 'NIVEL',
      'MANIJA', 'PERNO', 'CUCHARON', 'MACETA', 'TENAZA', 'GRILLETE',
      'CADENA', 'ROLDANA', 'CABLE DE ACERO',
    ],
  },
  {
    name: 'Construcción',
    slug: 'construccion',
    keywords: [
      'PVC', 'TUBO', 'CODO', 'UNION', 'TEE', 'REDUCCION', 'REDUCCI',
      'SIFON', 'TRAMPA', 'TEJA', 'CEMENTO', 'MORTERO', 'PEGANTE',
      'VARILLA', 'HIERRO', 'MALLA ELECTROSOLDADA', 'BLOQUE', 'TABLERO',
      'ANGULO', 'CANAL', 'PERFIL', 'IMPERME', 'ESTUCO', 'MASILLA',
      'SELLADOR', 'SILICON', 'CINTA TEFLON', 'LLAVE DE PASO',
      'VALVULA', 'ADAPTADOR',
    ],
  },
  {
    name: 'Eléctricos',
    slug: 'electricos',
    keywords: [
      'CABLE', 'INTERRUPTOR', 'TOMA', 'TOMACORRIENTE', 'BREAKER',
      'BOMBILLO', 'LUMINARIA', 'FOCO', 'LED', 'BALASTO', 'CINTA LED',
      'EXTENSION', 'MULTITOMA', 'CONTACTOR', 'RIEL DIN', 'BORNERA',
      'CANALETA', 'CONDUIT', 'EMT', 'TUBO CONDUIT', 'PULSADOR',
      'ENCHUFE', 'CONECTOR ELECTRICO', 'TAPE', 'CINTA AISLANTE',
    ],
  },
  {
    name: 'Pinturas',
    slug: 'pinturas',
    keywords: [
      'VINILO', 'ESMALTE', 'PINTURA', 'LACA', 'BARNIZ', 'THINNER',
      'DILUYENTE', 'BROCHA', 'RODILLO', 'BANDEJA', 'LIJA', 'SELLADOR DE MADERA',
      'ANTICORROSIVO', 'FONDO', 'IMPERME', 'IMPERMEABILIZANTE',
      'REMOVEDOR', 'AGUARRAS', 'BALDE PLASTICO PINTURA',
    ],
  },
  {
    name: 'Agropecuario',
    slug: 'agropecuario',
    keywords: [
      'ABONO', 'FERTILIZANTE', 'SEMILLA', 'CONCENTRADO', 'SAL MINERAL',
      'HERBICIDA', 'FUNGICIDA', 'INSECTICIDA', 'ACARICIDA', 'ROUNDUP',
      'GLIFOSATO', 'COSECHA', 'FUMIGADORA', 'BOMBA DE ESPALDA',
      'CIPERMETRINA', 'CAPTAN', 'MANCOZEB', 'UREA', 'TRIPLE 15',
      'DAP', 'POTASIO', 'CAL AGRICOLA', 'AZUFRE',
    ],
  },
  {
    name: 'Hogar y Aseo',
    slug: 'hogar-y-aseo',
    keywords: [
      'ESCOBA', 'TRAPERO', 'JABON', 'DETERGENTE', 'DESENGRASANTE',
      'BAYETILLA', 'ESPONJA', 'RECOGEDOR', 'MANGUERA', 'TANQUE',
      'BALDE', 'JABÓN', 'LAVAPLATOS', 'CERA', 'AMBIENTADOR',
      'DESINFECTANTE', 'HIPOCLORITO', 'LIMPIADOR',
    ],
  },
];

const OTROS_CATEGORY: CategoryRule = {
  name: 'Otros / Varios',
  slug: 'otros-varios',
  keywords: [],
};

// ─────────────────────────────────────────────────────────────────────────────
// FUNCIÓN DE CLASIFICACIÓN (Estrategia de búsqueda de palabras clave)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Clasifica un artículo en una categoría según sus palabras clave.
 * Aplica el principio de primera coincidencia (orden de CATEGORY_RULES importa).
 *
 * @param {string} articleName - Nombre del artículo a clasificar.
 * @returns {CategoryRule} La regla de categoría que corresponde al artículo.
 */
const classifyProduct = (articleName: string): CategoryRule => {
  const upperName = articleName.toUpperCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => upperName.includes(kw))) {
      return rule;
    }
  }
  return OTROS_CATEGORY;
};

// ─────────────────────────────────────────────────────────────────────────────
// FUNCIONES DE LIMPIEZA DE DATOS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Limpia y normaliza el nombre del artículo eliminando espacios dobles.
 * @param {unknown} raw - Valor crudo de la celda Excel.
 * @returns {string} Nombre limpio o cadena vacía.
 */
const cleanName = (raw: unknown): string => {
  return String(raw ?? '').replace(/\s+/g, ' ').trim();
};

/**
 * Convierte el valor de precio a número entero.
 * Maneja tanto números directos (Excel ya los parsea) como cadenas con formato.
 *
 * @param {unknown} raw - Valor crudo de la celda de precio.
 * @returns {number} Precio como entero, 0 si no es válido.
 */
const cleanPrice = (raw: unknown): number => {
  if (typeof raw === 'number') return Math.round(raw);
  const cleaned = String(raw ?? '').replace(/[$.]/g, '').replace(',', '.').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.round(num);
};

/**
 * Genera un SKU con formato ITEM-XXXX basado en el índice de la fila.
 * @param {number} index - Índice del producto (base 1).
 * @returns {string} SKU formateado.
 */
const generateSku = (index: number): string => {
  return `ITEM-${String(index).padStart(4, '0')}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS INTERNOS DEL SEEDER
// ─────────────────────────────────────────────────────────────────────────────

interface ParsedProduct {
  sku: string;
  name: string;
  price: number;
  categorySlug: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// FUNCIÓN PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

const seed = async (): Promise<void> => {
  // 1. Conectar a MongoDB
  await connectDB();
  console.log('\n📂 Leyendo archivo Excel...');

  // 2. Leer el archivo Excel
  const filePath = path.resolve(
    __dirname,
    '../../..', // src/scripts -> src -> server -> Agropecuario (raíz del monorepo)
    'Inventario Agropecuario marzo 2026.xlsx'
  );
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  // header: 1 para obtener arrays de arrays crudos (más eficiente)
  const rawRows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, { header: 1 });

  console.log(`   Total de filas en Excel (incluyendo header): ${rawRows.length}`);

  // 3. Parsear y filtrar productos válidos
  const products: ParsedProduct[] = [];
  let skipped = 0;

  // rowIndex 0 es la fila de cabeceras, empezamos en 1
  for (let i = 1; i < rawRows.length; i++) {
    const row = rawRows[i] as unknown[];
    const name = cleanName(row[0]);
    const price = cleanPrice(row[3]);

    // Ignorar filas sin nombre o con precio inválido/cero
    if (!name || price <= 0) {
      skipped++;
      continue;
    }

    const rule = classifyProduct(name);
    products.push({
      sku: generateSku(i),
      name,
      price,
      categorySlug: rule.slug,
    });
  }

  console.log(`   ✅ Productos válidos: ${products.length}`);
  console.log(`   ⚠️  Filas omitidas (sin nombre o precio): ${skipped}`);

  // 4. Crear/actualizar todas las categorías (upsert)
  console.log('\n🏷️  Sincronizando categorías...');
  const allRules = [...CATEGORY_RULES, OTROS_CATEGORY];
  const categoryMap = new Map<string, mongoose.Types.ObjectId>();

  for (const rule of allRules) {
    const category = await CategoryModel.findOneAndUpdate(
      { slug: rule.slug },
      { name: rule.name, slug: rule.slug },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    categoryMap.set(rule.slug, category._id as mongoose.Types.ObjectId);
    console.log(`   ✓ Categoría "${rule.name}" — ID: ${category._id}`);
  }

  // 5. Upsert masivo de productos con bulkWrite
  console.log('\n📦 Cargando productos en MongoDB (bulkWrite)...');

  const BATCH_SIZE = 500;
  let totalUpserted = 0;
  let totalModified = 0;

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);

    const operations = batch.map((p) => ({
      updateOne: {
        filter: { sku: p.sku },
        update: {
          $set: {
            name: p.name,
            price: p.price,
            categoryId: categoryMap.get(p.categorySlug),
            isActive: true,
            description: '',
            imageUrl: '',
          },
        },
        upsert: true,
      },
    }));

    const result = await ProductModel.bulkWrite(operations, { ordered: false });
    totalUpserted += result.upsertedCount;
    totalModified += result.modifiedCount;

    const progress = Math.min(i + BATCH_SIZE, products.length);
    console.log(
      `   Lote procesado: ${progress}/${products.length} productos → ` +
      `insertados: ${result.upsertedCount}, actualizados: ${result.modifiedCount}`
    );
  }

  // 6. Resumen final
  console.log('\n═══════════════════════════════════════════');
  console.log('✅ SEED COMPLETADO');
  console.log(`   Total insertados (nuevos): ${totalUpserted}`);
  console.log(`   Total actualizados: ${totalModified}`);
  console.log('═══════════════════════════════════════════\n');

  // 7. Resumen por categoría
  console.log('📊 Distribución por categorías:');
  for (const rule of allRules) {
    const count = await ProductModel.countDocuments({
      categoryId: categoryMap.get(rule.slug),
    });
    console.log(`   ${rule.name}: ${count} productos`);
  }

  await mongoose.disconnect();
  console.log('\n🔌 Conexión a MongoDB cerrada.\n');
};

// Ejecutar
seed().catch((err: unknown) => {
  console.error('❌ Error fatal en el seeder:', err);
  process.exit(1);
});
