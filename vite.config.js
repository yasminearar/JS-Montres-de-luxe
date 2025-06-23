import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "./src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "src/index.html"),
        product: resolve(__dirname, "src/product/product.html"),
        register: resolve(__dirname, "src/register/register.html"),
        login: resolve(__dirname, "src/login/login.html"),
      },
    },
  },
});
