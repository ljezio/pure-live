import {defineConfig} from 'vite';
import packageJson from './package.json';
import monkey, {cdn} from 'vite-plugin-monkey';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [
        vue(),
        monkey({
            entry: 'src/main.js',
            userscript: {
                name: '纯净版斗鱼（douyu）',
                namespace: 'https://github.com/ljezio',
                version: packageJson.version,
                description: '斗鱼纯净版（douyu.com）。只保留直播和弹幕【斗鱼精简版、斗鱼极简版、斗鱼清爽版】；支持按钮切换关闭脚本；支持自动切换最高画质；',
                icon: 'https://www.douyu.com/favicon.ico',
                homepage: 'https://github.com/ljezio/pure-douyu',
                author: 'ljezio',
                license: 'MIT',
                match: [
                    '*://*.douyu.com/0*',
                    '*://*.douyu.com/1*',
                    '*://*.douyu.com/2*',
                    '*://*.douyu.com/3*',
                    '*://*.douyu.com/4*',
                    '*://*.douyu.com/5*',
                    '*://*.douyu.com/6*',
                    '*://*.douyu.com/7*',
                    '*://*.douyu.com/8*',
                    '*://*.douyu.com/9*',
                    '*://*.douyu.com/topic/*',
                    '*://*.douyu.com/beta/*',
                ],
            }, build: {
                externalGlobals: {
                    vue: cdn.npmmirror('Vue', 'dist/vue.global.prod.js'),
                },
            },
        }),
    ],
});