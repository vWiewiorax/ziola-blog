import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel redakcyjny",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-4xl px-4 py-10">{children}</div>;
}
