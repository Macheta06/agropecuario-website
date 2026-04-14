import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ProductModel } from './src/models/product.model';

dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const p = await ProductModel.findOne({ 
      name: { $regex: 'MARTILLO|PINTURA|TUBO|ALICATE|HERRAMIENTA', $options: 'i' } 
    });
    if (p) {
      console.log(`ENCONTRADO: ${p.name} (SKU: ${p.sku})`);
    } else {
      console.log('No se encontraron productos comunes.');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
