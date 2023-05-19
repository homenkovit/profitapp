/* eslint-disable unicorn/prefer-module */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-default-export */
import path from 'node:path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import checker from 'vite-plugin-checker'
import tsconfigPaths from 'vite-tsconfig-paths'

const rootDirectory = path.resolve(__dirname, './src/')
const buildDirectory = path.resolve(__dirname, './dist/')

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    tsconfigPaths(),
    checker({
      typescript: true,
    }),
  ],
  root: rootDirectory,
  build: {
    emptyOutDir: true,
    minify: true,
    sourcemap: true,
    chunkSizeWarningLimit: 200,
    rollupOptions: {
      output: {
        dir: buildDirectory,
        entryFileNames: `scripts/[name]-[hash].js`,
        chunkFileNames: `scripts/[name]-[hash].js`,
        assetFileNames: `static/[name]-[hash][extname]`,

        manualChunks: (id, { getModuleInfo }): string => {
          if ((getModuleInfo(id)?.dynamicImporters?.length ?? 0) > 0) {
            const splitId = id.split('/')
            const fileName = splitId.pop()?.split('.').shift()
            if (fileName === 'index') {
              // directory name
              return splitId.at(-1) ?? fileName
            }
            return fileName ?? ''
          }

          if (id.includes('node_modules')) {
            return 'vendor'
          }

          return 'index'
        },
      },
    },
  },
})
