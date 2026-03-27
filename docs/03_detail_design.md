# 育児記録アプリ 詳細設計書

---

## 1. 認証機能

### 1-1. LoginForm

#### コンポーネント概要

| 項目 | 内容 |
|------|------|
| ファイルパス | `app/(auth)/login/_components/login-form.tsx` |
| 種別 | Client Component |
| 責務 | メール・パスワード入力、Server Action呼び出し、エラー表示 |

#### Props

なし（自己完結）

#### State

```typescript
const [state, action, isPending] = useActionState(loginAction, null)
// state.errorMessage  → 認証失敗時のエラーメッセージ
// state.fieldErrors   → バリデーションエラー（項目ごと）
// isPending           → 送信中フラグ（ボタンのdisabled制御に使用）
```

#### イベント処理

| イベント | 処理 |
|----------|------|
| フォーム送信 | `<form action={action}>` でServer Actionに委譲 |
| 送信中 | `isPending=true` のときボタンをdisabledにする |

#### 表示制御

| 条件 | 表示 |
|------|------|
| `state.fieldErrors.email` あり | メールアドレス入力欄の上にエラーメッセージ |
| `state.fieldErrors.password` あり | パスワード入力欄の上にエラーメッセージ |
| `state.errorMessage` あり | フォーム上部に認証失敗メッセージ |
| `isPending=true` | 送信ボタンをdisabled・ローディング表示 |

---

### 1-2. loginAction（Server Action）

#### ファイルパス

`app/(auth)/login/_actions/login.ts`

#### 型定義

```typescript
type LoginState = {
  errorMessage: string | null
  fieldErrors?: {
    email?: string[]
    password?: string[]
  }
}
```

#### 処理フロー

```
1. formDataからemail・passwordを取得
      ↓
2. Zodバリデーション（loginSchema）
      ↓ 失敗
      fieldErrorsを返す
      ↓ 成功
3. Supabase Auth signInWithPassword() 呼び出し
      ↓ status=500
      throwして500エラー画面へ
      ↓ その他エラー（認証失敗）
      errorMessage「メールアドレスまたはパスワードが違います」を返す
      ↓ 成功
4. redirect("/")  → メニューTOP画面へ
```

#### コード概要

```typescript
// app/(auth)/login/_actions/login.ts
"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { loginSchema } from "../_schema"

export async function loginAction(
  prevState: LoginState | null,
  formData: FormData
): Promise<LoginState> {
  // ステップ1: バリデーション
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!result.success) {
    return { errorMessage: null, fieldErrors: result.error.flatten().fieldErrors }
  }

  // ステップ2: Supabase認証
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword(result.data)
  if (error) {
    if (error.status === 500) throw error
    return { errorMessage: "メールアドレスまたはパスワードが違います" }
  }

  // ステップ3: 認証成功
  redirect("/")
}
```

---

### 1-3. loginSchema（バリデーション）

#### ファイルパス

`app/(auth)/login/_schema.ts`

#### バリデーションルール

| フィールド | ルール | エラーメッセージ |
|------------|--------|------------------|
| `email` | 必須・メール形式 | 「正しいメールアドレスを入力してください」 |
| `password` | 必須・半角英数字・4〜10文字 | 「4文字以上で入力してください」「10文字以内で入力してください」「半角英数字で入力してください」 |

```typescript
// app/(auth)/login/_schema.ts
import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("正しいメールアドレスを入力してください"),
  password: z
    .string()
    .min(4, "4文字以上で入力してください")
    .max(10, "10文字以内で入力してください")
    .regex(/^[a-zA-Z0-9]+$/, "半角英数字で入力してください"),
})
```

---

### 1-4. RegisterForm

#### コンポーネント概要

| 項目 | 内容 |
|------|------|
| ファイルパス | `app/(auth)/register/_components/register-form.tsx` |
| 種別 | Client Component |
| 責務 | ユーザ情報入力、バリデーション、sessionStorageへの保存、確認画面への遷移 |

#### Props

なし（自己完結）

#### State

```typescript
const [errors, setErrors] = useState<RegisterFieldErrors | null>(null)
// errors → バリデーションエラー（項目ごと）

// sessionStorageに保存するデータ
// キー: "registerFormValues"
// 値: RegisterFormValues（JSON文字列）
```

