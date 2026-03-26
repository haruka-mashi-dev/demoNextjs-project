"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createSleep(
  type: "night" | "ohirune",
  bedTime: string,
  wakeUpTime: string,
  date: string
) {
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
    return;
  }

  revalidatePath("/sleep");
}
