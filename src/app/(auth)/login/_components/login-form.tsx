"use client"

import { useState, useActionState } from "react"
import { useForm, getInputProps } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import { loginAction } from "../_actions/login"
import { loginSchema } from "../_schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export default function LoginForm() {
  const [lastResult, action, isPending] = useActionState(loginAction, undefined)
  const [showPassword, setShowPassword] = useState(false)

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginSchema })
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  })

  return (
    <Card className="w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-md">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-xl font-bold text-slate-600">ログイン</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate className="space-y-4">

          {/* 認証エラー・メール未確認など全体エラー */}
          {form.errors && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {form.errors[0]}
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor={fields.email.id}>メールアドレス</Label>
            {fields.email.errors && (
              <p className="text-sm text-red-500">{fields.email.errors[0]}</p>
            )}
            <Input
              {...getInputProps(fields.email, { type: "email" })}
              autoComplete="email"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={fields.password.id}>パスワード</Label>
            {fields.password.errors && (
              <p className="text-sm text-red-500">{fields.password.errors[0]}</p>
            )}
            <div className="relative">
              <Input
                {...getInputProps(fields.password, { type: showPassword ? "text" : "password" })}
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
