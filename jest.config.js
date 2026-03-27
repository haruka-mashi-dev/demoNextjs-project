// jest.config.js
// ─────────────────────────────────────────────────────────────────────────────
// Jest の設定ファイル。
// next/jest を使うことで、Next.js + TypeScript 向けの設定を自動でやってくれる。
//   - TypeScript (.ts/.tsx) を SWC でトランスパイル
//   - @/* パスエイリアスを解決
//   - server-only などの Next.js 専用モジュールをモック
// ─────────────────────────────────────────────────────────────────────────────

const nextJest = require("next/jest");

// プロジェクトルートを指定して、next.config.js / .env を読み込ませる
const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const customJestConfig = {
  // jsdom: ブラウザ相当の DOM 環境をシミュレートする
  // → React コンポーネントのテストに必要
  testEnvironment: "jsdom",

  // 各テストファイルの実行前に読み込む共通セットアップ
  // → @testing-library/jest-dom のカスタムマッチャーを登録する
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

// next/jest が内部設定をマージして最終的な設定を返す
module.exports = createJestConfig(customJestConfig);
