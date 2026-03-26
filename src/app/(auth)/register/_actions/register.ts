"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { registerSchema } from "../_schema"

export type RegisterState = {
  errorMessage: string | null
}

export async function registerAction(
  _prevState: RegisterState | null,
  formData: FormData
): Promise<RegisterState> {
  const result = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    lastName: formData.get("lastName"),
    firstName: formData.get("firstName"),
    childName: formData.get("childName"),
    childNickname: formData.get("childNickname"),
    childGender: formData.get("childGender"),
  })

  if (!result.success) {
    return { errorMessage: "入力内容を確認してください" }
  }

  const supabase = await createClient()

  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
  })

  if (signUpError || !authData.user) {
    console.error("signUp error:", signUpError)
    return { errorMessage: "登録に失敗しました。しばらく経ってからお試しください" }
  }

  console.log("signUp user:", JSON.stringify(authData.user, null, 2))

  const { error: profileError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    last_name: result.data.lastName,
    first_name: result.data.firstName,
    child_name: result.data.childName,
    child_nickname: result.data.childNickname,
    child_gender: result.data.childGender,
  })

  if (profileError) {
    console.error("profiles insert error:", profileError)
    return { errorMessage: "プロフィールの保存に失敗しました。しばらく経ってからお試しください" }
  }

  redirect("/register/complete")
}
