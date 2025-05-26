import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  if (session.user?.role === 'admin') {
    redirect('/admin');
  }

  if (session.user?.role === 'client') {
    redirect('/client?id=${session.user.id}');
  }

  return (
    <div>
      <h1>Bem-vindo, {session.user?.name}</h1>
      <p>Você não tem um perfil definido.</p>
      <a href="/api/auth/signout">Logout</a>
    </div>
  );
}
