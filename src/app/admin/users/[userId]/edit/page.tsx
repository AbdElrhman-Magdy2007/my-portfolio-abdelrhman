import { getUser, getUsers } from "@/app/server/db/users";
import EditUserForm from "@/components/edit-user-form";
import { Pages, Routes } from "@/constants/enums";
import { redirect } from "next/navigation";

// Generate static parameters for paths
export async function generateStaticParams() {
  const users = await getUsers();
  return users.map((user) => ({ userId: user.id }));
}

// Edit user page
async function EditUserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  // Fetch user data based on userId
  const user = await getUser(userId);

  // Redirect if user is not found
  if (!user) {
    redirect(`/${Routes.ADMIN}/${Pages.USERS}`);
  }

  return (
    <main className="min-h-screen bg-black">
      <section className="section-gap py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-indigo-700 mb-6">
            Edit User - {user.name}
          </h1>
          <EditUserForm user={user as any} />
        </div>
      </section>
    </main>
  );
}

export default EditUserPage;