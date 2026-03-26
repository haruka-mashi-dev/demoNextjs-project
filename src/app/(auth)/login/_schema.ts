import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email({ message: "正しいメールアドレスを入力してください" }),
  password: z
    .string()
    .min(4, { message: "4文字以上で入力してください" })
    .max(10, { message: "10文字以内で入力してください" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "半角英数字で入力してください" }),
})
