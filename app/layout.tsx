import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Thanh Bình & Thu Hằng | Wedding",
  description:
    "Trân trọng mời bạn chung vui cùng Thanh Bình và Thu Hằng — 15.11.2026.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
