# 育児記録アプリ 基本設計書

## 1. 画面一覧

| 画面名              | パス                  | 説明                                          |
| ------------------ | -------------------- | --------------------------------------------  |
| ログイン画面         | `/login`             | メールアドレス・パスワードで認証を行う              |
| ユーザ登録画面       | `/register`          | 新規ユーザ情報と娘の名前・ニックネームを入力する      |
| ユーザ登録確認画面    | `/register/confirm`  | 入力内容を確認する                               |
| ユーザ登録完了画面    | `/register/complete` | 登録完了を通知する                               |
| メニューTOP画面      | `/`                  | ４つ（睡眠・食事・病院・日記）の機能メニューを表示する |
| 睡眠記録画面         | `/sleep`             | 睡眠記録の登録・一覧・削除を行う                   |

## 2. 画面ごとの役割

### ログイン画面 `/login`

- メールアドレスとパスワードを入力しSupabase Authで認証を行う
- 認証成功後、メニューTOP画面へ遷移する
- 未ログイン時はすべてのページからこの画面にリダイレクトされる

### ユーザ登録画面 `/register`

- 新規ユーザのアカウント情報を入力する
- 入力する内容は　メールアドレス・パスワード・姓・名・子供の名前・子供のニックネーム
- 入力後、確認画面へ遷移する

### ユーザ登録確認画面 `/register/confirm`

- 入力内容を表示し確認を促す
- 「登録する」ボタンでSupabaseにユーザを作成する
- 「修正する」ボタンで登録画面に戻る

### ユーザ登録完了画面 `/register/complete`

- 登録完了を通知する
- ログイン画面へのリンクを表示する

### メニューTOP画面 `/`

- ログインユーザの子供の名前を表示する
- 睡眠・食事・日記・病院の4つのメニューを表示する
- 今回遷移できるのは睡眠のみ。他3つはdisabled表示とする

### 睡眠記録画面 `/sleep`

- 睡眠記録の新規登録フォームを表示する
- 直近5日分の記録を一覧表示する
- 5日以前の記録はページネーションで表示する
- 記録の削除ができる
- 日付ごとの合計睡眠時間を表示する

---
## 3. 画面レイアウト案

###　ログイン画面
┌─────────────────────────┐
│       mashiLog          │
│                         │
│   [メールアドレス 入力欄]  │
│  [パスワード 入力欄]      │
│                         │
│  [ログインボタン]         │
│                         │
│  新規登録はこちら →        │
└─────────────────────────┘
ユーザ登録画面
┌────────────────────────────────┐
│       新規登録                  │
│  必要な情報を入力してください      │
│                                │
│  メールアドレス                  │
│  [メールアドレス 入力欄]          │
│  パスワード                     │
│  [パスワード 入力欄]             │
│  保護者情報                     │
│  [名字 入力欄] [名前 入力欄]      │
│  お子様情報                     │
│  [お子様の名前 入力欄]           │
│  [お子様のニックネーム 入力欄]    │
│  性別 [男の子] [女の子]          │
│                                │
│  [確認画面へ ボタン]             │
│                                │
│ すでにアカウントをお持ちですか？    │
│  [ログイン画面遷移リンク]         │
└────────────────────────────────┘
メニューTOP画面
┌─────────────────────────┐
│ [お子様のニックネーム]の記録│
│    [今日の日付]           │
│  ┌────┐  ┌────┐         │
│  │ 睡眠│  │ 食事│        │
│  └────┘  └────┘         │
│  ┌────┐  ┌────┐         │
│  │ 日記│  │ 病院│        │
│  └────┘  └────┘         │
│  ※食事・日記・病院はグレーアウト
└─────────────────────────┘
睡眠記録画面
┌──────────────────────────────────────────┐
│  睡眠記録                                 │
│                                          │
│  [日付]                                   │
│  ☑️お昼寝                                 │
│  [就寝時間] [起床時間]                     │
│  [記録する]                           　  │
│-----------------------------------------│
│  記録一覧                                 │
│  ─── 2025/03/25 ───                      │
│  [夜の睡眠]   21:00〜-07:15 (9時間45分)   🗑│
│  [夜の睡眠]: 9時間45分                     │
│  [お昼寝]: 0時間00分                      │
│  合計: 9時間45分                          │
│                                         │
│  ─── 2025/03/24 ───                     │
│  ...                                    │
│                                         │
│  [< 前のページ] [次 >]                    │
└─────────────────────────────────────────┘


