export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  imageUrl?: string;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  imageUrl: string;
  categoryId: string;
  isActive: boolean;
}

export interface IProductFilters {
  search?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
