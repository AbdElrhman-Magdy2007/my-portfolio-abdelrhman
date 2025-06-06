"use server";

import { cache } from "react";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { Pages, Routes } from "@/constants/enums";
import { ProductWithRelations } from "@/app/types/product";
import Form from "../../_components/Form";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { getCategories } from "@/app/server/db/categories";
import { getProducts } from "@/app/server/db/products";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader } from "lucide-react";
import clsx from "clsx";
import { getProductById } from "@/app/server/_actions/product";
import { EditProductForm } from "../_components/Form";

type Category = {
  id: string;
  name: string;
  order: number;
  products?: ProductWithRelations[];
};

// Constants
const LOG_PREFIX = "[EditProductPage]";
const ERROR_MESSAGES = {
  INVALID_ID: "Invalid product ID provided",
  PRODUCT_NOT_FOUND: "Product not found",
  NO_CATEGORIES: "No categories available. Please create a category first.",
  FETCH_ERROR: "Failed to fetch data. Please try again later.",
};

// Generate unique request ID for logging
const generateRequestId = () => uuidv4();

// Cached database queries with revalidation tags
const cachedGetProducts = cache(async () => {
  const requestId = generateRequestId();
  console.log(`${LOG_PREFIX} [${requestId}] Fetching products`);
  try {
    const result = await getProducts();
    if ("error" in result || !Array.isArray(result)) {
      console.error(`${LOG_PREFIX} [${requestId}] Failed to fetch products:`, result?.error);
      return [];
    }
    return result as ProductWithRelations[];
  } catch (error) {
    console.error(`${LOG_PREFIX} [${requestId}] Error fetching products:`, error);
    return [];
  }
});

const cachedGetCategories = cache(async () => {
  const requestId = generateRequestId();
  console.log(`${LOG_PREFIX} [${requestId}] Fetching categories`);
  try {
    const result = await getCategories();
    if ("error" in result || !Array.isArray(result)) {
      console.error(`${LOG_PREFIX} [${requestId}] Failed to fetch categories:`, result?.error);
      return [];
    }
    return result as Category[];
  } catch (error) {
    console.error(`${LOG_PREFIX} [${requestId}] Error fetching categories:`, error);
    return [];
  }
});

/**
 * Generates static parameters for dynamic routes.
 * @returns Array of product ID parameters.
 */
export async function generateStaticParams() {
  const requestId = generateRequestId();
  console.log(`${LOG_PREFIX} [${requestId}] Generating static params`);

  try {
    const products = await cachedGetProducts();
    const params = products.map((product) => ({
      productId: product.id,
    }));

    if (process.env.NODE_ENV === "development") {
      console.log(`${LOG_PREFIX} [${requestId}] Generated params:`, params.length);
    }

    return params;
  } catch (error) {
    console.error(`${LOG_PREFIX} [${requestId}] Error in generateStaticParams:`, error);
    return [];
  }
}

/**
 * Fetches a product by ID with optimized field selection.
 * @param productId - The ID of the product to fetch.
 * @returns Product with relations or null if not found.
 */
const getProduct = cache(async (productId: string): Promise<ProductWithRelations | null> => {
  const requestId = generateRequestId();
  console.log(`${LOG_PREFIX} [${requestId}] Fetching product ID: ${productId}`);

  if (!productId || typeof productId !== "string") {
    console.warn(`${LOG_PREFIX} [${requestId}] ${ERROR_MESSAGES.INVALID_ID}`);
    return null;
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        ProductTech: { select: { id: true, name: true } },
        ProductAddon: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, order: true } },
        orders: { select: { id: true } },
        downloadVerifications: { select: { id: true } },
      },
    });

    if (!product) {
      console.warn(`${LOG_PREFIX} [${requestId}] ${ERROR_MESSAGES.PRODUCT_NOT_FOUND}`);
    }

    return product as ProductWithRelations | null;
  } catch (error) {
    console.error(`${LOG_PREFIX} [${requestId}] Error fetching product:`, error);
    return null;
  }
});

interface EditProductPageProps {
  params: {
    productId: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  try {
    const product = await getProductById(params.productId);
    
    if (!product) {
      notFound();
    }

    return <EditProductForm product={product} />;
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }
}