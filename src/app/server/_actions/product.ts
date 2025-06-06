import { prisma } from "@/lib/prisma";
import { ProductWithRelations } from "@/app/types/product";

export async function getProductById(id: string): Promise<ProductWithRelations | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        ProductTech: { select: { id: true, name: true } },
        ProductAddon: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, order: true } },
        orders: { select: { id: true } },
        downloadVerifications: { select: { id: true } },
      },
    });

    return product as ProductWithRelations | null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
} 