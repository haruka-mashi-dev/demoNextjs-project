---
name: nextjs-review
description: "Next.js App Router のコードレビューをするときに使うスキル。データフェッチ・コンポーネント設計・キャッシュ・認証・エラーハンドリング・テストの観点でチェックする。コードレビューを依頼されたときは必ずこのスキルを参照する。"
---

# Next.js App Router コードレビューガイド

レビュー時は以下のチェック項目を順番に確認し、問題があれば **問題点・理由・修正例** の3点セットで指摘する。

---

## チェックリスト

### 🔴 データフェッチ（重大度: 高）

**[ ] データフェッチが Client Components で行われていないか**
- `"use client"` 内で SWR / React Query / fetch を使ってデータ取得していたら指摘
- 理由: サーバー間通信を活かせない、バンドルサイズ増加、セキュリティリスク
- 修正: Server Components に移動して async/await で直接フェッチ

**[ ] `"use server"` を Server Components に付けていないか**
- `export async function Page()` などに `"use server"` がついていたら指摘
- 理由: `"use server"` は Server Actions のためのもの。Server Components には不要
- 修正: `"use server"` を削除する

**[ ] Props Drilling（バケツリレー）が発生していないか**
- ページで全データ取得 → 子・孫コンポーネントへ props で渡し続けるパターン
- 理由: コンポーネントの独立性が失われ、変更コストが増加
- 修正: 各コンポーネントで必要なデータを直接フェッチ（Request Memoization が重複排除）

**[ ] `_lib/fetcher.ts` に `import "server-only"` が付いているか**
- `server-only` がないと Client Bundle に混入するリスクがある
- 修正: `_lib/fetcher.ts` の先頭に `import "server-only"` を追加

**[ ] 独立したデータフェッチが直列になっていないか**
- 同一コンポーネント内で `await fetchA(); await fetchB();` のように直列に並んでいたら指摘
- 修正: `Promise.all([fetchA(), fetchB()])` またはコンポーネント分割

---

### 🔴 コンポーネント設計（重大度: 高）

**[ ] Client Components の範囲が必要以上に広くないか**
- 親・中間層のコンポーネントに `"use client"` が付いていたら指摘
- 理由: 配下のすべてのモジュールが Client Bundle に入る（バンドルサイズ肥大化）
- 修正: `"use client"` はコンポーネントツリーの末端（葉）に限定

**[ ] コンポーネントが表示に専念しているか（DDD プレゼンテーション層）**
- コンポーネント内でデータ取得・ビジネスロジックが混在していたら指摘
- 修正: データ取得は `_lib/fetcher.ts`、ロジックは `src/utils/` に分離

**[ ] 再利用可能なコンポーネントがテスト可能な構造か**
- データフェッチと表示が1つのコンポーネントに混在していないか
- 推奨: Container（データ取得・Server Components）/ Presentational（表示のみ）に分離

---

### 🔴 Server Actions（重大度: 高）

**[ ] バリデーション失敗時に `throw` していないか**
- `throw new Error(...)` でエラーを返していたら指摘
- 理由: throw すると `error.tsx` が表示されフォーム入力が消える
- 修正: `return submission.reply()` で戻り値として返す

**[ ] `parseWithZod` と `_schema.ts` のスキーマを使っているか**
- Server Action 内で独自バリデーションを書いていたら指摘
- 修正: `_schema.ts` の Zod スキーマを `parseWithZod` に渡して共有する

**[ ] データ更新後に `revalidatePath()` を呼んでいるか**
- DB 更新後に revalidate がなければデータが古いまま表示される
- 修正: `revalidatePath("/sleep")` を insert/update/delete の直後に追加

**[ ] Supabase の insert 時に snake_case カラム名を使っているか**
- TypeScript 側は camelCase だが、Supabase は snake_case（`bed_time`, `wake_up_time`）
- 修正: insert 時に snake_case に変換して渡す

---

### 🟡 バリデーション・フォーム（重大度: 中）

**[ ] `_schema.ts` を form と Server Actions で共有しているか**
- フォーム側・アクション側でそれぞれ別のバリデーションを書いていたら指摘
- 修正: `_schema.ts` に一元化して両方から import する

