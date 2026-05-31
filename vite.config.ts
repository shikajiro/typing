/// <reference types="vitest/config" />
import { defineConfig } from "vite";

// base: "./" にすると GitHub Pages のサブパスでもローカルプレビューでも
// 相対パスでアセットを解決でき、「URLを開けばすぐ遊べる」を満たせる。
export default defineConfig({
  base: "./",
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    globals: true,
    restoreMocks: true
  }
});
