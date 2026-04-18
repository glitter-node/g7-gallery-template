import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function findProjectRoot(startDir: string): string {
  let dir = startDir;

  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'artisan'))) {
      return dir;
    }
    dir = path.dirname(dir);
  }

  return path.resolve(startDir, '../..');
}

const rootDir = findProjectRoot(__dirname);
const templateNodeModules = path.resolve(__dirname, 'node_modules');

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [rootDir, templateNodeModules],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: [
      'src/**/*.{test,spec}.{ts,tsx}',
      '__tests__/**/*.{test,spec}.{ts,tsx}',
    ],
  },
  resolve: {
    alias: [
      { find: '@core', replacement: path.resolve(rootDir, 'resources/js/core') },
      { find: '@', replacement: path.resolve(rootDir, 'resources/js') },
      { find: '@testing-library/react', replacement: path.resolve(templateNodeModules, '@testing-library/react/dist/@testing-library/react.esm.js') },
      { find: '@testing-library/user-event', replacement: path.resolve(templateNodeModules, '@testing-library/user-event/dist/esm/index.js') },
      { find: /^react$/, replacement: path.resolve(templateNodeModules, 'react/index.js') },
      { find: /^react\/jsx-runtime$/, replacement: path.resolve(templateNodeModules, 'react/jsx-runtime.js') },
      { find: /^react\/jsx-dev-runtime$/, replacement: path.resolve(templateNodeModules, 'react/jsx-dev-runtime.js') },
      { find: /^react-dom$/, replacement: path.resolve(templateNodeModules, 'react-dom/index.js') },
      { find: /^react-dom\/client$/, replacement: path.resolve(templateNodeModules, 'react-dom/client.js') },
      { find: /^react-dom\/test-utils$/, replacement: path.resolve(templateNodeModules, 'react-dom/test-utils.js') },
      { find: /^axios$/, replacement: path.resolve(templateNodeModules, 'axios/index.js') },
      { find: /^@dnd-kit\/core$/, replacement: path.resolve(templateNodeModules, '@dnd-kit/core/dist/index.js') },
      { find: /^@dnd-kit\/sortable$/, replacement: path.resolve(templateNodeModules, '@dnd-kit/sortable/dist/index.js') },
      { find: /^@dnd-kit\/utilities$/, replacement: path.resolve(templateNodeModules, '@dnd-kit/utilities/dist/index.js') },
      { find: /^browser-image-compression$/, replacement: path.resolve(templateNodeModules, 'browser-image-compression/dist/browser-image-compression.js') },
      { find: /^dompurify$/, replacement: path.resolve(templateNodeModules, 'dompurify/dist/purify.js') },
      { find: /^yet-another-react-lightbox$/, replacement: path.resolve(templateNodeModules, 'yet-another-react-lightbox/dist/index.js') },
      { find: /^yet-another-react-lightbox\/plugins\/zoom$/, replacement: path.resolve(templateNodeModules, 'yet-another-react-lightbox/dist/plugins/zoom.js') },
      { find: /^yet-another-react-lightbox\/plugins\/thumbnails$/, replacement: path.resolve(templateNodeModules, 'yet-another-react-lightbox/dist/plugins/thumbnails.js') },
      { find: /^yet-another-react-lightbox\/styles.css$/, replacement: path.resolve(templateNodeModules, 'yet-another-react-lightbox/styles.css') },
    ],
  },
});
