'use client'

import { SleepRecord } from "@/types/sleep";
import { calcSleepMinutes, formatMinutes } from "@/utils/sleep";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { Moon } from "lucide-react";

type Props = {
    sleepLogs: SleepRecord[]
    deleteRecord: (index: number) => void;
}
export default function SleepList({sleepLogs, deleteRecord}: Props) {
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

     return(
        <Card className="shadow-md">
            <CardHeader className="border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                <Moon className="h-6 w-6 text-slate-500" />
                <h2 className="text-lg font-semibold text-slate-800">
                    記録一覧
                </h2>
                </div>
            </CardHeader>

            <CardContent>
            {sleepLogs.length === 0 ?(
                <p className="py-6 text-center text-sm text-muted-foreground">
                    記録がありません
                </p>
            ) : (
                <div className="space-y-3">
                    {sleepLogs.map((sleepLog, index) => {
                    const sleepMinutes = calcSleepMinutes(sleepLog.bedTime, sleepLog.wakeUpTime);
                    return(
                        <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-1">
                                <Badge variant="secondary">
                                    {sleepLog.type === "ohirune" ? "お昼寝" : "夜の睡眠"}　
                                </Badge>
                            </div>
                            <p>
                                {sleepLog.bedTime} → {sleepLog.wakeUpTime}
                            </p>
                            <p>
                                （{formatMinutes(sleepMinutes)}）
                            </p>
                            <Button variant="outline" size="sm" onClick={() => deleteRecord(index)}>
                                削除
                            </Button>
                        </div>
                    );
                    })}
                    <div className="border-t border-slate-200 pt-4 space-y-3">

                    {/* 夜 */}
                    <div className="flex items-center justify-between">
                        <Badge className="bg-blue-100 text-blue-700">
                        夜の睡眠
                        </Badge>
                        <p className="text-sm font-medium text-slate-800">
                        {formatMinutes(nightTotalMinutes)}
                        </p>
                    </div>

                    {/* お昼寝 */}
                    <div className="flex items-center justify-between">
                        <Badge className="bg-yellow-100 text-yellow-700">
                        お昼寝
                        </Badge>
                        <p className="text-sm font-medium text-slate-800">
                        {formatMinutes(ohiruneTotalMinutes)}
                        </p>
                    </div>

                    {/* 合計 */}
                    <div className="flex items-center justify-between border-t pt-3 mt-2">
                        <p className="text-base font-bold text-slate-800">
                        合計
                        </p>
                        <p className="text-xl font-bold text-slate-800">
                        {formatMinutes(totalMinutes)}
                        </p>
                    </div>

                    </div>
                </div>
            )}
            </CardContent>
        </Card>
    );
}