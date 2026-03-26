"use server"

import { z } from "zod"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { loginSchema } from "../_schema"

export type LoginState = {
  errorMessage: string | null
  fieldErrors?: {
    email?: string[]
    password?: string[]
  }
}

export async function loginAction(
  _prevState: LoginState | null,
  formData: FormData
): Promise<LoginState> {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!result.success) {
    return {
      errorMessage: null,
      fieldErrors: z.flattenError(result.error).fieldErrors,
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(result.data)

  if (error) {
    console.error("login error:", error.status, error.message, error.code)
    if (error.status === 500) throw error
    if (error.message === "Email not confirmed") {
      return { errorMessage: "メールアドレスの確認が完了していません。届いたメールのリンクをクリックしてください" }
    }
    return { errorMessage: "メールアドレスまたはパスワードが違います" }
  }

  redirect("/")
}
