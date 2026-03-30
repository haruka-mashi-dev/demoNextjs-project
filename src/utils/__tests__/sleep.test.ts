import { describe, it, expect } from "@jest/globals";
import { calcSleepMinutes, formatMinutes} from "../sleep";

describe("calcSleepMinutes", () => {
  it("お昼寝：13:00~14:00で60分になること", () => {
    expect(calcSleepMinutes("13:00","14:00")).toBe(60);
  });

  it("夜の睡眠で日を跨ぐ場合：21:00~07:00で600分になること", () => {
    expect(calcSleepMinutes("21:00","07:00")).toBe(600);
  });

  it("就寝時間と起床時間が同じの場合：00:00~00:00", () => {
    expect(calcSleepMinutes("00:00","00:00")).toBe(0);
  });
});

describe("formatMinutes", () => {

  it("0時間0分", () => {
    expect(formatMinutes(0)).toBe("0時間0分");
  });

  it("0時間5分の場合", () => {
    expect(formatMinutes(5)).toBe("0時間5分");
  });

  it("0時間45分の場合", () => {
    expect(formatMinutes(45)).toBe("0時間45分");
  });

  it("5時間の場合", () => {
    expect(formatMinutes(300)).toBe("5時間0分");
  });

  it("10時間15分の場合", () => {
    expect(formatMinutes(615)).toBe("10時間15分");
  })

})