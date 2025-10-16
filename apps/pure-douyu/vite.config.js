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
        name: '纯净版斗鱼（pure douyu）',
        namespace: 'https://github.com/ljezio',
        version: packageJson.version,
        description: '斗鱼纯净版，只保留直播和弹幕【斗鱼精简版、斗鱼极简版、斗鱼清爽版】',
        icon: 'https://www.douyu.com/favicon.ico',
        homepage: 'https://github.com/ljezio/pure-live',
        author: 'ljezio',
        license: 'MIT',
        match: ['*://www.douyu.com/*'],
      },
      build: {
        externalGlobals: {
          vue: cdn.npmmirror('Vue', 'dist/vue.global.prod.js'),
        },
      },
    }),
  ],
});
