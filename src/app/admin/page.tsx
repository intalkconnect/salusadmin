
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import { redirect } from "next/navigation";
import AdminPageContent from "./AdminPageContent";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role !== "admin") {
    redirect("/"); // 🔒 Se não é admin, manda para home
  }

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col gap-8 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Painel Administrativo</h1>
        <div className="flex items-center gap-4">
          <span>Bem-vindo, {session.user?.name}</span>
          <a
            href="/api/auth/signout"
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </a>
        </div>
      </header>

      <AdminPageContent />
    </div>
  );
}
