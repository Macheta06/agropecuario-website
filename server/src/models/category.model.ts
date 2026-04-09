/**
 * @file models/category.model.ts
 * @description Schema y Model de Mongoose para la entidad Category.
 * Aplica el principio OCP (Open/Closed): las categorías son datos, no enums hardcodeados,
 * permitiendo agregar nuevas categorías sin modificar código.
 */
import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interfaz del documento Category tal como existe en MongoDB.
 * Extiende Document de Mongoose para incluir _id, __v, etc.
 */
export interface ICategoryDocument extends Document {
  name: string;
  slug: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: [true, 'El nombre de la categoría es obligatorio.'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


export const CategoryModel: Model<ICategoryDocument> = mongoose.model<ICategoryDocument>(
  'Category',
  categorySchema
);
