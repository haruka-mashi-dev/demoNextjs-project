"use client"

import { useState, useActionState } from "react"
import { loginAction } from "../_actions/login"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export default function LoginForm() {
  const [state, action, isPending] = useActionState(loginAction, null)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Card className="w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-md">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-xl font-bold text-slate-600">ログイン</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        {state?.errorMessage && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {state.errorMessage}
          </p>
        )}

        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            {state?.fieldErrors?.email?.map((msg) => (
              <p key={msg} className="text-sm text-red-500">{msg}</p>
            ))}
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            {state?.fieldErrors?.password?.map((msg) => (
              <p key={msg} className="text-sm text-red-500">{msg}</p>
            ))}
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="h-11 rounded-xl pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="h-11 w-full rounded-xl text-base font-semibold"
          >
            {isPending ? "ログイン中..." : "ログイン"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          アカウントをお持ちでない方は{" "}
          <a href="/register" className="text-blue-500 underline">
            新規登録
          </a>
        </p>
      </CardContent>
    </Card>
  )
}