#### イベント処理

| イベント | 処理 |
|----------|------|
| フォーム送信 | Zodバリデーション → 成功時sessionStorage保存 → confirm画面へ遷移 |
| 画面表示時 | sessionStorageに値があれば入力欄に復元する |

#### 処理フロー

```
画面表示時
  ↓ sessionStorage["registerFormValues"] を確認
  ↓ あれば各入力欄に値を復元する

送信ボタン押下
  ↓
Zodバリデーション（registerSchema）
  ↓ 失敗 → 各入力欄の上にエラーメッセージを表示
  ↓ 成功
sessionStorage["registerFormValues"] に入力値を保存（JSON）
  ↓
router.push("/register/confirm")
```

#### 表示制御

| 条件 | 表示 |
|------|------|
| `errors.email` あり | メールアドレス入力欄の上にエラーメッセージ |
| `errors.password` あり | パスワード入力欄の上にエラーメッセージ |
| `errors.lastName` あり | 名字入力欄の上にエラーメッセージ |
| `errors.firstName` あり | 名前入力欄の上にエラーメッセージ |
| `errors.childName` あり | 娘の名前入力欄の上にエラーメッセージ |
| `errors.childNickname` あり | 娘のニックネーム入力欄の上にエラーメッセージ |
| `errors.childGender` あり | 性別選択欄の上にエラーメッセージ |

---

### 1-5. RegisterConfirmPage（確認画面）

#### コンポーネント概要

| 項目 | 内容 |
|------|------|
| ファイルパス | `app/(auth)/register/confirm/page.tsx` |
| 種別 | Client Component |
| 責務 | sessionStorageから入力値を読み込み表示、登録処理の呼び出し |

#### State

```typescript
const [formValues, setFormValues] = useState<RegisterFormValues | null>(null)
const [state, action, isPending] = useActionState(registerAction, null)
// formValues → sessionStorageから読み込んだ入力値
```

#### 処理フロー

```
画面表示時
  ↓ sessionStorage["registerFormValues"] を読み込む
  ↓ なければ /register にリダイレクト
  ↓ あれば formValues にセットして入力内容を表示

「修正する」ボタン押下
  ↓ sessionStorageのデータはそのまま残す
  ↓ router.push("/register")

「登録する」ボタン押下
  ↓ registerAction（Server Action）呼び出し
  ↓ 失敗 → エラーメッセージ表示
  ↓ 成功 → sessionStorageのデータを削除
           → redirect("/register/complete")
```

---

### 1-6. registerAction（Server Action）

#### ファイルパス

`app/(auth)/register/_actions/register.ts`

#### 型定義

```typescript
type RegisterState = {
  errorMessage: string | null
}
```

#### 処理フロー

```
1. formDataからすべての入力値を取得
      ↓
2. Zodバリデーション（registerSchema）
      ↓ 失敗 → errorMessageを返す
      ↓ 成功
3. Supabase Auth signUp() でユーザ作成
      ↓ 失敗 → errorMessage「登録に失敗しました。しばらく経ってからお試しください」を返す
      ↓ 成功
4. profilesテーブルにユーザ情報をinsert
      ↓ 失敗 → errorMessage を返す
      ↓ 成功
5. redirect("/register/complete")
```

---

### 1-7. registerSchema（バリデーション）

#### ファイルパス

`app/(auth)/register/_schema.ts`

#### バリデーションルール

| フィールド | ルール | エラーメッセージ |
|------------|--------|------------------|
| `email` | 必須・メール形式 | 「正しいメールアドレスを入力してください」 |
| `password` | 必須・半角英数字・4〜10文字 | 「4文字以上で入力してください」「10文字以内で入力してください」「半角英数字で入力してください」 |
| `lastName` | 必須・50文字以内 | 「入力してください」「50文字以内で入力してください」 |
| `firstName` | 必須・50文字以内 | 「入力してください」「50文字以内で入力してください」 |
| `childName` | 必須・50文字以内 | 「入力してください」「50文字以内で入力してください」 |
| `childNickname` | 必須・50文字以内 | 「入力してください」「50文字以内で入力してください」 |
| `childGender` | 必須・`boy`または`girl` | 「選択してください」 |


