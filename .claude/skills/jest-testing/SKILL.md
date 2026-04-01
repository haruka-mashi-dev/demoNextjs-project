---
name: jest-testing
description: "Jest + Testing Library でテストコードを書くときに使うスキル。テストファイルの配置・モックの書き方・コンポーネントテストのベストプラクティスをガイドする。新しいテストを追加するとき・既存テストを修正するときは必ずこのスキルを参照する。"
---

# Jest + Testing Library テストガイド

このプロジェクトのスタック: Jest 30 / @testing-library/react / @testing-library/jest-dom / @types/jest

---

## 基本原則

- **カバレッジ原則100%** — ドメイン層・バリデーションスキーマ・UIコンポーネントが対象
- **テストファイルは対象ファイルの隣** — `__tests__/` フォルダに配置する
- **Server Actions はモックに差し替える** — テスト環境では動かないため `jest.mock()` を使う
- **`jest.mock()` はグローバルの `jest` を使う** — `@types/jest` 経由。`import { jest } from "@jest/globals"` は SWC のホイスティングが効かないので使わない

---

## テストファイルの配置

```
src/utils/
  sleep.ts
  __tests__/
    sleep.test.ts         ← 純粋関数のテスト

src/app/(app)/sleep/
  _schema.ts
  __tests__/
    _schema.test.ts       ← Zod スキーマのテスト
  _components/
    sleep-list.tsx
    __tests__/
      sleep-list.test.tsx ← コンポーネントのテスト
```

---

## 純粋関数のテスト（src/utils/）

```ts
// src/utils/__tests__/sleep.test.ts
import { calcSleepMinutes, formatMinutes } from "../sleep";

describe("calcSleepMinutes", () => {
  it("同日の場合：13:00~14:00 で 60分になること", () => {
    expect(calcSleepMinutes("13:00", "14:00")).toBe(60);
  });

  it("日をまたぐ場合：21:00~07:00 で 600分になること", () => {
    expect(calcSleepMinutes("21:00", "07:00")).toBe(600);
  });

  it("就寝・起床が同じ時刻の場合：0分になること", () => {
    expect(calcSleepMinutes("00:00", "00:00")).toBe(0);
  });
});
```

---

## Zod スキーマのテスト

```ts
// src/app/(app)/sleep/__tests__/_schema.test.ts
import { sleepSchema } from "../_schema";

describe("sleepSchema", () => {
  const validData = {
    date: "2025-04-01",
    type: "night",
    bedTime: "22:00",
    wakeUpTime: "06:00",
  };

  it("全フィールドが正しい値のとき成功すること", () => {
    expect(sleepSchema.safeParse(validData).success).toBe(true);
  });

  it("date が空のとき失敗すること", () => {
    const result = sleepSchema.safeParse({ ...validData, date: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("入力必須です");
  });

  it("date が 2025-01-01 より前のとき失敗すること", () => {
    const result = sleepSchema.safeParse({ ...validData, date: "2024-12-31" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("2025年1月1日以降の日付を入力してください");
  });
});
```

---

## コンポーネントのテスト

### Server Actions のモック

```tsx
// ファイルの先頭（import より前）に書く — jest.mock() はホイスティングされる
jest.mock("../../_actions/delete-sleep", () => ({
  deleteSleep: jest.fn(),
}));

import { render, screen } from "@testing-library/react";
import SleepList from "../sleep-list";
```

### next/navigation のモック

```tsx
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));
```

### よく使うクエリと使い分け

| クエリ | 使いどき |
|---|---|
| `screen.getByText("テキスト")` | 必ず存在するテキスト |
| `screen.queryByText("テキスト")` | 存在しないことも確認したいとき |
| `screen.getAllByText(/正規表現/)` | 複数マッチ・テキストノードが分割されているとき |
| `screen.getByRole("button", { name: /ラベル/ })` | ボタン・リンクなどロールで探すとき |

### テキストが分割されている場合は正規表現を使う

```tsx
// ❌ JSX でテキストが分割されていると失敗する
screen.getByText("[夜の睡眠]");

// ✅ 正規表現なら分割されていてもマッチする
screen.getAllByText(/\[夜の睡眠\]/)[0];
```

### コンポーネントテストの例

```tsx
// src/app/(app)/sleep/_components/__tests__/sleep-list.test.tsx
import { render, screen } from "@testing-library/react";
import SleepList from "../sleep-list";
import { SleepRecord } from "@/types/sleep";

jest.mock("../../_actions/delete-sleep", () => ({
  deleteSleep: jest.fn(),
}));

describe("SleepList", () => {
  it("sleepLogs が空のとき「記録がありません」が表示される", () => {
    render(<SleepList sleepLogs={[]} />);
    expect(screen.getByText("記録がありません")).toBeInTheDocument();
  });

  it("夜の睡眠 1件のとき日付・時刻・合計が表示される", () => {
    const mockRecord: SleepRecord = {
      id: 1,
      date: "2026-04-01",
      type: "night",
      bedTime: "22:00",
      wakeUpTime: "06:00",
    };

    render(<SleepList sleepLogs={[mockRecord]} />);

    expect(screen.getByText("04/01(水)")).toBeInTheDocument();
    expect(screen.getAllByText(/\[夜の睡眠\]/)[0]).toBeInTheDocument();
    expect(screen.getByText("22:00 → 06:00")).toBeInTheDocument();
    expect(screen.getByText("（8時間0分）")).toBeInTheDocument();
  });
});
```

---

## テスト実行コマンド

```bash
npx jest                                    # 全テストを実行
npx jest path/to/file.test.ts               # 特定ファイルだけ実行
npx jest --testPathPatterns="sleep-list"    # ファイル名で絞り込み
npx jest --watch                            # 変更を監視して自動再実行
```
