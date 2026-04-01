---
name: ddd-design
description: "DDD（ドメイン駆動設計）の考え方に基づいて新機能を設計・実装するときに使うスキル。ディレクトリ構成の提案・責務の分割・層ごとの実装ガイドラインをカバーする。新しい機能（食事記録・日記など）を追加するときは必ずこのスキルを参照する。"
---

# DDD 設計ガイド

---

## 層の定義

| 層 | 場所 | 責務 |
|---|---|---|
| プレゼンテーション層 | `_components/` | UI の表示・ユーザー操作の受け取り |
| アプリケーション層 | `_actions/` | ユースケースの実行（Server Actions） |
| ドメイン層 | `_schema.ts`, `src/utils/` | ビジネスルール・バリデーション・純粋ロジック |
| インフラ層 | `_lib/`, `src/lib/supabase/` | DB アクセス・外部サービス連携 |

---

## 新機能追加のディレクトリ構成テンプレート

例：食事記録（meals）機能を追加する場合

```
src/app/(app)/meals/
  page.tsx                    ← Server Component（データ取得・ページ全体のレイアウト）
  _schema.ts                  ← Zod バリデーションスキーマ（form と actions で共有）
  _actions/
    create-meal.ts            ← 食事記録の作成（Server Action）
    delete-meal.ts            ← 食事記録の削除（Server Action）
  _components/
    meal-form.tsx             ← 登録フォーム（Client Component）
    meal-list.tsx             ← 一覧表示（Client Component）
    meal-pagination.tsx       ← ページネーション（Client Component）
  _lib/
    fetcher.ts                ← データ取得関数（server-only）
  __tests__/
    _schema.test.ts           ← スキーマの単体テスト

src/types/
  meal.ts                     ← MealRecord 型定義

src/utils/
  meal.ts                     ← 純粋ロジック関数（例: calcCalories）
  __tests__/
    meal.test.ts              ← ロジック関数の単体テスト
```

---

## 各層の実装ガイドライン

### ドメイン層（`src/utils/`, `_schema.ts`）

- フレームワーク・DB に **依存しない** 純粋な関数で構成する
- テストが最も書きやすい層 → カバレッジ100%を目指す

```ts
// src/utils/meal.ts — フレームワーク非依存の純粋関数
export function calcCalories(items: MealItem[]): number {
  return items.reduce((sum, item) => sum + item.calories, 0);
}
```

### インフラ層（`_lib/fetcher.ts`）

- `import "server-only"` を必ず先頭に書く（クライアント混入防止）
- Supabase の snake_case カラムを camelCase に変換して返す

```ts
// _lib/fetcher.ts
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { MealRecord } from "@/types/meal";

export async function fetchMealLogs(): Promise<MealRecord[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("meal_records").select("*");
  return (data ?? []).map((row) => ({
    id: row.id,
    date: row.date,
    mealType: row.meal_type,   // snake_case → camelCase
    calories: row.calories,
  }));
}
```

### アプリケーション層（`_actions/`）

- ビジネスロジックを持たず、ドメイン層の関数を呼び出すだけにする
- バリデーション失敗時は `throw` せず `submission.reply()` で返す
- 処理後は必ず `revalidatePath()` でキャッシュを更新する

```ts
// _actions/create-meal.ts
"use server";
import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { mealSchema } from "../_schema";

export async function createMeal(_prev: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: mealSchema });
  if (submission.status !== "success") return submission.reply();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  await supabase.from("meal_records").insert({
    user_id: user?.id,
    date: submission.value.date,
    meal_type: submission.value.mealType,
    calories: submission.value.calories,
  });

  revalidatePath("/meals");
  return submission.reply();
}
```

### プレゼンテーション層（`_components/`）

- 表示に専念し、データ取得ロジックを含めない
- データは `page.tsx`（Server Component）から props で受け取る

```tsx
// _components/meal-list.tsx
"use client";
import { MealRecord } from "@/types/meal";

type Props = { mealLogs: MealRecord[] };

export function MealList({ mealLogs }: Props) {
  if (mealLogs.length === 0) return <p>記録がありません</p>;
  return (
    <ul>
      {mealLogs.map((log) => (
        <li key={log.id}>{log.date} - {log.calories}kcal</li>
      ))}
    </ul>
  );
}
```

---

## 設計判断のチェックリスト

新機能を実装するときに確認する。

- [ ] ドメイン層の関数は DB・フレームワークに依存していないか
- [ ] Server Actions にビジネスロジックが混在していないか
- [ ] コンポーネント内でデータフェッチしていないか
- [ ] `_lib/fetcher.ts` に `server-only` を書いたか
- [ ] Supabase のカラム名（snake_case）を TypeScript 側で camelCase に変換しているか
- [ ] `src/types/` に型定義を追加したか
- [ ] `_schema.ts` のバリデーションスキーマを form と actions で共有しているか
- [ ] テストファイルを `__tests__/` に配置したか
