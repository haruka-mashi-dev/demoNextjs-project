"use client";

import { SleepRecord } from "@/types/sleep";
import { calcSleepMinutes, formatMinutes } from "@/utils/sleep";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Moon, Trash2 } from "lucide-react";
import { deleteSleep } from "@/app/(app)/sleep/_actions/delete-sleep";

type Props = {
  sleepLogs: SleepRecord[];
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dow = days[date.getDay()];
  return `${month}/${day}(${dow})`;
}

function DaySection({ date, records, onDelete }: {
  date: string;
  records: SleepRecord[];
  onDelete: (id: number) => void;
}) {
  const nightMinutes = records
    .filter((r) => r.type === "night")
    .reduce((sum, r) => sum + calcSleepMinutes(r.bedTime, r.wakeUpTime), 0);
  const ohiruneMinutes = records
    .filter((r) => r.type === "ohirune")
    .reduce((sum, r) => sum + calcSleepMinutes(r.bedTime, r.wakeUpTime), 0);
  const totalMinutes = nightMinutes + ohiruneMinutes;

  return (
    <div className="space-y-2">
      <p className="text-sm font-bold text-slate-600">{formatDate(date)}</p>
      <div className="space-y-1">
        {records.map((r) => (
          <div key={r.id} className="flex items-center justify-between rounded-lg border bg-white px-4 py-2 text-sm">
            <span className="w-20 text-slate-500">
              [{r.type === "ohirune" ? "お昼寝" : "夜の睡眠"}]
            </span>
            <span className="text-slate-700">
              {r.bedTime} → {r.wakeUpTime}
            </span>
            <span className="text-slate-500">
              （{formatMinutes(calcSleepMinutes(r.bedTime, r.wakeUpTime))}）
            </span>
            <button onClick={() => onDelete(r.id)} className="text-slate-300 hover:text-red-400">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="border-t border-dashed border-slate-200 pt-2 space-y-1 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>[夜の睡眠]</span>
          <span>{formatMinutes(nightMinutes)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>[お昼寝]</span>
          <span>{formatMinutes(ohiruneMinutes)}</span>
        </div>
        <div className="flex justify-between font-bold text-slate-800 border-t pt-1">
          <span>合計</span>
          <span>{formatMinutes(totalMinutes)}</span>
        </div>
      </div>
    </div>
  );
}

export default function SleepList({ sleepLogs }: Props) {
  const deleteRecord = async (id: number) => {
    alert("削除してもよろしいですか？");
    await deleteSleep(id);
  };

  const grouped = sleepLogs.reduce((acc, log) => {
    if (!acc[log.date]) acc[log.date] = [];
    acc[log.date].push(log);
    return acc;
  }, {} as Record<string, SleepRecord[]>);

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <Card className="shadow-md">
      <CardHeader className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Moon className="h-6 w-6 text-slate-500" />
          <h2 className="text-lg font-semibold text-slate-800">記録一覧</h2>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {sleepLogs.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">記録がありません</p>
        ) : (
          sortedDates.map((date) => (
            <DaySection key={date} date={date} records={grouped[date]} onDelete={deleteRecord} />
          ))
        )}
      </CardContent>
    </Card>
  );
}
