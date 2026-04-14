import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cloudinary from '../config/cloudinary';
import { ProductModel } from '../models/product.model';
import { CategoryModel } from '../models/category.model';

dotenv.config();

async function runScraper() {
  try {
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI no definida');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const _ = CategoryModel; 

    // LEER LÍMITE DE COMANDO (Ej: npm run scrape -- --limit=10)
    const args = process.argv.slice(2);
    const limitArg = args.find(a => a.startsWith('--limit='));
    const limit = limitArg ? parseInt(limitArg.split('=')[1]) : 5; // Default 5

    const products = await ProductModel.find({
      $or: [
        { imageUrl: '' },
        { imageUrl: { $exists: false } },
        { imageUrl: /placehold/ }
      ]
    }).populate('categoryId').limit(limit);

    if (products.length === 0) {
      console.log('✨ No hay productos pendientes de imagen.');
      process.exit(0);
    }

    console.log(`🔍 Iniciando lote automatizado: ${products.length} productos (Límite: ${limit}).`);

    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,720'] 
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36');

    for (const product of products) {
      try {
        const cleanName = product.name.replace(/["']/g, '').replace(/\//g, ' '); 
        const query = `${cleanName} ferretería`;
        console.log(`🚀 Buscando: "${query}"...`);
        
        const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`;
        await page.goto(searchUrl, { waitUntil: 'networkidle2' });

        await new Promise(r => setTimeout(r, 4000));

        const finalImageUrl = await page.evaluate(() => {
          // Buscamos cualquier imagen que sea lo suficientemente grande
          const imgs = Array.from(document.querySelectorAll('img'));
          const candidate = imgs.find(img => {
            const src = img.src || img.dataset.src || '';
            const isDataOrHttp = src.startsWith('http') || src.startsWith('data:image');
            return isDataOrHttp && img.width > 150 && img.height > 150;
          });
          return candidate ? candidate.src || candidate.dataset.src : null;
        });

        if (!finalImageUrl) {
          console.warn(`⚠️ No se pudo extraer imagen para "${product.name}".`);
          continue;
        }

        console.log(`☁️ Subiendo a Cloudinary...`);
        const uploadResult = await cloudinary.uploader.upload(finalImageUrl, {
          folder: 'productos',
          public_id: `prod_${product.sku.toLowerCase()}`,
          overwrite: true,
          transformation: [{ width: 800, crop: "limit" }]
        });

        product.imageUrl = uploadResult.secure_url;
        await product.save();
        console.log(`✅ ¡ÉXITO! Producto ${product.sku} actualizado.`);

        // Delay para evitar bloqueos (3 segundos)
        await new Promise(r => setTimeout(r, 3000));

      } catch (err: any) {
        console.error(`❌ Error en ${product.sku}:`, err.message);
      }
    }

    await browser.close();
    console.log('🏁 Lote finalizado.');
    process.exit(0);

  } catch (error) {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  }
}

runScraper();
