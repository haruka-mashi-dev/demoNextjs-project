import { describe, it, expect } from "@jest/globals";
import { sleepSchema } from "../_schema";

describe("sleepSchema", () => {
  it("全フィールドが正しい値のとき", () => {
    const result = sleepSchema.safeParse({
      date: "2025-04-01",
      type: "night",
      bedTime: "22:00",
      wakeUpTime: "06:00",
    });

    expect(result.success).toBe(true);
  });

  // ── 異常系：date ─────────────────────────────────────────────────────────
  it("date が空のとき失敗すること", () => {
    const result = sleepSchema.safeParse({
      date: "",
      type: "night",
      bedTime: "22:00",
      wakeUpTime: "06:00",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("入力必須です");
  });

  it("date が 2025-01-01 より前のとき失敗すること", () => {
    const result = sleepSchema.safeParse({
      date: "2024-12-31",  // ← 1日前
      type: "night",
      bedTime: "22:00",
      wakeUpTime: "06:00",
    });

    expect(result.success).toBe(false);
    // .refine() で設定したメッセージが返ってくる
    expect(result.error?.issues[0].message).toBe("2025年1月1日以降の日付を入力してください");
  });

  // ── 異常系：type ─────────────────────────────────────────────────────────
  it("type が不正値のとき失敗すること", () => {
    const result = sleepSchema.safeParse({
      date: "2025-04-01",
      type: "invalid",    // ← "night" | "ohirune" 以外
      bedTime: "22:00",
      wakeUpTime: "06:00",
    });

    expect(result.success).toBe(false);
  });

  // ── 異常系：bedTime ───────────────────────────────────────────────────────
  it("bedTime が空のとき失敗すること", () => {
    const result = sleepSchema.safeParse({
      date: "2025-04-01",
      type: "night",
      bedTime: "",         // ← 空文字
      wakeUpTime: "06:00",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("入力必須です");
  });

  // ── 異常系：wakeUpTime ────────────────────────────────────────────────────
  it("wakeUpTime が空のとき失敗すること", () => {
    const result = sleepSchema.safeParse({
      date: "2025-04-01",
      type: "night",
      bedTime: "22:00",
      wakeUpTime: "",      // ← 空文字
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("入力必須です");
  });
});
