import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import FormAuth from "@/components/FormAuth";

export const metadata: Metadata = {
  title: "Iniciar sesión — ERUDITO Galery",
  description: "Accede a tu cuenta en ERUDITO Galery.",
  robots: { index: false },
};

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm rounded-3xl bg-zinc-900 p-8 ring-1 ring-white/10">
          <FormAuth modo="login" />
        </div>
      </main>
    </div>
  );
}
