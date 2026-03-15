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
    <div>
      <h1>👶🌙💤娘の睡眠記録👶🌙💤</h1>
      <SleepForm sleepLogs={sleepLogs} setSleepLogs={setSleepLogs} />
      <SleepList sleepLogs={sleepLogs} deleteRecord={deleteRecord} />
      <SleepTotal sleepLogs={sleepLogs}></SleepTotal>
    </div>
  )
}