```typescript
// app/(auth)/register/_schema.ts
import { z } from "zod"

export const registerSchema = z.object({
  email: z.string().email("正しいメールアドレスを入力してください"),
  password: z
    .string()
    .min(4, "4文字以上で入力してください")
    .max(10, "10文字以内で入力してください")
    .regex(/^[a-zA-Z0-9]+$/, "半角英数字で入力してください"),
  lastName: z.string().min(1, "入力してください").max(50, "50文字以内で入力してください"),
  firstName: z.string().min(1, "入力してください").max(50, "50文字以内で入力してください"),
  childName: z.string().min(1, "入力してください").max(50, "50文字以内で入力してください"),
  childNickname: z.string().min(1, "入力してください").max(50, "50文字以内で入力してください"),
  childGender: z.enum(["boy", "girl"], { message: "選択してください" }),
})
```

---

## 2. 共通ヘッダー

### 2-1. AppHeader

#### コンポーネント概要

| 項目 | 内容 |
|------|------|
| ファイルパス | `app/(app)/_components/app-header.tsx` |
| 種別 | Server Component |
| 責務 | ページタイトルの表示、メニューTOPへの戻るボタン、ログアウトボタン |

#### Props

```typescript
type AppHeaderProps = {
  title: string        // ページタイトル（例: "Sleep Log"）
  backHref?: string    // 戻るリンク先。省略時は戻るボタンを非表示
}
```

#### 表示内容

```
┌──────────────────────────────────────┐
│ [← 戻る]   Sleep Log   [ログアウト]  │
└──────────────────────────────────────┘
```

| 要素 | 条件 | 内容 |
|------|------|------|
| 戻るボタン | `backHref` あり | `<Link href={backHref}>← 戻る</Link>` |
| タイトル | 常に表示 | `title` props の文字列 |
| ログアウトボタン | 常に表示 | クリックで `logoutAction` を呼び出す |

#### ログアウト処理

```typescript
// app/(app)/_actions/logout.ts
"use server"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
```

#### 使用例

```tsx
// 睡眠記録ページ
<AppHeader title="Sleep Log" backHref="/" />

// メニューTOPページ（戻るボタンなし）
<AppHeader title="まーちゃんの記録" />
```

---

## 4. 睡眠記録機能

### 4-1. SleepPage（page.tsx）

#### コンポーネント概要

| 項目 | 内容 |
|------|------|
| ファイルパス | `app/(app)/sleep/page.tsx` |
| 種別 | Server Component |
| 責務 | SearchParams からページ番号を取得し、SleepContainer に渡す（ルート定義のみ） |

#### SearchParams

| パラメータ | 型 | デフォルト | 説明 |
|------------|-----|-----------|------|
| `page` | `number` | `1` | 表示するページ番号 |

#### 処理フロー

```
1. searchParams.page を取得（なければ1）
      ↓
2. SleepContainer に page を渡して描画
```

---

### 4-2. fetcher（サーバー専用データ取得）

#### ファイルパス

`app/(app)/sleep/_lib/fetcher.ts`

#### 概要

Supabase へのクエリ関数を集約する。先頭に `import "server-only"` を記述することで、Client Component からのインポートをビルドエラーとして検出する。

```typescript
import "server-only"  // Client Component からのインポートでビルドエラーになる
```

#### 関数一覧

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| `fetchSleepLogs` | `page: number` | `SleepRecord[]` | 指定ページの睡眠記録を取得 |
| `fetchHasNextPage` | `page: number` | `boolean` | 次ページのデータが存在するか確認 |

#### 日付範囲計算ロジック

```typescript
const PAGE_SIZE = 5
const today = new Date()
const endDate = new Date(today)
endDate.setDate(today.getDate() - (page - 1) * PAGE_SIZE)
const startDate = new Date(today)
startDate.setDate(today.getDate() - page * PAGE_SIZE + 1)

// hasNextPage: startDate の前日以前のデータが存在するか
const prevDate = new Date(startDate)
prevDate.setDate(startDate.getDate() - 1)
const { count } = await supabase
  .from("sleep_records")
  .select("*", { count: "exact", head: true })
  .eq("user_id", userId)
  .lte("date", toDateStr(prevDate))
```

