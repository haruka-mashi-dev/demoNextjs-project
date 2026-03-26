"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function deleteSleep(id: number) {
  const { error } = await supabase
    .from("sleep_records")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("削除に失敗しました:", error.message);
    return;
  }

  revalidatePath("/sleep");
}
