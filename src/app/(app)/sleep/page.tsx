import SleepForm from "@/app/(app)/sleep/_components/sleep-form"
import SleepList from "@/app/(app)/sleep/_components/sleep-list";
import SleepPagination from "@/app/(app)/sleep/_components/sleep-pagination";
import AppHeader from "@/app/(app)/_components/app-header";
import { createClient } from "@/lib/supabase/server";
import { SleepRecord } from "@/types/sleep";

const PAGE_SIZE = 5;

function toDateStr(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default async function SleepPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

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

  const sleepLogs: SleepRecord[] = (data ?? []).map((row) => ({
    id: row.id,
    date: row.date,
    bedTime: row.bed_time.slice(0, 5),
    wakeUpTime: row.wake_up_time.slice(0, 5),
    type: row.type,
  }));

  // startDate より前のデータが存在するか確認
  const prevDate = new Date(startDate);
  prevDate.setDate(startDate.getDate() - 1);
  const { count } = await supabase
    .from("sleep_records")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id)
    .lte("date", toDateStr(prevDate));
  const hasNextPage = (count ?? 0) > 0;

  return (
    <>
      <AppHeader title="Sleep Log" backHref="/" />
      <main className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <SleepForm />
          <SleepList sleepLogs={sleepLogs} />
          <SleepPagination currentPage={page} hasNextPage={hasNextPage} />
        </div>
      </main>
    </>
  )
}