**[ ] 空フィールドのエラーメッセージに `z.string({ error: "..." })` を使っているか**
- `z.string().min(1, "入力必須です")` だけでは空フィールドに適用されない
- 理由: `@conform-to/zod` は空フィールドを `undefined` に変換するため
- 修正: `z.string({ error: "入力必須です" }).min(1, "入力必須です")` の形式にする

---

### 🟡 DDD 設計（重大度: 中）

**[ ] 層の責務が正しく分離されているか**

| 層 | 場所 | NG パターン |
|---|---|---|
| プレゼンテーション | `_components/` | DB アクセス・ビジネスロジックを含む |
| アプリケーション | `_actions/` | ビジネスロジックを直接持つ |
| ドメイン | `_schema.ts`, `src/utils/` | フレームワーク依存のコードがある |
| インフラ | `_lib/`, `src/lib/` | `server-only` がない |

**[ ] 純粋ロジック関数が `src/utils/` に切り出されているか**
- コンポーネントや Server Actions 内に計算ロジックが埋まっていたら指摘
- 修正: `src/utils/` に純粋関数として切り出してテストを書く

**[ ] `src/types/` に型定義があるか**
- コンポーネント内に型定義を書いていたら指摘
- 修正: 共有型は `src/types/` に定義する

---

### 🟡 認証・認可（重大度: 高 — セキュリティリスク）

**[ ] layout だけで認可チェックしていないか**
- `layout.tsx` でのみ `getUser()` を呼んでいたら必ず指摘
- 理由: layout とページは並行レンダリングされるため認可が先に実行される保証がない
- 修正: 各ページ・データフェッチ関数内でも認可チェックを行う

**[ ] Server Actions でも認証チェックをしているか**
- `_actions/` 内で `supabase.auth.getUser()` を呼んでいるか確認
- 理由: Server Actions は直接呼び出し可能なため必ずサーバー側で認証する

---

### 🟡 エラーハンドリング（重大度: 中）

**[ ] `error.tsx` が Client Components になっているか**
- `"use client"` がない `error.tsx` は動作しない
- 修正: ファイル先頭に `"use client"` を追加

**[ ] Supabase エラーを適切にハンドリングしているか**
- `const { data, error } = await supabase...` の `error` を無視していたら指摘
- 修正: `if (error) console.error(...)` または適切なエラーハンドリングを追加

---

### 🟢 テスト（重大度: 低〜中）

**[ ] テストファイルが `__tests__/` フォルダに配置されているか**
- 対象ファイルと同じ階層の `__tests__/` に置くルール

**[ ] 新しいユーティリティ関数にテストが書かれているか**
- `src/utils/` に追加した関数は必ず単体テストを書く（カバレッジ原則100%）

**[ ] Server Actions のモックが正しく書かれているか**
- `jest.mock()` をファイル先頭（import より前）に書いているか
- `@types/jest` のグローバル `jest` を使っているか（`@jest/globals` の import は不可）

**[ ] コンポーネントテストで適切なクエリを使っているか**
- テキストが分割されている場合は `getAllByText(/正規表現/)` を使う
- ロール（button/link）で探すときは `getByRole("button", { name: /ラベル/ })` を使う

---

## レビューコメントの書き方

問題を指摘するときは必ずこの3点を含める:

1. **何が問題か** — 具体的なコード箇所を指摘
2. **なぜ問題か** — パフォーマンス / セキュリティ / 保守性 / テスト容易性のどれに影響するか
3. **どう直すか** — 修正後のコードスニペット

例:
> **[DDD / ドメイン層]** `sleep-list.tsx` 内に `calcSleepMinutes()` の計算ロジックが書かれています。
>
> コンポーネントはプレゼンテーション層の責務（表示）に専念すべきで、計算ロジックはドメイン層に分離することでテストも書きやすくなります。
>
> ```ts
> // Before: コンポーネント内に計算ロジックが混在
> const minutes = (end - start + 1440) % 1440;
>
> // After: src/utils/sleep.ts に切り出してテストを書く
> import { calcSleepMinutes } from "@/utils/sleep";
> const minutes = calcSleepMinutes(bedTime, wakeUpTime);
> ```
