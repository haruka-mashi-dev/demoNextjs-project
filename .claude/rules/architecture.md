# アーキテクチャ方針

## DDD（ドメイン駆動設計）

ドメイン駆動設計（DDD）の考え方に基づき、責務ごとにディレクトリ・ファイルを分ける。

| 層 | 場所 | 内容 |
|---|---|---|
| プレゼンテーション層 | `_components/` | UI コンポーネント（表示・操作） |
| アプリケーション層 | `_actions/` | Server Actions（ユースケース） |
| ドメイン層 | `_schema.ts`, `src/utils/` | バリデーション・純粋なビジネスロジック |
| インフラ層 | `_lib/`, `src/lib/supabase/` | DB アクセス・外部サービス連携 |

### 原則

- ドメイン層（`src/utils/`）はフレームワークやDBに依存しない純粋な関数で構成する
- Server Actions はビジネスロジックを持たず、ドメイン層の関数を呼び出すだけにする
- コンポーネントは表示に専念し、データ取得ロジックを含めない

## ディレクトリ構成

```
src/app/(app)/sleep/page.tsx          ← Server Component: fetches sleep_records from Supabase
  └─ _components/sleep-form.tsx       ← Client Component: calls Server Action on submit
  └─ _components/sleep-list.tsx       ← Client Component: displays records
  └─ _components/sleep-pagination.tsx ← Client Component: pagination controls
src/app/(app)/sleep/_actions/         ← Server Actions (create-sleep.ts, delete-sleep.ts)
src/app/(app)/sleep/_schema.ts        ← Zod validation schemas shared between form + actions
src/app/(app)/sleep/_lib/             ← Data fetching (server-only)
src/utils/sleep.ts                    ← Pure logic: calcSleepMinutes, formatMinutes
src/types/                            ← Shared TypeScript types (SleepRecord など)
src/lib/supabase/                     ← Supabase クライアント（client.ts / server.ts）
src/components/ui/                    ← shadcn/ui 汎用コンポーネント
```

## データフローの原則

```
page.tsx（Server Component）
  └─ _lib/fetcher.ts でデータ取得（Supabase）
  └─ _components/ にデータを props で渡す
       └─ _actions/ を呼び出してデータを更新（Server Action）
            └─ revalidatePath() でページを再取得
```

## コロケーション（Co-location）

ページ固有のコード（コンポーネント・アクション・スキーマ）はルートフォルダ配下にまとめる。
汎用コンポーネントだけ `src/components/ui/` に置く。
