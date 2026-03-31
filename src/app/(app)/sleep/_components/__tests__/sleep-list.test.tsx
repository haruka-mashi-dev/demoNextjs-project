import { render, screen } from "@testing-library/react";
import SleepList from "../sleep-list";
import { SleepRecord } from "@/types/sleep";

jest.mock("../../_actions/delete-sleep", () => ({
  deleteSleep: jest.fn(),
}));

describe("SleepList", () => {
  it("sleepLogsが空のとき", () => {
    render(<SleepList sleepLogs={[]} />);
    const emptyMessage = screen.getByText("記録がありません");

    expect(emptyMessage).toBeInTheDocument();
  });

  it("sleepLogsが夜の睡眠1件の時", () => {
    const mockNightRecord: SleepRecord = {
    id: 1,
    date: "2026-04-01",
    type: "night",
    bedTime: "22:00",
    wakeUpTime: "06:00",
    };

    render(<SleepList sleepLogs={[mockNightRecord]} />)

    expect(screen.getByText   ("04/01(水)")).toBeInTheDocument();
    expect(screen.getAllByText(/\[夜の睡眠\]/)[0]).toBeInTheDocument();
    expect(screen.getByText   ("22:00 → 06:00")).toBeInTheDocument();
    expect(screen.getByText   ("（8時間0分）")).toBeInTheDocument();

    expect(screen.getByText   ("合計")).toBeInTheDocument();
    expect(screen.getAllByText("8時間0分").length).toBeGreaterThan(0);
    expect(screen.getByText   ("0時間0分")).toBeInTheDocument();
  });

  it("sleepLogsがお昼寝と夜の睡眠１件ずつの時", () => {
    const mockNightRecord: SleepRecord = {
      id: 1,
      date:"2026-04-01",
      type:"night",
      bedTime: "22:00",
      wakeUpTime: "07:00"
    };
    const mockOhiruneRecord: SleepRecord =
    {
      id: 2,
      date:"2026-04-01",
      type:"ohirune",
      bedTime: "13:00",
      wakeUpTime: "14:00",
    };

    render(<SleepList sleepLogs={[mockNightRecord, mockOhiruneRecord]} />)

    expect(screen.getByText   ("04/01(水)")).toBeInTheDocument();
    expect(screen.getAllByText(/\[夜の睡眠\]/)[0]).toBeInTheDocument();
    expect(screen.getByText   ("22:00 → 07:00")).toBeInTheDocument();
    expect(screen.getByText   ("（9時間0分）")).toBeInTheDocument();
    expect(screen.getAllByText(/\[お昼寝\]/)[1]).toBeInTheDocument();
    expect(screen.getByText   ("13:00 → 14:00")).toBeInTheDocument();
    expect(screen.getByText   ("（1時間0分）")).toBeInTheDocument();

    expect(screen.getByText   ("合計")).toBeInTheDocument();
    expect(screen.getAllByText("9時間0分").length).toBeGreaterThan(0);
    expect(screen.getByText   ("1時間0分")).toBeInTheDocument();
    expect(screen.getByText   ("10時間0分")).toBeInTheDocument();
  });

  it("複数日のデータが新しい日付順で表示されているか", () => {
    const records: SleepRecord[] = [
      { id: 1, date: "2026-04-01", type: "night", bedTime: "22:00", wakeUpTime: "06:00" },
      { id: 2, date: "2026-04-03", type: "night", bedTime: "23:00", wakeUpTime: "07:00" },
    ];

    render(<SleepList sleepLogs={records} />);

    const dates = screen.getAllByText(/\d{2}\/\d{2}\(.+\)/);
    expect(dates[0]).toHaveTextContent("04/03");
    expect(dates[1]).toHaveTextContent("04/01");
  });
});
