import { z } from "zod/v4"

export const loginSchema = z.object({
  email: z
    .string({ error: "入力必須です" })
    .min(1, "メールアドレスを入力してください")
    .refine((v) => z.email().safeParse(v).success, "正しいメールアドレスを入力してください"),
  password: z
    .string({ error: "入力必須です" })
    .min(4, { message: "4文字以上で入力してください" })
    .max(10, { message: "10文字以内で入力してください" })
    .refine((v) => /^[a-zA-Z0-9]+$/.test(v), { message: "半角英数字で入力してください" }),
})
