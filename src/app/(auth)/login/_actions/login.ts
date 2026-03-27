"use server"

import { parseWithZod } from "@conform-to/zod/v4"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { loginSchema } from "../_schema"

export async function loginAction(_prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: loginSchema })

  if (submission.status !== "success") {
    return submission.reply()
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(submission.value)

  if (error) {
    console.error("login error:", error.status, error.message, error.code)
    if (error.status === 500) throw error
    if (error.message === "Email not confirmed") {
      return submission.reply({
        formErrors: ["メールアドレスの確認が完了していません。届いたメールのリンクをクリックしてください"],
      })
    }
    return submission.reply({
      formErrors: ["メールアドレスまたはパスワードが違います"],
    })
  }

  redirect("/")
}
