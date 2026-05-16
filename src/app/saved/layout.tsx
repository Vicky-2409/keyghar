import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your shortlist",
  robots: { index: false, follow: true },
};

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
