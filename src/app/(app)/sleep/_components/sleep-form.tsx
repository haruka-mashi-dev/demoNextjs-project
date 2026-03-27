'use client'

import { useForm, getInputProps } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import { useActionState, useState } from "react"
import { createSleep } from "@/app/(app)/sleep/_actions/create-sleep"
import { sleepSchema } from "@/app/(app)/sleep/_schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Moon } from "lucide-react"

export default function SleepForm() {
  const today = new Date().toISOString().split("T")[0]
  const [sleepType, setSleepType] = useState<"night" | "ohirune">("night")
  const [dateValue, setDateValue] = useState(today)
  const [bedTimeValue, setBedTimeValue] = useState("")
  const [wakeUpTimeValue, setWakeUpTimeValue] = useState("")
  const isFormFilled = dateValue !== "" && bedTimeValue !== "" && wakeUpTimeValue !== ""

  // useActionState: Server Action の実行結果（submission.reply() の戻り値）を lastResult に受け取る
  const [lastResult, action, isPending] = useActionState(createSleep, undefined)

  // useForm: lastResult を conform に渡してエラー状態を同期する
  const [form, fields] = useForm({
    lastResult,
    defaultValue: {
      date: today,
      type: "night" as const,
    },
    onValidate({ formData }) {
      // ブラウザ上でも同じ Zod スキーマでバリデーション（送信前に即座にエラー表示）
      return parseWithZod(formData, { schema: sleepSchema })
    },
    shouldValidate: "onBlur",   // フォーカスが外れたタイミングでバリデーション
    shouldRevalidate: "onInput", // 入力のたびに再バリデーション
  })

  return (
    <Card className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-md">
      <CardHeader className="border-b pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-600">
          <Moon className="h-7 w-7 text-slate-500" />
          睡眠記録
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* form.id と form.onSubmit を form タグに渡すことで conform がフォームを管理する */}
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>

          {/* フォーム全体のエラー（保存失敗など） */}
          {form.errors && (
            <p className="mb-4 text-sm text-red-500">{form.errors[0]}</p>
          )}

          <div className="space-y-4">
            {/* 日付 */}
            <div className="space-y-2">
              <Label htmlFor={fields.date.id} className="text-base font-medium text-slate-700">
                日付
              </Label>
              <input
                {...getInputProps(fields.date, { type: "date" })}
                min="2025-01-01"
                max={today}
                onChange={(e) => setDateValue(e.target.value)}
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-700 shadow-sm"
              />
              {/* fields.date.errors に Zod のエラーメッセージが自動で入る */}
              {fields.date.errors && (
                <p className="text-sm text-red-500">{fields.date.errors[0]}</p>
              )}
            </div>

            {/* お昼寝チェックボックス */}
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <input type="hidden" name={fields.type.name} value={sleepType} readOnly />
              <Checkbox
                id="ohirune"
                checked={sleepType === "ohirune"}
                onCheckedChange={(checked) => setSleepType(checked ? "ohirune" : "night")}
              />
              <Label htmlFor="ohirune" className="text-sm font-medium">お昼寝</Label>
              {fields.type.errors && (
                <p className="text-sm text-red-500">{fields.type.errors[0]}</p>
              )}
            </div>

            {/* 就寝・起床時間 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={fields.bedTime.id} className="text-base font-medium text-slate-700">
                  就寝時間
                </Label>
                <Input
                  {...getInputProps(fields.bedTime, { type: "time" })}
                  onChange={(e) => setBedTimeValue(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 bg-white px-4 text-base text-slate-700 shadow-sm"
                />
                {fields.bedTime.errors && (
                  <p className="text-sm text-red-500">{fields.bedTime.errors[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={fields.wakeUpTime.id} className="text-base font-medium text-slate-700">
                  起床時間
                </Label>
                <Input
                  {...getInputProps(fields.wakeUpTime, { type: "time" })}
                  onChange={(e) => setWakeUpTimeValue(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 bg-white px-4 text-base text-slate-700 shadow-sm"
                />
                {fields.wakeUpTime.errors && (
                  <p className="text-sm text-red-500">{fields.wakeUpTime.errors[0]}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending || !isFormFilled}
              className="mt-2 h-12 w-full rounded-xl text-lg font-semibold"
            >
              {isPending ? "記録中..." : "記録する"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
