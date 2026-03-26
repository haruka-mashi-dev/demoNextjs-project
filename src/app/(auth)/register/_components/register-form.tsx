"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { registerSchema } from "../_schema"
import type { RegisterFormValues, RegisterFieldErrors } from "@/types/user"
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
  const [errors, setErrors] = useState<RegisterFieldErrors | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  // マウント時に sessionStorage から復元（確認画面から戻ったとき）
  const [form, setForm] = useState<RegisterFormValues>(() => {
    if (typeof window === "undefined") return defaultForm
    const saved = sessionStorage.getItem(SESSION_KEY)
    return saved ? (JSON.parse(saved) as RegisterFormValues) : defaultForm
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = registerSchema.safeParse(form)
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as RegisterFieldErrors)
      return
    }
    setErrors(null)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(form))
    router.push("/register/confirm")
  }

  const field = (name: keyof RegisterFormValues) => ({
    value: form[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [name]: e.target.value })),
  })

  return (
    <Card className="w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-md">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-xl font-bold text-slate-600">新規登録</CardTitle>
        <p className="text-sm text-slate-500">必要な情報を入力してください</p>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* メールアドレス */}
          <div className="space-y-1">
            <Label htmlFor="email">メールアドレス</Label>
            {errors?.email?.map((msg) => <p key={msg} className="text-sm text-red-500">{msg}</p>)}
            <Input id="email" type="email" autoComplete="email" className="h-11 rounded-xl" {...field("email")} />
          </div>

          {/* パスワード */}
          <div className="space-y-1">
            <Label htmlFor="password">パスワード</Label>
            {errors?.password?.map((msg) => <p key={msg} className="text-sm text-red-500">{msg}</p>)}
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="h-11 rounded-xl pr-10"
                {...field("password")}
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
                {errors?.lastName?.map((msg) => <p key={msg} className="text-sm text-red-500">{msg}</p>)}
                <Input placeholder="名字" className="h-11 rounded-xl" {...field("lastName")} />
              </div>
              <div>
                {errors?.firstName?.map((msg) => <p key={msg} className="text-sm text-red-500">{msg}</p>)}
                <Input placeholder="名前" className="h-11 rounded-xl" {...field("firstName")} />
              </div>
            </div>
          </div>

          {/* お子様情報 */}
          <div className="space-y-2">
            <Label>お子様情報</Label>
            <div>
              {errors?.childName?.map((msg) => <p key={msg} className="text-sm text-red-500">{msg}</p>)}
              <Input placeholder="お子様の名前" className="h-11 rounded-xl" {...field("childName")} />
            </div>
            <div>
              {errors?.childNickname?.map((msg) => <p key={msg} className="text-sm text-red-500">{msg}</p>)}
              <Input placeholder="お子様のニックネーム" className="h-11 rounded-xl" {...field("childNickname")} />
            </div>
            <div>
              {errors?.childGender?.map((msg) => <p key={msg} className="text-sm text-red-500">{msg}</p>)}
              <div className="flex gap-3 pt-1">
                {(["girl", "boy"] as const).map((g) => (
                  <label key={g} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="childGender"
                      value={g}
                      checked={form.childGender === g}
                      onChange={() => setForm((prev) => ({ ...prev, childGender: g }))}
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
