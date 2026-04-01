---
name: nextjs-coding
description: "Next.js App Router でコーディングするときに使うスキル。Server Components・Server Actions・Supabase連携・フォームバリデーション（conform + Zod）のベストプラクティスをガイドする。新しいページ・コンポーネント・Server Action を実装するときは必ずこのスキルを参照する。"
---

# Next.js App Router コーディングガイド

このプロジェクト固有のスタック: Next.js 16 / React 19 / Supabase / @conform-to/zod / Zod v4

---

## 基本原則

- **Server Components がデフォルト** — `"use client"` がなければすべてサーバーで動く
- **データフェッチはサーバー側で** — `_lib/fetcher.ts` に `server-only` をつけて分離する
- **ミューテーションは Server Actions で** — `_actions/` に配置し `revalidatePath()` でキャッシュを更新する
- **コンポーネントは表示に専念** — データ取得ロジックをコンポーネント内に書かない

---

## データフェッチ

### `_lib/fetcher.ts` に分離して `server-only` で保護する

```ts
// src/app/(app)/sleep/_lib/fetcher.ts
import "server-only"; // Client Bundle に誤混入したらビルドエラーになる
import { createClient } from "@/lib/supabase/server";
import { SleepRecord } from "@/types/sleep";

export async function fetchSleepLogs(page: number): Promise<SleepRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sleep_records")
    .select("*")
    .order("date", { ascending: false });

  if (error) console.error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    date: row.date,
    bedTime: row.bed_time.slice(0, 5),   // snake_case → camelCase
    wakeUpTime: row.wake_up_time.slice(0, 5),
    type: row.type,
  }));
}
```

> Supabase のカラムは snake_case。TypeScript 側では必ず camelCase に変換して返す。

### Server Components からデータを取得して props で渡す

```tsx
// page.tsx（Server Component）
import { fetchSleepLogs } from "./_lib/fetcher";
import { SleepList } from "./_components/sleep-list";

export default async function SleepPage() {
  const sleepLogs = await fetchSleepLogs(1);
  return <SleepList sleepLogs={sleepLogs} />;
}
```

---

## Server Actions

### `_actions/` に配置して `revalidatePath()` で更新する

```ts
// src/app/(app)/sleep/_actions/create-sleep.ts
"use server";

import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sleepSchema } from "../_schema";

export async function createSleep(_prev: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: sleepSchema });

  if (submission.status !== "success") {
    return submission.reply(); // バリデーション失敗 → throw しない、戻り値で返す
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  await supabase.from("sleep_records").insert({
    user_id: user?.id,
    date: submission.value.date,
    type: submission.value.type,
    bed_time: submission.value.bedTime,
    wake_up_time: submission.value.wakeUpTime,
  });

  revalidatePath("/sleep"); // キャッシュを更新してページを再取得させる
  return submission.reply();
}
```

> ❌ バリデーションエラーで `throw` するとフォーム入力が消える。必ず `submission.reply()` で返す。

---

## フォームバリデーション（conform + Zod v4）

### スキーマは `_schema.ts` に定義する

```ts
// src/app/(app)/sleep/_schema.ts
import { z } from "zod/v4";

export const sleepSchema = z.object({
  date: z
    .string({ error: "入力必須です" })   // 空フィールドは conform が undefined に変換するため error: を使う
    .min(1, "入力必須です")
    .refine((d) => d >= "2025-01-01", "2025年1月1日以降の日付を入力してください"),
  type: z.enum(["night", "ohirune"]),
  bedTime: z.string({ error: "入力必須です" }).min(1, "入力必須です"),
  wakeUpTime: z.string({ error: "入力必須です" }).min(1, "入力必須です"),
});
```

> `@conform-to/zod` は空フィールドを `""` ではなく `undefined` に変換する。
> そのため `z.string().min(1, "メッセージ")` のカスタムメッセージは空値には適用されず、`z.string({ error: "..." })` を使う。

### Client Components でフォームを実装する

```tsx
// _components/sleep-form.tsx
"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { createSleep } from "../_actions/create-sleep";
import { sleepSchema } from "../_schema";

export function SleepForm() {
  const [lastResult, action] = useActionState(createSleep, null);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: sleepSchema });
    },
  });

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <input name={fields.date.name} aria-invalid={!fields.date.valid} />
      <p>{fields.date.errors}</p>
      <button type="submit">登録</button>
    </form>
  );
}
```

---

## 認証

### Supabase Auth を使ったセッション取得

```ts
// Server Components / Server Actions 内で使う
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
```

### middleware でルートを保護する

```ts
// src/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // セッションがなければ /login にリダイレクト
}

export const config = {
  matcher: ["/(app)/:path*"], // (app) グループ全体を保護
};
```

---

## ディレクトリ配置ルール（Co-location）

```
src/app/(app)/[feature]/
  page.tsx          ← Server Component（データ取得・レイアウト）
  _actions/         ← Server Actions（create-xxx.ts, delete-xxx.ts）
  _components/      ← Client Components（フォーム・リスト・ページネーション）
  _lib/             ← データフェッチ関数（server-only）
  _schema.ts        ← Zod スキーマ（form と actions で共有）
```
