import { describe, it, expect } from "@jest/globals";
import { calcSleepMinutes } from "../sleep";

describe("calcSleepMinutes", () => {

  /**
   * 正常系
   */
  it("お昼寝：13:00~14:00で60分になること", () => {
    expect(calcSleepMinutes("13:00","14:00")).toBe(60);
  })
});