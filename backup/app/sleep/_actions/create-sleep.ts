"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createSleep(
  type: "night" | "ohirune",
  bedTime: string,
  wakeUpTime: string,
  date: string
) {
  const { error } = await supabase.from("sleep_records").insert({
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