---

### 4-3. SleepContainer

#### コンポーネント概要

| 項目 | 内容 |
|------|------|
| ファイルパス | `app/(app)/sleep/_components/sleep-container.tsx` |
| 種別 | Server Component |
| 責務 | fetcher を呼び出してデータを取得し、子コンポーネントへ props を渡す |

#### Props

```typescript
type Props = {
  page: number
}
```

#### 処理フロー

```
1. fetchSleepLogs(page) と fetchHasNextPage(page) を並列実行（Promise.all）
      ↓
2. SleepForm・SleepList・SleepPagination に props を渡す
```

---

### 4-4. SleepForm

#### コンポーネント概要

| 項目 | 内容 |
|------|------|
| ファイルパス | `app/(app)/sleep/_components/sleep-form.tsx` |
| 種別 | Client Component |
| 責務 | 日付・種別・就寝/起床時間の入力、conform + Server Action で保存 |

#### フォーム管理（conform）

```typescript
const [lastResult, action, isPending] = useActionState(createSleep, undefined)

const [form, fields] = useForm({
  lastResult,
  onValidate({ formData }) {
    return parseWithZod(formData, { schema: sleepSchema })
  },
  shouldValidate: "onBlur",
  shouldRevalidate: "onInput",
})
```

| 概念 | 役割 |
|------|------|
| `lastResult` | Server Action の戻り値（`submission.reply()`）を受け取る |
| `fields.xxx.errors` | フィールドごとのバリデーションエラー |
| `getInputProps(fields.xxx)` | `name` / `id` などを自動生成して input に渡す |
| `noValidate` | ブラウザ標準バリデーションを無効化（conform が代替） |

---

### 4-5. createSleepAction（Server Action）

#### ファイルパス

`app/(app)/sleep/_actions/create-sleep.ts`

#### 処理フロー

```
1. parseWithZod(formData, { schema }) でバリデーション
      ↓ 失敗 → submission.reply() でエラーを返す（conform がエラー表示に使う）
      ↓ 成功
2. Supabase に sleep_records を insert
      ↓ 失敗 → submission.reply({ formErrors: ["保存に失敗..."] })
      ↓ 成功
3. revalidatePath("/sleep")
4. submission.reply({ resetForm: true }) でフォームをリセット
```

#### 戻り値

`submission.reply()` を返す。conform の `useForm({ lastResult })` がエラー表示に使用する。

---

### 4-6. SleepList

#### コンポーネント概要

| 項目 | 内容 |
|------|------|
| ファイルパス | `app/(app)/sleep/_components/sleep-list.tsx` |
| 種別 | Client Component |
| 責務 | recordsを日付ごとにグループ化して表示 |

#### Props

```typescript
type SleepListProps = {
  records: SleepRecord[]
}
```

#### 処理内容

```typescript
// 日付ごとにグループ化
const grouped = records.reduce((acc, record) => {
  const date = record.date
  if (!acc[date]) acc[date] = []
  acc[date].push(record)
  return acc
}, {} as Record<string, SleepRecord[]>)

// 日付降順にソートして表示
```

#### 表示制御

| 条件 | 表示 |
|------|------|
| `records.length === 0` | 「記録がありません」を表示 |
| 記録あり | 日付ごとにグループ化してSleepListItem・SleepSummaryを表示 |

---

### 4-7. SleepListItem

#### コンポーネント概要

| 項目 | 内容 |
|------|------|
| ファイルパス | `app/(app)/sleep/_components/sleep-list-item.tsx` |
| 種別 | Client Component |
| 責務 | 1件の睡眠記録を表示・削除ボタンの制御 |

#### Props

```typescript
type SleepListItemProps = {
  record: SleepRecord
}
```

#### 表示内容

```
[種別ラベル]  就寝時間 〜 起床時間（睡眠時間）  🗑
例: [夜の睡眠]  21:00 〜 07:15（9時間45分）     🗑
例: [お昼寝]   13:00 〜 14:30（1時間30分）      🗑
```

