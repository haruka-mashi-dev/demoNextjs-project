import Link from "next/link"
import { Baby } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function RegisterCompletePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-md text-center">
        <CardHeader className="pb-4">
          <div className="mb-2 flex justify-center">
            <Baby className="h-12 w-12 text-pink-400" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-600">登録が完了しました</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-500">
            アカウントの登録が完了しました。<br />
            ログインしてアプリをご利用ください。
          </p>
          <Button asChild className="h-11 w-full rounded-xl text-base font-semibold">
            <Link href="/login">ログイン画面へ</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
