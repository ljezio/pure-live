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
        name: '纯净直播（pure live）',
        namespace: 'https://github.com/ljezio',
        version: packageJson.version,
        description: '纯净直播，只保留直播和弹幕，支持斗鱼、虎牙、B站直播、抖音直播',
        icon: 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB0PSIxNzYxMDcyMzM2NjA2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQ4NjYiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNMzI5Ljk1NTU1NiAzODYuODQ0NDQ0aDU0Ni4xMzMzMzNjNTAuMDYyMjIyIDAgOTEuMDIyMjIyIDQwLjk2IDkxLjAyMjIyMiA5MS4wMjIyMjN2MzQxLjMzMzMzM2MwIDUwLjA2MjIyMi00MC45NiA5MS4wMjIyMjItOTEuMDIyMjIyIDkxLjAyMjIyMkgzMjkuOTU1NTU2Yy01MC4wNjIyMjIgMC05MS4wMjIyMjItNDAuOTYtOTEuMDIyMjIzLTkxLjAyMjIyMlY0NzcuODY2NjY3YzAtNTAuMDYyMjIyIDQwLjk2LTkxLjAyMjIyMiA5MS4wMjIyMjMtOTEuMDIyMjIzeiIgZmlsbD0iIzIwREFCNCIgcC1pZD0iNDg2NyI+PC9wYXRoPjxwYXRoIGQ9Ik04NzYuMDg4ODg5IDEwMjRIMTQ3LjkxMTExMWMtNjMuNzE1NTU2IDAtMTEzLjc3Nzc3OC01MC4wNjIyMjItMTEzLjc3Nzc3OC0xMTMuNzc3Nzc4VjI5NS44MjIyMjJjMC02My43MTU1NTYgNTAuMDYyMjIyLTExMy43Nzc3NzggMTEzLjc3Nzc3OC0xMTMuNzc3Nzc4aDcyOC4xNzc3NzhjNjMuNzE1NTU2IDAgMTEzLjc3Nzc3OCA1MC4wNjIyMjIgMTEzLjc3Nzc3OCAxMTMuNzc3Nzc4djYxNC40YzAgNjMuNzE1NTU2LTUwLjA2MjIyMiAxMTMuNzc3Nzc4LTExMy43Nzc3NzggMTEzLjc3Nzc3OHpNMTQ3LjkxMTExMSAyMjcuNTU1NTU2Yy0zOC42ODQ0NDQgMC02OC4yNjY2NjcgMjkuNTgyMjIyLTY4LjI2NjY2NyA2OC4yNjY2NjZ2NjE0LjRjMCAzOC42ODQ0NDQgMjkuNTgyMjIyIDY4LjI2NjY2NyA2OC4yNjY2NjcgNjguMjY2NjY3aDcyOC4xNzc3NzhjMzguNjg0NDQ0IDAgNjguMjY2NjY3LTI5LjU4MjIyMiA2OC4yNjY2NjctNjguMjY2NjY3VjI5NS44MjIyMjJjMC0zOC42ODQ0NDQtMjkuNTgyMjIyLTY4LjI2NjY2Ny02OC4yNjY2NjctNjguMjY2NjY2SDE0Ny45MTExMTF6IiBmaWxsPSIjMTA2RDVBIiBwLWlkPSI0ODY4Ij48L3BhdGg+PHBhdGggZD0iTTc4NS4wNjY2NjcgODg3LjQ2NjY2N0gyMzguOTMzMzMzYy02My43MTU1NTYgMC0xMTMuNzc3Nzc4LTUwLjA2MjIyMi0xMTMuNzc3Nzc3LTExMy43Nzc3NzhWMzg2Ljg0NDQ0NGMwLTYzLjcxNTU1NiA1MC4wNjIyMjItMTEzLjc3Nzc3OCAxMTMuNzc3Nzc3LTExMy43Nzc3NzdoNTQ2LjEzMzMzNGM2My43MTU1NTYgMCAxMTMuNzc3Nzc4IDUwLjA2MjIyMiAxMTMuNzc3Nzc3IDExMy43Nzc3Nzd2Mzg2Ljg0NDQ0NWMwIDYzLjcxNTU1Ni01MC4wNjIyMjIgMTEzLjc3Nzc3OC0xMTMuNzc3Nzc3IDExMy43Nzc3Nzh6TTIzOC45MzMzMzMgMzE4LjU3Nzc3OGMtMzguNjg0NDQ0IDAtNjguMjY2NjY3IDI5LjU4MjIyMi02OC4yNjY2NjYgNjguMjY2NjY2djM4Ni44NDQ0NDVjMCAzOC42ODQ0NDQgMjkuNTgyMjIyIDY4LjI2NjY2NyA2OC4yNjY2NjYgNjguMjY2NjY3aDU0Ni4xMzMzMzRjMzguNjg0NDQ0IDAgNjguMjY2NjY3LTI5LjU4MjIyMiA2OC4yNjY2NjYtNjguMjY2NjY3VjM4Ni44NDQ0NDRjMC0zOC42ODQ0NDQtMjkuNTgyMjIyLTY4LjI2NjY2Ny02OC4yNjY2NjYtNjguMjY2NjY2SDIzOC45MzMzMzN6TTM3NS40NjY2NjcgODg3LjQ2NjY2N2gxMTMuNzc3Nzc3djQ1LjUxMTExMWgtMTEzLjc3Nzc3N3YtNDUuNTExMTExeiBtMTgyLjA0NDQ0NCAwaDExMy43Nzc3Nzh2NDUuNTExMTExaC0xMTMuNzc3Nzc4di00NS41MTExMTF6IiBmaWxsPSIjMTA2RDVBIiBwLWlkPSI0ODY5Ij48L3BhdGg+PHBhdGggZD0iTTcxNi44IDc5Ni40NDQ0NDR2LTQ1LjUxMTExMWM0MC45NiAwIDQ1LjUxMTExMS00NS41MTExMTEgNDUuNTExMTExLTQ3Ljc4NjY2NlY0NTUuMTExMTExaDQ1LjUxMTExMXYyNTAuMzExMTExYy0yLjI3NTU1NiAzMS44NTc3NzgtMjUuMDMxMTExIDkxLjAyMjIyMi05MS4wMjIyMjIgOTEuMDIyMjIyek01MTIgMjEzLjkwMjIyMmwtMTc1LjIxNzc3OC0xNzUuMjE3Nzc4TDM2OC42NCA2LjgyNjY2NyA1MTIgMTUwLjE4NjY2NyA2NTUuMzYgNi44MjY2NjdsMzEuODU3Nzc4IDMxLjg1Nzc3N3oiIGZpbGw9IiMxMDZENUEiIHAtaWQ9IjQ4NzAiPjwvcGF0aD48L3N2Zz4=',
        homepage: 'https://github.com/ljezio/pure-live',
        author: 'ljezio',
        license: 'GPL-3.0-or-later',
        match: ['*://www.douyu.com/*', '*://www.huya.com/*', '*://live.bilibili.com/*', '*://live.douyin.com/*'],
      },
      build: {
        externalGlobals: {
          vue: cdn.npmmirror('Vue', 'dist/vue.global.prod.js'),
        },
      },
    }),
  ],
});
