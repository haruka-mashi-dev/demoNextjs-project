## テスト対象
- src/utils/sleep.ts
- src/app/(app)/sleep/_schema.ts

## テストフレームワーク
- Jest 29.x
- @testing-library/react 16.x
- @testing-library/user-event 14x
- @testing-library/jest-dom 6.x

## テストケース

- src/utils/sleep.ts
calcSleepMinutes(start, end)
formatMinutes(minutes)

- sleepSchemaのテスト
src/app/(app)/sleep/_schema.ts

## 記載例

describe("テスト対象の名前", () => {   // ← グループ
  it("〜のとき〜になること", () => {  // ← 1ケース
    expect(実際の値).toBe(期待値);    // ← 検証
  });
});
describe … 関連するテストをまとめるグループ名
it … 「このコードはこう動くはず」という1つの仕様
expect().toBe() … 「実際の結果」と「期待値」を比較する
では最初の1ケースだけ書きます。

## テスト実行方法
# 全テストを1回実行
npm test

# 特定のファイルだけ実行（今は sleep.test.ts だけ動かしたいとき）
npx jest src/utils/sleep.test.ts

# ファイルの変更を監視して自動で再実行（開発中に便利）
npm run test:watch
