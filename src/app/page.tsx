import { getServerSideLogtoContext } from '@logto/next';

import { redirect } from 'next/navigation';
import AdminPageContent from '@/app/admin/AdminPageContent';

export default async function AdminPage() {
  const { isAuthenticated, getUserInfo } = getServerSideLogtoContext();

  if (!isAuthenticated) {
    redirect('/api/logto');
  }

  const user = await getUserInfo();

  if (user?.customClaims?.role !== 'admin') {
    redirect('/client'); // 🔒 Não é admin, manda para client
  }

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col gap-8 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Painel Administrativo</h1>
        <div className="flex items-center gap-4">
          <span>Bem-vindo, {user?.name}</span>
          <a
            href="/api/logto/sign-out"
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
