'use client'

import { useState } from "react"
import { SleepRecord } from "@/types/sleep"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Moon } from "lucide-react"

type Props = {
  sleepLogs: SleepRecord[]
  setSleepLogs: React.Dispatch<React.SetStateAction<SleepRecord[]>>
}

export default function SleepForm({ sleepLogs, setSleepLogs }: Props) {

  const [isOhirune, setIsOhirune] = useState(false)
  const [bedTime, setBedTime] = useState("")
  const [wakeUpTime, setWakeUpTime] = useState("")

  const addRecord = () => {

    if (!bedTime || !wakeUpTime) return

    const newRecord: SleepRecord = {
      bedTime,
      wakeUpTime,
      type: isOhirune ? "ohirune" : "night"
    };

    setSleepLogs((prev) => [...prev, newRecord])

    setBedTime("")
    setWakeUpTime("")
    setIsOhirune(false)
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <Moon className="h-6 w-6 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-800">
              今日の睡眠記録
            </h2>
          </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Checkbox 
          id="ohirune"
          checked={isOhirune}
          onCheckedChange={(checked) => setIsOhirune(checked === true)}
          disabled={!bedTime || !wakeUpTime}
          />
          <Label htmlFor="ohirune" className="text-sm font-medium">お昼寝</Label>
        </div>

        <div className="space-y-2">
          <label htmlFor="bedTime">就寝時間</label>
          <Input
            id="bedTime"
            type="time"
            value={bedTime}
            onChange={(e) => setBedTime(e.target.value)}
            className="focus-visible:ring-2 focus-visible:ring-blue-400"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="wakeUpTime">起床時間</label>
          <Input
            id="wakeUpTime"
            type="time"
            value={wakeUpTime}
            onChange={(e) => setWakeUpTime(e.target.value)}
            className="focus-visible:ring-2 focus-visible:ring-blue-400"
          />
        </div>

        <Button
        onClick={addRecord}
        disabled={!bedTime || !wakeUpTime}
        className="w-full mt-2"
        >
          記録する
        </Button>
      </CardContent>
    </Card>
  )
}