import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shashika Fernando | Profile",
  description:
    "A quick-read profile of Shashika Fernando: featured work, case studies, experience, education and certificates.",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
