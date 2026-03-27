# 育児記録アプリ ハンズオン

## 概要

このリポジトリは、**ClaudeCodeを使いながら、要件定義 → 基本設計 → 詳細設計 → 単体テスト** の流れを体験するためのハンズオン用プロジェクトです。

題材は、学習しやすいように機能を絞った **簡単な育児記録アプリ** です。
まずは**認証・睡眠記録**のみを対象にして、実務でよくある開発工程を小さく一周することを目的にしています。

---

## このハンズオンの目的

このハンズオンでは、単にアプリを作るだけではなく、以下を身につけることを目的とします。

- 要件を整理して文章にする力
- 画面・データ・処理の関係を設計する力
- コンポーネントや型を分けて考える力
- 単体テストの観点を持つ力
- ClaudeCodeへ適切に依頼する力

---

## 作成するアプリ

育児記録アプリ

子供の成長を記録するアプリ。
睡眠・食事・通院やお薬の投与記録・育児日記を管理する。
今回は学習の目的として初回は認証・睡眠機能のみ開発を行う。

### 機能概要

- ログイン認証機能
  認証はSupabaseを使用して認証機能を実装する。
  メールアドレスとパスワードを入力すると認証に進む

- TOP画面
  娘の名前が表示され
  睡眠・食事・日記・病院の４つのカテゴリを表示する。

- 睡眠記録
  1日の就寝時間、起床時間をお昼寝時間を記録する。

### 今回やらないこと

- 食事記録機能
- 通院・お薬投与記録機能
- 日記記録機能
- 月別集計・グラフ表示

## 想定技術スタック

1. ライブラリ一覧

**フレームワーク・コアライブラリ**

| ライブラリ | バージョン | 用途 |
|---|---|---|
| Next.js | 16.x | React フレームワーク。App Router によるファイルベースルーティング、Server Component、Server Action を提供する |
| React | 19.x | UI コンポーネントライブラリ。`useActionState` など最新の React API を使用する |

**フォーム・バリデーション**

| ライブラリ | バージョン | 用途 |
|---|---|---|
| Zod | 4.x | スキーマ定義とバリデーション。サーバー・クライアント両側で共有する |
| @conform-to/react | 1.x | `useActionState` と連携するフォーム状態管理。フィールドの ID・名前・エラーを管理する |
| @conform-to/zod | 1.x | conform と Zod を連携させるアダプター。`parseWithZod()` でフォームデータをパースする |

**UI・スタイリング**

| ライブラリ | バージョン | 用途 |
|---|---|---|
| Tailwind CSS | 4.x | ユーティリティファーストの CSS フレームワーク |
| shadcn/ui | 3.x | Tailwind CSS ベースのコンポーネント集。`npx shadcn add` で `components/ui/` に追加し、直接編集してカスタマイズする |
| Lucide React | 0.5x | SVG アイコンライブラリ |

**サーバーサイド**
| ライブラリ | バージョン | 用途 |
|---|---|---|
|server-only | 0.0.1 | import "server-only" を記述したファイルを Client Component から import するとビルドエラーにする。fetcher.ts などの誤用を防ぐ |

**テスト**
| ライブラリ | バージョン | 用途 |
|---|---|---|
|Jest | 29.x | JavaScript テストフレームワーク |
|@testing-library/react | 16.x | React コンポーネントのレンダリングとクエリを提供するテストユーティリティ |
|@testing-library/user-event | 14.x | クリック・入力などのユーザー操作をシミュレートするユーティリティ |
|@testing-library/jest-dom | 6.x | toBeInTheDocument() などの DOM 検証用カスタムマッチャーを提供する |

---

## 進め方

このハンズオンは、以下の流れで進めます。

1. 要件定義
2. 基本設計
3. 詳細設計
4. 実装
5. 単体テスト
6. 振り返り

各工程で **自分で考える → ClaudeCodeにたたき台を作ってもらう → 自分で修正する** という進め方を基本にします。

---

## Step 1. 要件定義

### 目的

「何を作るか」を明確にします。

### この工程で決めること

- 誰が使うか
- 何のために使うか
- 何ができれば最低限OKか
- 今回やらないことは何か

### 成果物

`docs/01_requirements.md`

### 記載する内容

- 背景
- 目的
- 対象ユーザー
- 対象機能
- 対象外
- 画面一覧
- 入力項目
- 業務フロー

### ClaudeCodeへの依頼例

