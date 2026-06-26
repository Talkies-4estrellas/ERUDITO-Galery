import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PanelAdmin from "@/components/PanelAdmin";

export const metadata: Metadata = {
  title: "Admin — ERUDITO Galery",
  robots: { index: false },
};

export default function Admin() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <PanelAdmin />
      </main>
    </div>
  );
}
