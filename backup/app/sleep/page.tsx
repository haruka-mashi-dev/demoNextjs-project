import SleepForm from "@/app/sleep/_components/sleep-form"
import SleepList from "@/app/sleep/_components/sleep-list";
import { supabase } from "@/lib/supabase";
import { SleepRecord } from "@/types/sleep";

export default async function SleepPage() {
  const { data, error } = await supabase
    .from("sleep_records")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("データ取得に失敗しました:", error.message);
  }

  const sleepLogs: SleepRecord[] = (data ?? []).map((row) => ({
    id: row.id,
    date: row.date,
    bedTime: row.bed_time,
    wakeUpTime: row.wake_up_time,
    type: row.type,
  }));

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
            Sleep Log
          </h1>
          <p className="text-sm text-slate-500 sm:text-base">
            日々の睡眠をかんたんに記録しましょう📝
          </p>
        </header>
        <SleepForm />
        <div className="grid gap-6">
          <SleepList sleepLogs={sleepLogs} />
        </div>
      </div>
    </main>
  )
}