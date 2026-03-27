"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, getInputProps } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import { registerSchema } from "../_schema"
import type { RegisterFormValues } from "@/types/user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

const SESSION_KEY = "registerFormValues"

const defaultForm: RegisterFormValues = {
  email: "",
  password: "",
  lastName: "",
  firstName: "",
  childName: "",
  childNickname: "",
  childGender: "girl",
}

export default function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  // マウント時に sessionStorage から復元（確認画面から戻ったとき）
  const [formState, setFormState] = useState<RegisterFormValues>(() => {
    if (typeof window === "undefined") return defaultForm
    const saved = sessionStorage.getItem(SESSION_KEY)
    return saved ? (JSON.parse(saved) as RegisterFormValues) : defaultForm
  })

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: registerSchema })
    },
    onSubmit(event, { submission }) {
      event.preventDefault()
      // バリデーション失敗時は conform がエラーを表示するので何もしない
      if (!submission || submission.status !== "success") return
      // 成功時: sessionStorage に保存して確認画面へ
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(formState))
      router.push("/register/confirm")
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  })

  const handleChange = (name: keyof RegisterFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormState((prev) => ({ ...prev, [name]: e.target.value }))

  return (
    <Card className="w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-md">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-xl font-bold text-slate-600">新規登録</CardTitle>
        <p className="text-sm text-slate-500">必要な情報を入力してください</p>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        <form id={form.id} onSubmit={form.onSubmit} noValidate className="space-y-4">

          {/* メールアドレス */}
          <div className="space-y-1">
            <Label htmlFor={fields.email.id}>メールアドレス</Label>
            {fields.email.errors && (
              <p className="text-sm text-red-500">{fields.email.errors[0]}</p>
            )}
            <Input
              {...getInputProps(fields.email, { type: "email" })}
              value={formState.email}
              onChange={handleChange("email")}
              autoComplete="email"
              className="h-11 rounded-xl"
            />
          </div>

          {/* パスワード */}
          <div className="space-y-1">
            <Label htmlFor={fields.password.id}>パスワード</Label>
            {fields.password.errors && (
              <p className="text-sm text-red-500">{fields.password.errors[0]}</p>
            )}
            <div className="relative">
              <Input
                {...getInputProps(fields.password, { type: showPassword ? "text" : "password" })}
                value={formState.password}
                onChange={handleChange("password")}
                autoComplete="new-password"
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

          {/* 保護者情報 */}
          <div className="space-y-1">
            <Label>保護者情報</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                {fields.lastName.errors && (
                  <p className="text-sm text-red-500">{fields.lastName.errors[0]}</p>
                )}
                <Input
                  {...getInputProps(fields.lastName, { type: "text" })}
                  value={formState.lastName}
                  onChange={handleChange("lastName")}
                  placeholder="名字"
                  className="h-11 rounded-xl"
                />
              </div>
              <div>
                {fields.firstName.errors && (
                  <p className="text-sm text-red-500">{fields.firstName.errors[0]}</p>
                )}
                <Input
                  {...getInputProps(fields.firstName, { type: "text" })}
                  value={formState.firstName}
                  onChange={handleChange("firstName")}
                  placeholder="名前"
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* お子様情報 */}
          <div className="space-y-2">
            <Label>お子様情報</Label>
            <div>
              {fields.childName.errors && (
                <p className="text-sm text-red-500">{fields.childName.errors[0]}</p>
              )}
              <Input
                {...getInputProps(fields.childName, { type: "text" })}
                value={formState.childName}
                onChange={handleChange("childName")}
                placeholder="お子様の名前"
                className="h-11 rounded-xl"
              />
            </div>
            <div>
              {fields.childNickname.errors && (
                <p className="text-sm text-red-500">{fields.childNickname.errors[0]}</p>
              )}
              <Input
                {...getInputProps(fields.childNickname, { type: "text" })}
                value={formState.childNickname}
                onChange={handleChange("childNickname")}
                placeholder="お子様のニックネーム"
                className="h-11 rounded-xl"
              />
            </div>
            {/* ラジオボタンは getInputProps が対応しないため name のみ conform から取得 */}
            <div>
              {fields.childGender.errors && (
                <p className="text-sm text-red-500">{fields.childGender.errors[0]}</p>
              )}
              <div className="flex gap-3 pt-1">
                {(["girl", "boy"] as const).map((g) => (
                  <label key={g} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name={fields.childGender.name}
                      value={g}
                      checked={formState.childGender === g}
                      onChange={() => setFormState((prev) => ({ ...prev, childGender: g }))}
                    />
                    <span className="text-sm">{g === "girl" ? "女の子" : "男の子"}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <Button type="submit" className="h-11 w-full rounded-xl text-base font-semibold">
            確認画面へ
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          すでにアカウントをお持ちですか？{" "}
          <a href="/login" className="text-blue-500 underline">ログイン画面</a>
        </p>
      </CardContent>
    </Card>
  )
}
