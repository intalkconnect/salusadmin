import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;  // 👈 Aqui estamos adicionando o role
    };
  }

  interface User {
    role?: string | null;    // 👈 Também se aplica para o objeto User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string | null;    // 👈 Adiciona o role no token JWT
  }
}
