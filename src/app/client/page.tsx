import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ClientPageContent from "./ClientPageContent";

export default async function ClientPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role !== "client") {
    redirect("/"); // 🔒 Se não é cliente, manda para home
  }

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col gap-8 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Painel do Cliente</h1>
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

      <ClientPageContent />
    </div>
  );
}
