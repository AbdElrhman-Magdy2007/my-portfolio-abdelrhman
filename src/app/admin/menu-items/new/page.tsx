import { Pages, Routes } from "@/constants/enums";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Form from "../_components/Form";
import { authOptions } from "@/app/server/auth";
import { getCategories } from "@/app/server/db/categories";

async function NewProductPage() {
  const session = await getServerSession(authOptions);
  const categories = await getCategories();

  if (!session) {
    redirect(`/${Routes.AUTH}/${Pages.LOGIN}`);
  }

  if (session && session.user.role !== UserRole.ADMIN) {
    redirect(`/${Routes.PROFILE}`);
  }

  if (!categories || categories.length === 0) {
    redirect(`/${Routes.ADMIN}/${Pages.CATEGORIES}`);
  }

  return (
    <main>
      <section className="section-gap">
        <div className="container bg-black bg-center items-center justify-center mx-auto rounded-lg shadow-md">
          <Form categories={categories} />
        </div>
      </section>
    </main>
  );
}

export default NewProductPage;