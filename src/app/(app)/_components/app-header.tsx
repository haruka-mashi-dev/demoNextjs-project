import Link from "next/link";
import { ChevronLeft, LogOut } from "lucide-react";
import { logoutAction } from "@/app/(app)/_actions/logout";
import { Button } from "@/components/ui/button";

type AppHeaderProps = {
  title: string;
  backHref?: string;
};

export default function AppHeader({ title, backHref }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
      {backHref ? (
        <Button variant="ghost" size="sm" asChild>
          <Link href={backHref} className="flex items-center gap-1 text-slate-600">
            <ChevronLeft className="h-4 w-4" />
            戻る
          </Link>
        </Button>
      ) : (
        <div className="w-20" />
      )}

      <h1 className="text-base font-semibold text-slate-800">{title}</h1>

      <form action={logoutAction}>
        <Button variant="ghost" size="sm" type="submit" className="flex items-center gap-1 text-slate-600">
          <LogOut className="h-4 w-4" />
          ログアウト
        </Button>
      </form>
    </header>
  );
}
