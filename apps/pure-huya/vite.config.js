import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import monkey, { cdn } from 'vite-plugin-monkey';
import packageJson from './package.json';

export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.js',
      userscript: {
        name: '纯净版虎牙（pure huya）',
        namespace: 'https://github.com/ljezio',
        version: packageJson.version,
        description:
          '虎牙纯净版（douyu.com）。只保留直播和弹幕【虎牙精简版、虎牙极简版、虎牙清爽版】；支持按钮切换关闭脚本；支持自动切换最高画质；',
        icon: 'https://www.huya.com/favicon.ico',
        homepage: 'https://github.com/ljezio/pure-live',
        author: 'ljezio',
        license: 'MIT',
        match: ['*://*.huya.com/*'],
      },
      build: {
        externalGlobals: {
          vue: cdn.npmmirror('Vue', 'dist/vue.global.prod.js'),
        },
      },
    }),
  ],
});
