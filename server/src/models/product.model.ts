/**
 * @file models/product.model.ts
 * @description Schema y Model de Mongoose para la entidad Product.
 * Diseñado para soportar búsqueda de texto completo (Atlas Search o regex)
 * y filtrado eficiente por categoría.
 */
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

/**
 * Interfaz del documento Product tal como existe en MongoDB.
 */
export interface IProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  sku: string;
  imageUrl: string;
  categoryId: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio.'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'El precio del producto es obligatorio.'],
      min: [0, 'El precio no puede ser negativo.'],
    },
    sku: {
      type: String,
      required: [true, 'El SKU es obligatorio.'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'La categoría del producto es obligatoria.'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/** Índice compuesto para búsqueda eficiente por categoría + estado activo. */
productSchema.index({ categoryId: 1, isActive: 1 });

/** Índice de texto completo para búsquedas por nombre y SKU. */
productSchema.index({ name: 'text', sku: 'text' });

export const ProductModel: Model<IProductDocument> = mongoose.model<IProductDocument>(
  'Product',
  productSchema
);
