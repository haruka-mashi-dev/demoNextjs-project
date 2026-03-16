'use client'

import { useEffect, useState } from "react";

import SleepForm from "@/components/SleepForm"
import { SleepRecord } from "@/types/sleep"
import SleepList from "@/components/SleepList";
import SleepTotal from "@/components/SleepTotal";


export default function SleepPage() {
  const [sleepLogs, setSleepLogs] = useState<SleepRecord[]>([]);

  const deleteRecord = (indexToDelete: number) => {
  const newRecords = sleepLogs.filter(
    (_, index) => index !== indexToDelete
  );
  setSleepLogs(newRecords);
};

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
          👶🌙💤娘の睡眠記録👶🌙💤
        </h1>
        <p className="text-sm text-slate-500 sm:text-base">
          毎日の睡眠をかんたんに記録しましょう📝
        </p>
        </header>
        <SleepForm sleepLogs={sleepLogs} setSleepLogs={setSleepLogs} />
        <SleepList sleepLogs={sleepLogs} deleteRecord={deleteRecord} />
        <SleepTotal sleepLogs={sleepLogs}></SleepTotal>
      </div>
    </main>
  )
}