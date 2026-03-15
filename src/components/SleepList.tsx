'use client'

import { SleepRecord } from "@/types/sleep";
import { calcSleepMinutes, formatMinutes } from "@/utils/sleep";

type Props = {
    sleepLogs: SleepRecord[]
    deleteRecord: (index: number) => void;
}
export default function SleepList({sleepLogs, deleteRecord}: Props) {
    if(sleepLogs.length === 0) {
        return <div>記録がありません</div>
    } 

    return(
        <div>
            <h2>記録一覧</h2>
            {sleepLogs.map((sleepLog, index) => {
                const sleepMinutes = calcSleepMinutes(sleepLog.bedTime, sleepLog.wakeUpTime);
                return(
                    <div key={index}>
                        {sleepLog.type === "ohirune" ? "お昼寝" : "夜の睡眠"}　
                        {sleepLog.bedTime} → {sleepLog.wakeUpTime}
                        （{formatMinutes(sleepMinutes)}）
                        <button onClick={() => deleteRecord(index)}>削除</button>
                    </div>
                );
            })}
        </div>
    );
}