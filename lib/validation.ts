import type { ProductStatusDto } from "@/types";

const ALLOWED_STATUSES: ProductStatusDto[] = ["DRAFT", "ACTIVE"];

export function validateName(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed.length < 2) return "Name must be at least 2 characters.";
  if (trimmed.length > 50) return "Name must be at most 50 characters.";
  return null;
}

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "Please enter a valid email address.";
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  return null;
}

export type ProductInput = {
  name?: string;
  description?: string | null;
  price?: string | number;
  stock?: string | number;
  image?: string | null;
  categoryId?: string;
  status?: ProductStatusDto;
};

export type ValidProductData = {
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  categoryId: string;
  status: ProductStatusDto;
};

export function validateProduct(
  input: ProductInput,
):
  | { ok: true; data: ValidProductData }
  | { ok: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const name = input.name?.trim() ?? "";

  if (!name) {
    errors.name = "Product name is required.";
  } else if (name.length < 2) {
    errors.name = "Product name must be at least 2 characters.";
  }

  if (input.price === undefined || input.price === null || input.price === "") {
    errors.price = "Price is required.";
  } else {
    const price = Number(input.price);
    if (Number.isNaN(price) || price <= 0) {
      errors.price = "Price must be a positive number.";
    }
  }

  if (input.stock === undefined || input.stock === null || input.stock === "") {
    errors.stock = "Stock is required.";
  } else {
    const stock = Number(input.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      errors.stock = "Stock must be a whole number of 0 or more.";
    }
  }

  if (!input.categoryId) {
    errors.categoryId = "Category is required.";
  }

  if (!input.status) {
    errors.status = "Status is required.";
  } else if (!ALLOWED_STATUSES.includes(input.status)) {
    errors.status = "Status must be DRAFT or ACTIVE.";
  }

  if (input.image && !/^\/(?!\/)|^https?:\/\//.test(input.image)) {
    errors.image = "Image must be a valid path or URL.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      name,
      description: input.description?.trim() ? input.description.trim() : null,
      price: Number(input.price),
      stock: Number(input.stock),
      categoryId: input.categoryId!,
      status: input.status!,
      image: input.image?.trim() ? input.image.trim() : null,
    },
  };
}

export type ShopInput = {
  name?: string;
  description?: string | null;
  logoUrl?: string | null;
};

export type ValidShopData = {
  name: string;
  description: string | null;
  logoUrl: string | null;
};

export function validateShop(
  input: ShopInput,
): { ok: true; data: ValidShopData } | { ok: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const name = input.name?.trim() ?? "";

  if (!name) {
    errors.name = "Shop name is required.";
  } else if (name.length < 2) {
    errors.name = "Shop name must be at least 2 characters.";
  }

  if (input.logoUrl && !/^\/(?!\/)|^https?:\/\//.test(input.logoUrl)) {
    errors.logoUrl = "Logo must be a valid path or URL.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      name,
      description: input.description?.trim() ? input.description.trim() : null,
      logoUrl: input.logoUrl?.trim() ? input.logoUrl.trim() : null,
    },
  };
}