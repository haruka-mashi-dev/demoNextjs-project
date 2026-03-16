import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "育児アプリ",
  description: "娘の育児記録を管理するアプリ",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-50 text-slate-800">
        {children}
      </body>
    </html>
  );
}