"use client"

import { useState, useEffect, useActionState } from "react"
import { useRouter } from "next/navigation"
import { registerAction } from "../_actions/register"
import type { RegisterFormValues } from "@/types/user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const SESSION_KEY = "registerFormValues"

const LABELS: Record<keyof RegisterFormValues, string> = {
  email: "メールアドレス",
  password: "パスワード",
  lastName: "名字",
  firstName: "名前",
  childName: "お子様の名前",
  childNickname: "お子様のニックネーム",
  childGender: "性別",
}

const GENDER_LABELS = { girl: "女の子", boy: "男の子" }

export default function RegisterConfirmPage() {
  const router = useRouter()
  const [formValues, setFormValues] = useState<RegisterFormValues | null>(null)
  const [state, action, isPending] = useActionState(registerAction, null)

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY)
    if (!saved) {
      router.replace("/register")
      return
    }
    setFormValues(JSON.parse(saved))
  }, [router])

  // 登録成功時に sessionStorage を削除（redirect は Server Action 側で行う）
  useEffect(() => {
    if (state === null) return
    // errorMessage がない = 成功してリダイレクト済みのケースはここには来ない
  }, [state])

  if (!formValues) return null

  const displayValue = (key: keyof RegisterFormValues) => {
    if (key === "password") return "••••••••"
    if (key === "childGender") return GENDER_LABELS[formValues.childGender]
    return formValues[key]
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-md">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-xl font-bold text-slate-600">登録内容の確認</CardTitle>
          <p className="text-sm text-slate-500">以下の内容で登録します</p>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {state?.errorMessage && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{state.errorMessage}</p>
          )}

          <dl className="space-y-3 text-sm">
            {(Object.keys(LABELS) as (keyof RegisterFormValues)[]).map((key) => (
              <div key={key} className="flex justify-between border-b border-slate-100 pb-2">
                <dt className="text-slate-500">{LABELS[key]}</dt>
                <dd className="font-medium text-slate-700">{displayValue(key)}</dd>
              </div>
            ))}
          </dl>

          <form action={action} className="space-y-3 pt-2">
            {/* Server Action に値を渡す hidden fields */}
            {(Object.keys(formValues) as (keyof RegisterFormValues)[]).map((key) => (
              <input key={key} type="hidden" name={key} value={formValues[key]} />
            ))}
            <Button
              type="submit"
              disabled={isPending}
              className="h-11 w-full rounded-xl text-base font-semibold"
              onClick={() => sessionStorage.removeItem(SESSION_KEY)}
            >
              {isPending ? "登録中..." : "登録する"}
            </Button>
          </form>

          <Button
            variant="outline"
            className="h-11 w-full rounded-xl"
            onClick={() => router.push("/register")}
          >
            修正する
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
