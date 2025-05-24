import { getLogtoContext } from '@logto/next';
import { redirect } from 'next/navigation';

export default async function ClientPage() {
  const { isAuthenticated, getUserInfo } = getLogtoContext();

  if (!isAuthenticated) {
    redirect('/api/logto');
  }

  const user = await getUserInfo();

  if (user?.customClaims?.role !== 'client') {
    redirect('/admin'); // Se não for client, redireciona para admin
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Dashboard do Cliente</h1>
      <p>Olá, {user?.name}. Aqui ficará sua visão personalizada.</p>
      <a
        href="/api/logto/sign-out"
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </a>
    </main>
  );
}
