# CLAUDE.md

## 概要

育児記録アプリ（Next.js App Router）の学習プロジェクト。
詳細なルールは `.claude/rules/` 配下を参照。

| ファイル | 内容 |
|---|---|
| `.claude/rules/architecture.md` | DDD設計方針・ディレクトリ構成 |
| `.claude/rules/coding-style.md` | 命名規則・コミットメッセージルール |
| `.claude/rules/testing.md` | テスト配置ルール・モック方針・カバレッジ |

---

## 開発環境

### 必須バージョン

| ツール | バージョン |
|---|---|
| Node.js | v24.11.1 |
| npm | 11.6.2 |

> パッケージマネージャーは **npm** を使用する（yarn / pnpm は使わない）。

### ローカル環境の設定

| 項目 | 値 |
|---|---|
| 開発サーバーURL | `http://localhost:3000` |
| Supabase ローカルURL | `http://localhost:54321` |

### 環境変数ファイル

| ファイル | 用途 | Git管理 |
|---|---|---|
| `.env.local` | 本番Supabaseの接続情報（ローカル開発用） | 対象外（.gitignore） |
| `.env.test` | テスト用ダミー値（実Supabaseに接続しない） | 対象 |

> `.env.local` には `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定する。実際の値は Supabase ダッシュボードで確認すること。

---

## Commands

```bash
# Development
npm run dev       # Start dev server
npm run build     # Build for production
npm run lint      # Run ESLint

# Testing (Jest)
npx jest                          # Run all tests
npx jest path/to/file.test.ts     # Run a single test file
npx jest --watch                  # Watch mode
```

---

## 技術スタック

**フレームワーク・言語**

| ライブラリ | バージョン | 用途 |
|---|---|---|
| Next.js | 16.1.6 | App Router / Server Components / Server Actions |
| React | 19.2.3 | UI |
| TypeScript | ^5 | 型安全 |

**スタイリング**

| ライブラリ | バージョン | 用途 |
|---|---|---|
| Tailwind CSS | ^4 | ユーティリティCSS |
| shadcn/ui | ^4.0.8 | UIコンポーネント集 |
| Radix UI | ^1.4.3 | shadcn のベース（アクセシブルなプリミティブ） |
| lucide-react | ^0.577.0 | アイコン |
| clsx / tailwind-merge | latest | クラス名の結合 |

**バリデーション・フォーム**

| ライブラリ | バージョン | 用途 |
|---|---|---|
| Zod | ^4.3.6 | スキーマバリデーション |
| @conform-to/zod | ^1.17.1 | ZodスキーマをServer Actionと連携 |
| @conform-to/react | ^1.17.1 | フォームの状態管理（useForm） |

**バックエンド・DB**

| ライブラリ | バージョン | 用途 |
|---|---|---|
| @supabase/supabase-js | ^2.99.2 | Supabase クライアント |
| @supabase/ssr | ^0.9.0 | SSR環境でのセッション管理 |
| server-only | ^0.0.1 | サーバー専用モジュールのブラウザ混入防止 |

**テスト**

| ライブラリ | バージョン | 用途 |
|---|---|---|
| Jest | ^30.3.0 | テストランナー |
| jest-environment-jsdom | ^30.3.0 | ブラウザ環境エミュレート |
| @testing-library/react | ^16.3.2 | コンポーネントレンダリング |
| @testing-library/user-event | ^14.6.1 | ユーザー操作シミュレート |
| @testing-library/jest-dom | ^6.9.1 | DOMマッチャー（toBeInTheDocument等） |
| @types/jest | ^30.0.0 | グローバルjest型定義 |

**開発ツール**

| ライブラリ | バージョン | 用途 |
|---|---|---|
| ESLint | ^9 | Linter |
| eslint-config-next | 16.1.6 | Next.js 推奨 Lint ルール |

---

## 未実装機能

食事 (meals), 日記 (diary), 病院 (hospital) — TOPページにスタブあり（リンク先は `#`）。