```text
簡単な育児記録アプリの要件定義書のたたき台を作ってください。
対象は認証・睡眠記録機能です。
以下を含めてください。
- 背景
- 目的
- 対象ユーザ
- 機能一覧
- 対象外
- 画面一覧
- 入力項目
- 業務フロー
学習用なのでシンプルにまとめてください。
```

---

## Step 2. 基本設計

### 目的

画面・データ・処理の全体像を決めます。

### この工程で決めること

- 画面一覧
- 画面ごとの役割
- コンポーネント構成
- データ項目
- 状態管理方法
- 保存方法

### 成果物

`docs/02_basic_design.md`

### 記載する内容

- 画面構成
- 画面レイアウト案
- コンポーネント構成
- データ設計
- 画面遷移
- 保存方式

### ClaudeCodeへの依頼例

```text
以下の要件をもとに基本設計書のたたき台を作ってください。
対象は睡眠記録機能です。
作成してほしい内容:
- 画面一覧
- 画面ごとの役割
- 画面レイアウト案
- コンポーネント構成
- データ項目設計
- 状態管理方法
- 画面遷移
TypeScriptの型案も含めてください。
```

---

## Step 3. 詳細設計

### 目的

コンポーネント単位・関数単位で、実装できるレベルまで具体化します。

### この工程で決めること

- 各コンポーネントの役割
- Props
- State
- イベント処理
- バリデーション
- 計算ロジック

### 成果物

`docs/03_detail_design.md`

### 記載する内容

- コンポーネント詳細
- Props設計
- State設計
- 関数一覧
- バリデーション仕様
- supabase連携タイミング

### ClaudeCodeへの依頼例

```text
睡眠記録機能の詳細設計を作ってください。
対象コンポーネントは以下です。
- SleepForm
- SleepList
- SleepSummary
以下を整理してください。
- 各コンポーネントの役割
- Props定義
- State定義
- イベント処理
- バリデーション
- 睡眠時間計算ロジック
- supabaseとの連携タイミング
TypeScriptで書ける粒度でお願いします。
```

---

## Step 4. 実装

### 目的

詳細設計をもとに、少しずつ実装を進めます。

### おすすめの実装順

1. 型定義
2. ページの骨組み作成
3. フォーム作成
4. 一覧表示
5. 削除機能
6. 合計表示
7. supabase保存
8. バリデーション

### ClaudeCodeへの依頼例（型定義）

```text
睡眠記録アプリで使う型定義ファイルを作ってください。
SleepRecord型を定義し、今後食事記録や日記記録にも拡張しやすい形を意識してください。
```

### ClaudeCodeへの依頼例（初期構成）

```text
Next.js App Router前提で、睡眠記録ページの初期構成を作ってください。
以下のファイル構成で提案してください。
- app/sleep/page.tsx
- components/SleepForm.tsx
- components/SleepList.tsx
- components/SleepSummary.tsx
- types/sleep.ts
まずはダミーデータ表示だけでOKです。
```

### ClaudeCodeへの依頼例（レコード追加）

```text
次にSleepFormからレコードを追加できるようにしてください。
親コンポーネントでstateを持ち、子コンポーネントからonAddで追加する構成にしてください。
初心者向けに解説コメントも付けてください。
```

---

## Step 5. 単体テスト

### 目的

UIだけでなく、ロジックの正しさを確認します。

### まずテストする対象

- 睡眠時間計算関数
- 入力チェック関数

### 切り出したい関数例

```ts
calculateSleepMinutes(bedTime, wakeTime);
validateSleepRecord(record);
```

### 成果物

`docs/04_test_spec.md`

### テスト観点例

#### 睡眠時間計算

- 22:00 → 06:00 で 480分になる
- 13:00 → 14:30 で 90分になる
- 日付跨ぎ計算が正しい

#### バリデーション

- 未入力ならエラーになる
- typeが不正ならエラーになる
- 就寝時間と起床時間が同じ場合の扱いを確認する

### ClaudeCodeへの依頼例

```text
睡眠記録アプリの単体テストをしたいです。
まずはUIではなくロジックの単体テストから始めたいので、
以下の関数を切り出してテストコードを作ってください。
- calculateSleepMinutes
- validateSleepRecord

Vitestを前提に、
- 関数本体
- テストファイル
- テスト観点一覧
を作成してください。
初心者向けに1ケースずつ解説もお願いします。
```

---

## Step 6. 振り返り

