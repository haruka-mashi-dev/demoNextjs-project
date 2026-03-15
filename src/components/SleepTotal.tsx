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
        <div>
            <h3>合計値</h3>
            <div>夜の睡眠：{formatMinutes(nightTotalMinutes)}</div>
            <div>お昼寝：{formatMinutes(ohiruneTotalMinutes)}</div>
            <div>合計：{formatMinutes(totalMinutes)}</div>
        </div>
    );
}