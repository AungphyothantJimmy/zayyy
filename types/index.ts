import type { SessionUser } from "@/lib/auth";

export type ApiError = {
  error: string;
  status?: number;
};

export type ApiResponse<T> = T & { error?: never } | ApiError;

export type { SessionUser };

export type ProductStatusDto = "DRAFT" | "ACTIVE" | "SUSPENDED";
export type ShopStatusDto = "PENDING" | "ACTIVE" | "REJECTED" | "SUSPENDED";

export type CategoryDto = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  productCount?: number;
};

export type ShopDto = {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  status: ShopStatusDto;
  createdAt: string;
  updatedAt: string;
  productCount?: number;
};

export type ProductDto = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  image: string | null;
  status: ProductStatusDto;
  createdAt: string;
  updatedAt: string;
  shopId: string;
  categoryId: string;
  category?: CategoryDto;
  shop?: ShopDto;
};

export type ProductSummaryDto = Omit<
  ProductDto,
  "description" | "createdAt" | "updatedAt" | "categoryId" | "category" | "shop"
> & {
  category?: { id: string; name: string };
  shop?: { id: string; name: string; logoUrl: string | null };
};

export type ProductListResponse = {
  products: ProductSummaryDto[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type ProductQuery = {
  search?: string;
  categoryId?: string;
  shopId?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: boolean;
  page?: number;
  pageSize?: number;
};