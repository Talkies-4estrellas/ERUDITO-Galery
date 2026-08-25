import type { Metadata } from "next";
import PanelAdmin from "@/components/PanelAdmin";

export const metadata: Metadata = {
  title: "Admin — ERUDITO Galery",
  robots: { index: false },
};

export default function Admin() {
  return (
    <div className="fixed inset-0 z-10 flex overflow-hidden bg-zinc-950">
      <PanelAdmin />
    </div>
  );
}
