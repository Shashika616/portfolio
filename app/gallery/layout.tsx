import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shashika Fernando | Gallery",
  description: "Every system Shashika Fernando has built, as a gallery of screenshots and architecture diagrams.",
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
