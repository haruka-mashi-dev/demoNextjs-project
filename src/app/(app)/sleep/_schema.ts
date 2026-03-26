import { z } from "zod";

const today = new Date().toISOString().split("T")[0];

export const sleepSchema = z.object({
  type: z.enum(["night", "ohirune"]),
  bedTime: z.string().min(1, "就寝時間を入力してください"),
  wakeUpTime: z.string().min(1, "起床時間を入力してください"),
});

export const dateSchema = z.string()
  .min(1, "日付を入力してください")
  .refine((d) => d >= "2025-01-01", "2025年1月1日以降の日付を入力してください")
  .refine((d) => d <= today, "未来の日付は入力できません");
