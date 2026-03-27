import { z } from "zod/v4"

export const registerSchema = z.object({
  email: z
    .string({ error: "入力必須です" })
    .min(1, "入力必須です")
    .refine((v) => z.email().safeParse(v).success, "正しいメールアドレスを入力してください"),
  password: z
    .string({ error: "入力必須です" })
    .min(4, "4文字以上で入力してください")
    .max(10, "10文字以内で入力してください")
    .refine((v) => /^[a-zA-Z0-9]+$/.test(v), { message: "半角英数字で入力してください" }),
  lastName: z.string({ error: "入力必須です" }).min(1, "入力必須です").max(50, "50文字以内で入力してください"),
  firstName: z.string({ error: "入力必須です" }).min(1, "入力必須です").max(50, "50文字以内で入力してください"),
  childName: z.string({ error: "入力必須です" }).min(1, "入力必須です").max(50, "50文字以内で入力してください"),
  childNickname: z.string({ error: "入力必須です" }).min(1, "入力必須です").max(50, "50文字以内で入力してください"),
  childGender: z.enum(["boy", "girl"], { message: "選択してください" }),
})
