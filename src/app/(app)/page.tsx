import Link from "next/link";
import { Baby, Utensils, NotebookPen, Hospital } from "lucide-react";
import AppHeader from "@/app/(app)/_components/app-header";

export default function HomePage() {
  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const menus = [
    { label: "睡眠", icon: <span className="text-3xl">💤</span>, href: "/sleep" },
    { label: "食事", icon: <Utensils className="h-8 w-8 text-orange-400" />, href: "#" },
    { label: "日記", icon: <NotebookPen className="h-8 w-8 text-green-400" />, href: "#" },
    { label: "病院", icon: <Hospital className="h-8 w-8 text-red-400" />, href: "#" },
  ];

  return (
    <>
      <AppHeader title="まーちゃんの記録" />
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-md space-y-8">

        {/* 日付 */}
        <header className="space-y-2 text-center">
          <p className="flex items-center justify-center gap-2 text-3xl font-bold text-slate-800">
            <Baby className="h-8 w-8 text-pink-400" />
          </p>
          <p className="text-sm text-slate-500">📅 今日：{today}</p>
        </header>

        {/* メニューグリッド */}
        <div className="grid grid-cols-2 gap-4">
          {menus.map((menu) => (
            <Link
              key={menu.label}
              href={menu.href}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-8 shadow-sm transition hover:shadow-md hover:bg-slate-50"
            >
              {menu.icon}
              <span className="text-base font-semibold text-slate-700">{menu.label}</span>
            </Link>
          ))}
        </div>

        </div>
      </main>
    </>
  );
}
