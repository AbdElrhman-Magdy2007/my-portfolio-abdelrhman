import { Prisma } from "@prisma/client";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    ProductTech: true;
    ProductAddon: true;
    category: true;
    orders: true;
  };
}>;
