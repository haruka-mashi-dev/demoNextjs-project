'use client'

import { useState } from "react"
import { SleepRecord } from "@/types/sleep"

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

    setSleepLogs([...sleepLogs, newRecord])

    setBedTime("")
    setWakeUpTime("")
    setIsOhirune(false)
  }

  return (
    <div>

      <label>
        <input
          type="checkbox"
          checked={isOhirune}
          onChange={(e) => setIsOhirune(e.target.checked)}
          disabled={!bedTime || !wakeUpTime}
        />
        お昼寝
      </label>

      <div>
        <label>就寝時間</label>
        <input
          type="time"
          value={bedTime}
          onChange={(e) => setBedTime(e.target.value)}
        />
      </div>

      <div>
        <label>起床時間</label>
        <input
          type="time"
          value={wakeUpTime}
          onChange={(e) => setWakeUpTime(e.target.value)}
        />
      </div>

      <button 
      onClick={addRecord}
      disabled={!bedTime || !wakeUpTime}
      style={{
        opacity: (!bedTime || !wakeUpTime) ? 0.5 : 1
      }}
      >
        記録する
      </button>

    </div>
  )
}