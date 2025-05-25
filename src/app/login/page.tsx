'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await signIn('credentials', {
      username,
      password,
      redirect: true,
      callbackUrl: '/',
    });

    if (res?.error) {
      setError('Usuário ou senha inválidos');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/logo.png" // coloque seu logo em /public/logo.png
            alt="Logo"
            width={80}
            height={80}
            className="mb-2"
          />
          <h1 className="text-3xl font-bold text-gray-800">Salus Dashboard</h1>
          <p className="text-gray-500 text-sm">Acesso restrito</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Usuário
            </label>
            <input
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-center text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
