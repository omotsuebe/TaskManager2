import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// we need to create this file because at this time in Remix v2.8.1 vitest doesnt work well in the vite.config.ts
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/vitest.setup.ts'],
    css: true,
  },
});