最後に、今回のハンズオンで学べたことを振り返ります。

### 振り返り観点

- 要件と実装にズレはなかったか
- 基本設計で決めた構成は妥当だったか
- 詳細設計があったことで実装しやすくなったか
- テストを書くことでロジックの抜け漏れに気づけたか
- ClaudeCodeへの依頼の仕方で改善したい点はあるか

### まとめ例

- 何が理解できたか
- どこで詰まったか
- 次に改善したいこと
- 追加したい機能

---

## ディレクトリ例

```text
.
├── README.md
├── docs
│   ├── 01_requirements.md
│   ├── 02_basic_design.md
│   ├── 03_detail_design.md
│   └── 04_test_spec.md
├── src
│   ├── app
│   │   └── sleep
│   │       └── page.tsx
│   ├── components
│   │   ├── SleepForm.tsx
│   │   ├── SleepList.tsx
│   │   └── SleepSummary.tsx
│   ├── types
│   │   └── sleep.ts
│   └── utils
│       ├── calculateSleepMinutes.ts
│       └── validateSleepRecord.ts
└── tests
    ├── calculateSleepMinutes.test.ts
    └── validateSleepRecord.test.ts
```

---

## 進めるときのコツ

- 最初から全部作ろうとしない
- 機能を絞って一周する
- 毎工程で成果物を残す
- ClaudeCodeの出力をそのまま使わず、自分で確認して直す
- 実装より先に「何を作るか」を言語化する

---

## 次のステップ

1周目が終わったら、以下のように拡張できます。

- 食事記録機能の追加
- 日記機能の追加
- 月別集計
- グラフ表示

まずは **睡眠記録だけで開発工程を一通り経験すること** を優先してください。

---

## ベストプラクティス

### Next.js (App Router)

#### Server Component / Client Component の使い分け

| やること | どちらを使う |
|---|---|
| DBやAPIからデータ取得 | Server Component |
| useState / useEffect を使う | Client Component |
| イベントハンドラ（onClick等）を使う | Client Component |
| SEOに関わる静的コンテンツ | Server Component |

- `"use client"` は必要な箇所だけに絞る（ツリーの末端に配置するのが理想）
- データフェッチはページの Server Component で行い、props として Client Component に渡す

#### Server Actions

- フォームのミューテーション（登録・更新・削除）は Server Actions (`"use server"`) で行う
- 処理後は `revalidatePath()` でキャッシュを破棄してページを最新化する
- ファイルは `_actions/` ディレクトリにまとめてルートに共存させる

```ts
// 例: src/app/sleep/_actions/create-sleep.ts
"use server";
import { revalidatePath } from "next/cache";

export async function createSleep(...) {
  await supabase.from("sleep_records").insert({...});
  revalidatePath("/sleep");
}
```

#### バリデーション

- Zod スキーマをフォーム側と Server Action 側の両方から参照できるよう `_schema.ts` に切り出す
- クライアントでは `safeParse()` でエラーメッセージを取得してUIに表示する

---

### Supabase

#### クライアントの初期化

- クライアントは `src/lib/supabase.ts` に一箇所だけ定義してアプリ全体で使い回す
- ブラウザ・サーバー両方からアクセスするなら `NEXT_PUBLIC_` プレフィックスの環境変数を使う

```ts
// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

#### テーブル設計の慣習

- Supabase のカラム名は **snake_case**、TypeScript の型は **camelCase** で管理する
- フェッチ後にマッピング処理を入れてコードの一貫性を保つ

```ts
const records = (data ?? []).map((row) => ({
  id: row.id,
  bedTime: row.bed_time,       // snake_case → camelCase
  wakeUpTime: row.wake_up_time,
}));
```

#### エラーハンドリング

- `supabase.from(...).select()` の戻り値は `{ data, error }` で受け取り、必ず `error` を確認する
- Server Component ではエラー時にフォールバック値（空配列など）を使って画面を壊さないようにする

```ts
const { data, error } = await supabase.from("sleep_records").select("*");
if (error) {
  console.error("データ取得に失敗しました:", error.message);
}
const records = data ?? [];
```

---

## 補足

このREADMEは、学習の進め方を整理したものです。
実際の開発では、各工程の内容を `docs/` 配下に記録しながら進める想定です。

学習のポイントは、**AIに全部任せることではなく、AIを壁打ち相手として使いながら、自分で設計の意図を理解すること** です。
