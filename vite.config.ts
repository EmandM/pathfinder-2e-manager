import type { PluginOption } from 'vite'
import path from 'node:path'

import Vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import { defineConfig } from 'vite'
import VueRouter from 'vue-router/vite'
/// <reference types="vitest/config" />

// https://vitejs.dev/config/
export default defineConfig({
  base: '/pathfinder-2e-manager/',
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/styles/element/index.scss" as *;`,
        api: 'modern-compiler',
      },
    },
  },

  plugins: [
    VueRouter({
      extensions: ['.vue', '.md'],
      dts: 'src/route-map.d.ts',
    }) as PluginOption,

    Vue({
      include: [/\.vue$/, /\.md$/], // <-- allows Vue to compile Markdown files
    }),
    Markdown({ /* options */ }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
        IconsResolver({
          // enabledCollections: ['material-symbols-light'],
          alias: {
            msl: 'material-symbols-light',
            // ...
          },
        }),
      ],
      dts: 'src/components.d.ts',
    }),

    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    Unocss(),

    Icons({
      compiler: 'vue3',
      // experimental
      autoInstall: true,
    }),
    // visualizer() as PluginOption,
  ] as PluginOption[],

  // Vitest test configuration
  test: {
    environment: 'jsdom',
    server: {
      deps: {
        inline: ['element-plus'],
      },
    },
  },
})
