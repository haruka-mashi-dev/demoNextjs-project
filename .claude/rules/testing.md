# テストルール

## テストカバレッジ

- **原則100%** を目標とする
- 対象：ドメイン層（`src/utils/`）・バリデーションスキーマ（`_schema.ts`）・UIコンポーネント（`_components/`）
- テストしにくいインフラ層（Supabase 呼び出し）は `jest.mock()` で差し替えてロジックのみ検証する

## テストファイルの配置ルール

テストファイルは **対象ファイルと同じ階層の `__tests__/` フォルダ** に置く。

```
src/utils/
  sleep.ts
  __tests__/
    sleep.test.ts

src/app/(app)/sleep/
  _schema.ts
  __tests__/
    _schema.test.ts
  _components/
    sleep-list.tsx
    __tests__/
      sleep-list.test.tsx
```

## モックの書き方

- **Server Actions** (`"use server"`) はテスト環境で動かないため `jest.mock()` で差し替える
  ```ts
  jest.mock("../../_actions/delete-sleep", () => ({
    deleteSleep: jest.fn(),
  }));
  ```
- **`next/navigation`** の `useRouter` も `jest.mock()` で差し替える
  ```ts
  jest.mock("next/navigation", () => ({
    useRouter: jest.fn(() => ({ push: jest.fn() })),
  }));
  ```
- `jest.mock()` は **グローバルの `jest`** を使う（`@types/jest` 経由）。`import { jest } from "@jest/globals"` だと SWC がホイスティングを認識しない

## テスト環境の設定

- `.env.test` にダミーの Supabase 環境変数を設定済み
- `__mocks__/server-only.ts` で `server-only` パッケージを空モックに差し替え済み