## 4. コンポーネント構成

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   ├── _schema.ts
│   │   │   ├── _actions/
│   │   │   │   └── login.ts
│   │   │   └── _components/
│   │   │       └── login-form.tsx
│   │   └── register/
│   │       ├── page.tsx
│   │       ├── _schema.ts
│   │       ├── _actions/
│   │       │   └── register.ts
│   │       ├── _components/
│   │       │   └── register-form.tsx
│   │       ├── confirm/
│   │       │   └── page.tsx
│   │       └── complete/
│   │           └── page.tsx
│   ├── (app)/
│   │   ├── layout.tsx              # 認証チェック共通レイアウト
│   │   ├── _actions/
│   │   │   └── logout.ts           # ログアウトアクション
│   │   ├── _components/
│   │   │   └── app-header.tsx      # 共通ヘッダー
│   │   ├── page.tsx                # メニューTOP
│   │   └── sleep/
│   │       ├── page.tsx            # ルート定義のみ
│   │       ├── _schema.ts          # Zodスキーマ
│   │       ├── _actions/
│   │       │   ├── create-sleep.ts
│   │       │   └── delete-sleep.ts
│   │       ├── _lib/
│   │       │   └── fetcher.ts          # Supabaseクエリ関数（server-only）
│   │       └── _components/
│   │           ├── sleep-container.tsx  # fetcherを呼び出し子コンポーネントへ渡す
│   │           ├── sleep-form.tsx
│   │           ├── sleep-list.tsx
│   │           ├── sleep-list-item.tsx
│   │           ├── sleep-summary.tsx
│   │           └── sleep-pagination.tsx
│   └── layout.tsx
│
├── components/
│   └── ui/                     # shadcn/ui コンポーネント置き場
│
├── lib/
│   └── supabase/
│       ├── client.ts           # ブラウザ用Supabaseクライアント
│       └── server.ts           # サーバー用Supabaseクライアント
│
├── types/
│   ├── sleep.ts                # 睡眠記録の型定義
│   └── user.ts                 # ユーザの型定義
│
└── utils/
    └── sleep.ts                # calculateSleepMinutes・formatMinutes
```

### 各コンポーネントの責務

| コンポーネント | 責務 |
|---|---|
| `AppHeader` | ページタイトル・メニューTOPへの戻るボタン・ログアウトボタンを表示 |
| `LoginForm` | メール・パスワード入力、conform + Server Action で認証呼び出し |
| `RegisterForm` | ユーザ情報入力、sessionStorage に一時保存して確認画面へ遷移 |
| `SleepContainer` | Supabaseからの睡眠記録取得・ページネーション判定（Server Component） |
| `SleepForm` | 日付・種別・就寝/起床時間の入力、conform + Server Action で保存 |
| `SleepList` | 日付ごとにグループ化して記録を表示 |
| `SleepListItem` | 1件の記録表示と削除ボタン |
| `SleepSummary` | 日付ごとの合計睡眠時間計算・表示 |
| `SleepPagination` | 5日以前のページ切り替え |

---

## 5. データ項目設計

### Supabaseテーブル設計

#### `profiles` テーブル（ユーザプロフィール）

| カラム名 | 型 | 説明 |
|---|---|---|
| `id` | `uuid` | Supabase Auth の user.id と紐づく（PK） |
| `last_name` | `text` | 名字 |
| `first_name` | `text` | 名前 |
| `child_name` | `text` | 娘の名前 |
| `child_nickname` | `text` | 娘のニックネーム |
| `child_gender` | `text` | 娘の性別: `boy`（男の子）または `girl`（女の子） |
| `created_at` | `timestamptz` | 作成日時 |
| `updated_at` | `timestamptz` | 更新日時 |

#### `sleep_records` テーブル（睡眠記録）

| カラム名 | 型 | 説明 |
|---|---|---|
| `id` | `uuid` | 主キー |
| `user_id` | `uuid` | profiles.id への外部キー |
| `date` | `date` | 記録日付 |
| `type` | `text` | 種別: `ohirune`（昼寝）または `night`（夜の睡眠） |
| `bed_time` | `time` | 就寝時間 |
| `wake_up_time` | `time` | 起床時間 |
| `created_at` | `timestamptz` | 作成日時 |

---

## 6. TypeScript 型定義案

```typescript
// types/user.ts

