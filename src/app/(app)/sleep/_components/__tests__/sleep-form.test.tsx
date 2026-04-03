import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SleepForm from "../sleep-form";

jest.mock("../../_actions/create-sleep", () => ({
  createSleep: jest.fn(),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn(),
}));

const mockAction = jest.fn();

describe("SleepForm", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useActionState } = require("react");
    (useActionState as jest.Mock).mockReturnValue([undefined, mockAction, false]);
  });

  it("日付・就寝時間・起床時間・お昼寝チェックボックス・送信ボタンが表示される", () => {
    render(<SleepForm />);

    expect(screen.getByLabelText("日付")).toBeInTheDocument();
    expect(screen.getByLabelText("就寝時間")).toBeInTheDocument();
    expect(screen.getByLabelText("起床時間")).toBeInTheDocument();
    expect(screen.getByLabelText("お昼寝")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "記録する" })).toBeInTheDocument();
  });

  it("就寝時間・起床時間が未入力のとき送信ボタンがdisabledになる", () => {
    render(<SleepForm />);

    expect(screen.getByRole("button", { name: "記録する" })).toBeDisabled();
  });

  it("全項目入力済みのとき送信ボタンが活性化される", () => {
    render(<SleepForm />);

    fireEvent.change(screen.getByLabelText("就寝時間"), { target: { value: "22:00" } });
    fireEvent.change(screen.getByLabelText("起床時間"), { target: { value: "06:00" } });

    expect(screen.getByRole("button", { name: "記録する" })).not.toBeDisabled();
  });

  it("お昼寝チェックボックスをクリックするとチェック状態になる", async () => {
    const user = userEvent.setup();
    render(<SleepForm />);

    const checkbox = screen.getByRole("checkbox", { name: "お昼寝" });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it("isPendingがtrueのとき「記録中...」が表示されてボタンがdisabledになる", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useActionState } = require("react");
    (useActionState as jest.Mock).mockReturnValue([undefined, mockAction, true]);

    render(<SleepForm />);

    expect(screen.getByRole("button", { name: "記録中..." })).toBeDisabled();
  });

  it("フォームエラーがあるときエラーメッセージが表示される", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useActionState } = require("react");
    (useActionState as jest.Mock).mockReturnValue([
      { status: "error", error: { "": ["記録の保存に失敗しました"] } },
      mockAction,
      false,
    ]);

    render(<SleepForm />);

    expect(screen.getByText("記録の保存に失敗しました")).toBeInTheDocument();
  });
});
