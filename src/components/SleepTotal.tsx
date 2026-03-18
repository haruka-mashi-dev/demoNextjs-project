'use client'

import { SleepRecord } from "@/types/sleep";
import { calcSleepMinutes, formatMinutes} from "@/utils/sleep";

type Props = {
    sleepLogs: SleepRecord[]
}

export default function SleepTotal({sleepLogs}: Props) {
    if (sleepLogs.length === 0) return null;

    const nightTotalMinutes = sleepLogs.reduce((sum, record) => {
    if (record.type === "night") {
        return sum + calcSleepMinutes(record.bedTime, record.wakeUpTime);
    }
    return sum;
    }, 0);

    const ohiruneTotalMinutes = sleepLogs.reduce((sum, record) => {
    if(record.type === "ohirune") {
        return sum + calcSleepMinutes(record.bedTime, record.wakeUpTime);
    } 
    return sum;
    }, 0);

    const totalMinutes = sleepLogs.reduce((sum, record) => {
        return sum + calcSleepMinutes(record.bedTime, record.wakeUpTime);
    }, 0);

    return (
        <div className="border-t border-slate-200 pt-4">
            <p className="text-sm text-slate-500">合計</p>
            <p className="text-sm text-slate-500">夜の睡眠：{formatMinutes(nightTotalMinutes)}</p>
            <p className="text-sm text-slate-500">お昼寝：{formatMinutes(ohiruneTotalMinutes)}</p>
            <p className="text-sm text-slate-500">合計：{formatMinutes(totalMinutes)}</p>
        </div>
    );
}