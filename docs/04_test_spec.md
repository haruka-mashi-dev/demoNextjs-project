# 単体テスト仕様書

## テスト対象

| ファイル | 関数 / スキーマ |
|---|---|
| `src/utils/sleep.ts` | `calcSleepMinutes`, `formatMinutes` |
| `src/app/(app)/sleep/_schema.ts` | `sleepSchema` |

## テストフレームワーク

| ライブラリ | 用途 |
|---|---|
| Jest 30.x | テストランナー |
| @testing-library/react 16.x | React コンポーネントのレンダリング（コンポーネントテスト用） |
| @testing-library/user-event 14.x | ユーザー操作のシミュレート（コンポーネントテスト用） |
| @testing-library/jest-dom 6.x | `toBeInTheDocument()` などの DOM 検証マッチャー |

## テストファイルの配置ルール

対象ファイルと同じ階層に `__tests__/` フォルダを作り、その中に配置する。

```
src/utils/
  sleep.ts
  __tests__/
    sleep.test.ts

src/app/(app)/sleep/
  _schema.ts
  __tests__/
    _schema.test.ts
```

## テスト実行コマンド

```bash
# 全テストを実行
npm test

# 特定のファイルだけ実行
npx jest --testPathPatterns="sleep.test"

# ファイルの変更を監視して自動再実行
npm run test:watch
```

---

## テストケース一覧

### `calcSleepMinutes(start, end)`

就寝時刻・起床時刻（"HH:MM"形式）を受け取り、睡眠時間を分で返す。
日をまたぐ場合は 24 時間分（1440 分）を加算して計算する。

**テストファイル：** `src/utils/__tests__/sleep.test.ts`

| # | ケース | 入力 | 期待値 | 観点 |
|---|---|---|---|---|
| 1 | お昼寝 | `13:00` → `14:00` | `60` | 同日・正常系 |
| 2 | 夜の睡眠（日またぎ） | `21:00` → `07:00` | `600` | 日をまたぐ場合 |
| 3 | 就寝・起床が同じ時刻 | `00:00` → `00:00` | `0` | 境界値 |

---

### `formatMinutes(minutes)`

分（数値）を `"X時間Y分"` 形式の文字列に変換する。

**テストファイル：** `src/utils/__tests__/sleep.test.ts`

| # | ケース | 入力 | 期待値 | 観点 |
|---|---|---|---|---|
| 1 | 0分 | `0` | `"0時間0分"` | 最小値 |
| 2 | 1桁の分 | `5` | `"0時間5分"` | 分のみ（1桁） |
| 3 | 2桁の分 | `45` | `"0時間45分"` | 分のみ（2桁） |
| 4 | 時間ちょうど | `300` | `"5時間0分"` | 端数なし |
| 5 | 時間＋分 | `615` | `"10時間15分"` | 2桁時間＋2桁分 |

---

### `sleepSchema`

`@conform-to/zod` と連携する Zod スキーマ。フォームの入力値を検証する。
空フィールドは conform により `undefined` に変換されるため、`z.string({ error: "..." })` が発火する。

**テストファイル：** `src/app/(app)/sleep/__tests__/_schema.test.ts`

| # | ケース | 変更フィールド | 入力値 | 期待結果 | エラーメッセージ |
|---|---|---|---|---|---|
| 1 | 正常系：全フィールド正しい | なし | 正常値一式 | `success: true` | - |
| 2 | date が空 | `date` | `""` | `success: false` | `"入力必須です"` |
| 3 | date が 2025-01-01 より前 | `date` | `"2024-12-31"` | `success: false` | `"2025年1月1日以降の日付を入力してください"` |
| 4 | type が不正値 | `type` | `"invalid"` | `success: false` | （Zod デフォルト） |
| 5 | bedTime が空 | `bedTime` | `""` | `success: false` | `"入力必須です"` |
| 6 | wakeUpTime が空 | `wakeUpTime` | `""` | `success: false` | `"入力必須です"` |

> **補足：** `type` の異常系はエラーメッセージを検証しない。`z.enum()` のデフォルトメッセージは Zod のバージョンアップで変わる可能性があるため、`success: false` のみ確認する。

---

## 実行結果

```
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Time:        0.593 s
```
