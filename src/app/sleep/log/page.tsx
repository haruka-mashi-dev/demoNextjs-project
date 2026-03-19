import SleepForm from "@/app/sleep/_components/sleep-form"
import SleepList from "@/app/sleep/_components/sleep-list";
import { supabase } from "@/lib/supabase";
import { SleepRecord } from "@/types/sleep";

export default async function SleepLogPage() {
  const { data, error } = await supabase
    .from("sleep_records")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("データ取得に失敗しました:", error.message);
  }

  const sleepLogs: SleepRecord[] = (data ?? []).map((row) => ({
    id: row.id,
    bedTime: row.bed_time,
    wakeUpTime: row.wake_up_time,
    type: row.type,
  }));

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <SleepForm />
        <SleepList sleepLogs={sleepLogs} />
      </div>
    </main>
  )
}
