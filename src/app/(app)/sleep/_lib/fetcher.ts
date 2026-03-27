import "server-only";

import { createClient } from "@/lib/supabase/server";
import { SleepRecord } from "@/types/sleep";

const PAGE_SIZE = 5;

function toDateStr(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function fetchSleepLogs(page: number): Promise<SleepRecord[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endDate = new Date(today);
  endDate.setDate(today.getDate() - (page - 1) * PAGE_SIZE);

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - page * PAGE_SIZE + 1);

  const { data, error } = await supabase
    .from("sleep_records")
    .select("*")
    .eq("user_id", user?.id)
    .gte("date", toDateStr(startDate))
    .lte("date", toDateStr(endDate))
    .order("date", { ascending: false });

  if (error) {
    console.error("データ取得に失敗しました:", error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    date: row.date,
    bedTime: row.bed_time.slice(0, 5),
    wakeUpTime: row.wake_up_time.slice(0, 5),
    type: row.type,
  }));
}

export async function fetchHasNextPage(page: number): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - page * PAGE_SIZE + 1);

  const prevDate = new Date(startDate);
  prevDate.setDate(startDate.getDate() - 1);

  const { count } = await supabase
    .from("sleep_records")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id)
    .lte("date", toDateStr(prevDate));

  return (count ?? 0) > 0;
}