export type Profile = {
  id: string;
  lastName: string;
  firstName: string;
  childName: string;
  childNickname: string;
  child_gender: Gender;
  createdAt: string;
  updatedAt: string;
};

export type Gender = "boy" | "girl";

export type RegisterFormValues = {
  lastName: string;
  firstName: string;
  childName: string;
  childNickname: string;
  childGender: Gender;
  email: string;
  password: string;
};
```

```typescript
// types/sleep.ts

export type SleepType = 'ohirune' | 'night';

export type SleepRecord = {
  id: string;
  userId: string;
  date: string;        // "YYYY-MM-DD"
  type: SleepType;
  bedTime: string;     // "HH:mm"
  wakeUpTime: string;    // "HH:mm"
  createdAt: string;
};

// フォーム入力用（idなどは不要）
export type SleepFormValues = {
  date: string;
  type: SleepType;
  bedTime: string;
  wakeUpTime: string;
};

// 日付ごとにグループ化した表示用
export type SleepDailySummary = {
  date: string;
  records: SleepRecord[];
  totalNapMinutes: number;
  totalNightMinutes: number;
  totalMinutes: number;
};
```

---

## 7. 状態管理方針

本アプリはシンプルな構成のため、**グローバルな状態管理ライブラリは使用しない**。
以下の方針で実装する。

| 状態の種類 | 管理方法 | 理由 |
|---|---|---|
| 認証状態（ログイン中ユーザ） | `useAuth` カスタムフック + Supabase Auth | Supabaseがセッションを管理するため |
| 睡眠記録一覧 | `useSleep` カスタムフック内の `useState` | 睡眠記録画面でのみ使用するため |
| 登録フォームの一時データ | `useState` + `sessionStorage` | 確認画面への受け渡しに使用 |
| ページネーション状態 | `useState`（ページ番号） | 睡眠記録画面内のローカル状態 |

---

## 8. 画面遷移

```
[未認証アクセス] ──────────────────→ /login
                                        │
                        ┌───────────────┘
                        │ ログイン成功
                        ▼
新規登録はこちら → /register
                        │
                        ▼
               /register/confirm
                        │ 登録する
                        ▼
               /register/complete
                        │
                        ▼
                     /login
                        │ ログイン成功
                        ▼
                      / (TOP)
                        │ 睡眠メニュー選択
                        ▼
                     /sleep
                        │
              ┌─────────┴─────────┐
              │                   │
           記録追加             記録削除
              │                   │
              └────── /sleep ──────┘
```

---

## 9. 保存方式

| データ | 保存先 | タイミング |
|---|---|---|
| ユーザ認証情報 | Supabase Auth | 登録完了時・ログイン時 |
| ユーザプロフィール | Supabase DB（`profiles`テーブル） | アカウント登録完了時 |
| 睡眠記録 | Supabase DB（`sleep_records`テーブル） | フォーム送信時 |
| 登録フォーム一時データ | sessionStorage | 登録画面 → 確認画面の遷移時 |
