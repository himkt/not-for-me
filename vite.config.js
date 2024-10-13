import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig((opt) => {
  return {
    root: 'src',
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/main.ts'),
        },
        output: {
          entryFileNames: '[name].js',
        },
      },
    },
  };
});
