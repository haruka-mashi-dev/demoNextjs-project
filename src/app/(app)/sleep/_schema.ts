import { z } from "zod/v4";

export const sleepSchema = z.object({
  date: z
    .string({ error: "入力必須です" })
    .min(1, "入力必須です")
    .refine((d) => d >= "2025-01-01", "2025年1月1日以降の日付を入力してください"),
  type: z.enum(["night", "ohirune"]),
  bedTime: z.string({ error: "入力必須です" }).min(1, "入力必須です"),
  wakeUpTime: z.string({ error: "入力必須です" }).min(1, "入力必須です"),
});
