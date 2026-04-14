import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ProductModel } from '../models/product.model';

dotenv.config();

async function list() {
  try {
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not set');
    await mongoose.connect(process.env.MONGODB_URI);
    const products = await ProductModel.find().limit(20);
    console.log('--- PRODUCTOS EN DB ---');
    products.forEach(p => console.log(`- ${p.name} (SKU: ${p.sku})`));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

list();
