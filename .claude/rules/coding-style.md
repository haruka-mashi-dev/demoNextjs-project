# コーディング規約

## 命名規則

| 対象 | 規則 | 例 |
|---|---|---|
| ファイル名 | kebab-case | `sleep-list.tsx`, `create-sleep.ts` |
| コンポーネント名 | PascalCase | `SleepList`, `SleepPagination` |
| 関数名 | camelCase | `calcSleepMinutes`, `fetchSleepLogs` |
| 型・インターフェース名 | PascalCase | `SleepRecord` |
| Zodスキーマ名 | camelCase + `Schema` suffix | `sleepSchema` |
| 定数 | UPPER_SNAKE_CASE | `PAGE_SIZE` |
| DBカラム（Supabase） | snake_case | `bed_time`, `wake_up_time` |
| TypeScript プロパティ | camelCase | `bedTime`, `wakeUpTime` |

> DBカラムは snake_case だが、TypeScript 側では必ず camelCase に変換して扱う。

## コミットメッセージルール

`<type>: <概要>` の形式で記述する。

| type | 説明 |
|---|---|
| `feat` | 新機能 |
| `fix` | バグフィックス |
| `docs` | ドキュメント |
| `style` | コードスタイル修正 |
| `refactor` | リファクタリング |
| `test` | テスト |
| `perf` | パフォーマンス改善 |
| `build` | ビルド関連 |
| `ci` | CI関連 |
| `revert` | コミット取り消し（git revert） |
| `chore` | 雑事（カテゴライズ不要なもの） |
