"use server";

import { parseWithZod } from "@conform-to/zod/v4";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sleepSchema } from "@/app/(app)/sleep/_schema";

export async function createSleep(_prevState: unknown, formData: FormData) {
  const today = new Date().toISOString().split("T")[0];

  // parseWithZod: Zod スキーマで formData をバリデーション
  // バリデーション失敗時は { status: "error", ... } を返す（conform がエラー表示に使う）
  const submission = parseWithZod(formData, {
    schema: sleepSchema.refine(
      (data) => data.date <= today,
      { message: "未来の日付は入力できません", path: ["date"] }
    ),
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { date, type, bedTime, wakeUpTime } = submission.value;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("sleep_records").insert({
    user_id: user?.id,
    type,
    bed_time: bedTime,
    wake_up_time: wakeUpTime,
    date,
  });

  if (error) {
    console.error("保存に失敗しました:", error.message);
    return submission.reply({ formErrors: ["保存に失敗しました。もう一度お試しください。"] });
  }

  revalidatePath("/sleep");
  return submission.reply({ resetForm: true });
}
