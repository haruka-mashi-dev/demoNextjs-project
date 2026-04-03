// jest.setup.ts
// ─────────────────────────────────────────────────────────────────────────────
// 各テストファイルが実行される前に一度だけ呼ばれるセットアップ。
//
// @testing-library/jest-dom を import することで、
// expect() に DOM 検証用のカスタムマッチャーが追加される。
//
// 例：
//   expect(element).toBeInTheDocument()  // 要素が DOM に存在するか
//   expect(button).toBeDisabled()        // ボタンが無効状態か
//   expect(input).toHaveValue("abc")     // input の値が "abc" か
// ─────────────────────────────────────────────────────────────────────────────

// @testing-library/jest-dom のカスタムマッチャーをグローバルに登録する
// → toBeInTheDocument(), toBeDisabled(), toHaveValue() など
import "@testing-library/jest-dom";

// jsdom は ResizeObserver を実装していないため、Radix UI（shadcn）が使う箇所でエラーになる。
// ダミー実装でグローバルに差し替えて回避する。
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
