import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  base: "/calculadora-imc-vue/", // <--- ERRO AQUI! A chave fecha o objeto cedo demais.
  resolve: {
    // <--- 'resolve' está fora do objeto principal.
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
}); // <--- E ESSE '+)' EXTRA AQUI.
