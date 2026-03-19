'use client'

import { useState } from "react"
import { createSleep } from "@/app/sleep/_actions/create-sleep"
import { dateSchema } from "@/app/sleep/_schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock3, Moon } from "lucide-react"

export default function SleepForm() {
  const [isOhirune, setIsOhirune] = useState(false)
  const [bedTime, setBedTime] = useState("")
  const [wakeUpTime, setWakeUpTime] = useState("")
  const [sleepDate, setSleepDate] = useState(() => new Date().toISOString().split("T")[0])
  const [dateError, setDateError] = useState("")
  const today = new Date().toISOString().split("T")[0]

  const addRecord = async () => {
    if (!bedTime || !wakeUpTime) return

    const result = dateSchema.safeParse(sleepDate)
    if (!result.success) {
      setDateError(result.error.issues[0].message)
      return
    }
    setDateError("")

    await createSleep(isOhirune ? "ohirune" : "night", bedTime, wakeUpTime, sleepDate)

    setBedTime("")
    setWakeUpTime("")
    setIsOhirune(false)
  }

  return (
    <Card className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-md">
      <CardHeader className="border-b pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-600">
          <Moon className="h-7 w-7 text-slate-500" />
          睡眠記録
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-base font-medium text-slate-700">
              日付
            </Label>
            <div className="relative">
              <input
                  id="sleepDate"
                  type="date"
                  value={sleepDate}
                  onChange={(e) => setSleepDate(e.target.value)}
                  min="2025-01-01"
                  max={today}
                  className="h-12 rounded-xl border-slate-200 bg-white px-4 text-base text-slate-700 shadow-sm"
                />
            </div>
            {dateError && <p className="text-sm text-red-500">{dateError}</p>}
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <Checkbox
              id="ohirune"
              checked={isOhirune}
              onCheckedChange={(checked) => setIsOhirune(checked === true)}
              disabled={!bedTime || !wakeUpTime}
            />
            <Label htmlFor="ohirune" className="text-sm font-medium">お昼寝</Label>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="wakeUpTime" className="text-base font-medium text-slate-700">就寝時間</Label>
                <div className="relative">
                <Input
                  id="bedTime"
                  type="time"
                  value={bedTime}
                  onChange={(e) => setBedTime(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 bg-white px-4 text-base text-slate-700 shadow-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="wakeUpTime" className="text-base font-medium text-slate-700">
                起床時間
              </Label>
              <div className="relative">
              <Input
                id="wakeUpTime"
                type="time"
                value={wakeUpTime}
                onChange={(e) => setWakeUpTime(e.target.value)}
                className="h-12 rounded-xl border-slate-200 bg-white px-4 text-base text-slate-700 shadow-sm"
              />
              </div>
            </div>
        </div>

          <Button
            onClick={addRecord}
            disabled={!bedTime || !wakeUpTime}
            className="mt-2 h-12 w-full rounded-xl text-lg font-semibold" 
          >
            記録する
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
