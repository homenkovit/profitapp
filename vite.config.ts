/* eslint-disable unicorn/prefer-module */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-default-export */
// eslint-disable-next-line unicorn/import-style
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import checker from 'vite-plugin-checker'
import tsconfigPaths from 'vite-tsconfig-paths'

const rootDirectory = resolve('./src/')
const buildDirectory = resolve('./dist/')
const publicDirectory = resolve('./public/')

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development'

  return {
    plugins: [
      react(),
      svgr(),
      tsconfigPaths(),
      checker({
        typescript: true,
      }),
    ],
    root: rootDirectory,
    publicDir: publicDirectory,
    css: {
      devSourcemap: isDevelopment,
    },
    build: {
      emptyOutDir: true,
      minify: true,
      sourcemap: isDevelopment,
      chunkSizeWarningLimit: 200,
      outDir: buildDirectory,
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          entryFileNames: `scripts/[name]-[hash].js`,
          chunkFileNames: (chunkInfo): string => {
            if (chunkInfo.name === 'index') {
              return `scripts/${chunkInfo.facadeModuleId?.split('/').at(-2)}-[hash].js`
            }
            return `scripts/[name]-[hash].js`
          },
          assetFileNames: `static/[name]-[hash][extname]`,

          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            vendor: ['@tippyjs/react', 'react-textarea-autosize'],
          },
        },
      },
    },
  }
})
