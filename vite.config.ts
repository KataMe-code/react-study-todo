import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true, // expect(), descrive()/ it()を毎回インポートしなくてよくなる
    environment: "jsdom", // ブラウザのようなDOMを仮想で用意
    include: ["tests/**/*.test.{ts,tsx}"], // テスト対象のファイルパターン
    setupFiles: ["./tests/setup.ts"], // jest-domの拡張マッチャーを有効化するファイル
  },
  base: "/react-study-todo",
});