#### イベント処理

| イベント | 処理 |
|----------|------|
| 🗑ボタン押下 | `deleteSleepAction(record.id)` を呼び出す |

---

### 4-8. SleepSummary

#### コンポーネント概要

| 項目 | 内容 |
|------|------|
| ファイルパス | `app/(app)/sleep/_components/sleep-summary.tsx` |
| 種別 | Client Component |
| 責務 | 1日分のrecordsを受け取り、合計睡眠時間を計算・表示 |

#### Props

```typescript
type SleepSummaryProps = {
  records: SleepRecord[]  // 同一日付のrecords
}
```

#### 表示内容

```
[夜の睡眠]: 9時間45分
[お昼寝]: 1時間30分
合計: 11時間15分
```

#### 計算ロジック

```typescript
// calculateSleepMinutes（utils）を使用して合計を算出
const totalOhiruneMinutes = records
  .filter(r => r.type === "ohirune")
  .reduce((sum, r) => sum + calculateSleepMinutes(r.bedTime, r.wakeUpTime), 0)

const totalNightMinutes = records
  .filter(r => r.type === "night")
  .reduce((sum, r) => sum + calculateSleepMinutes(r.bedTime, r.wakeUpTime), 0)
```

---

### 4-9. SleepPagination

#### コンポーネント概要

| 項目 | 内容 |
|------|------|
| ファイルパス | `app/(app)/sleep/_components/sleep-pagination.tsx` |
| 種別 | Client Component |
| 責務 | 前へ・次へボタンの表示、ページ遷移 |

#### Props

```typescript
type SleepPaginationProps = {
  currentPage: number
  hasNextPage: boolean
}
```

#### 表示制御

| 条件 | 表示 |
|------|------|
| `currentPage === 1` | 「前へ」ボタンを非表示 |
| `hasNextPage === false` | 「次へ」ボタンを非表示 |
| それ以外 | 両方表示 |

#### イベント処理

| イベント | 処理 |
|----------|------|
| 「前へ」押下 | `router.push("/sleep?page=${currentPage - 1}")` |
| 「次へ」押下 | `router.push("/sleep?page=${currentPage + 1}")` |

---

## 3. ユーティリティ関数

### 3-1. calculateSleepMinutes

#### ファイルパス

`src/utils/sleep.ts`

#### 概要

就寝時間と起床時間から睡眠時間（分）を計算する。日付跨ぎに対応する。

#### 型定義

```typescript
function calculateSleepMinutes(bedTime: string, wakeUpTime: string): number
// bedTime    "HH:mm"形式
// wakeUpTime "HH:mm"形式
// 戻り値: 睡眠時間（分）
```

#### 計算ロジック

```typescript
export function calculateSleepMinutes(bedTime: string, wakeUpTime: string): number {
  const [bedH, bedM] = bedTime.split(":").map(Number)
  const [wakeH, wakeM] = wakeUpTime.split(":").map(Number)

  let bedMinutes = bedH * 60 + bedM
  let wakeMinutes = wakeH * 60 + wakeM

  // 日付跨ぎの場合（例: 22:00 → 06:00）
  if (wakeMinutes <= bedMinutes) {
    wakeMinutes += 24 * 60
  }

  return wakeMinutes - bedMinutes
}
```

#### テストケース

| bedTime | wakeUpTime | 期待値 |
|---------|------------|--------|
| `22:00` | `06:00` | `480`（8時間） |
| `13:00` | `14:30` | `90`（1時間30分） |
| `21:00` | `07:15` | `585`（9時間45分） |
| `00:00` | `00:00` | `0` |

---

### 3-2. formatMinutes

#### ファイルパス

`src/utils/sleep.ts`

#### 概要

分数を「N時間MM分」形式の文字列に変換する。

#### 型定義

```typescript
function formatMinutes(minutes: number): string
// 戻り値: "N時間MM分" 形式
```

#### 変換例

| 入力 | 出力 |
|------|------|
| `480` | `8時間00分` |
| `90` | `1時間30分` |
| `0` | `0時間00分` |
| `585` | `9時間45分` |