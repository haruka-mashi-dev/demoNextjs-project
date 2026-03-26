import { z } from "zod"

export const registerSchema = z.object({
  email: z.string().email("正しいメールアドレスを入力してください"),
  password: z
    .string()
    .min(4, "4文字以上で入力してください")
    .max(10, "10文字以内で入力してください")
    .regex(/^[a-zA-Z0-9]+$/, "半角英数字で入力してください"),
  lastName: z.string().min(1, "入力してください").max(50, "50文字以内で入力してください"),
  firstName: z.string().min(1, "入力してください").max(50, "50文字以内で入力してください"),
  childName: z.string().min(1, "入力してください").max(50, "50文字以内で入力してください"),
  childNickname: z.string().min(1, "入力してください").max(50, "50文字以内で入力してください"),
  childGender: z.enum(["boy", "girl"], { message: "選択してください" }),
})
