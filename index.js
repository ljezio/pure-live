// ==UserScript==
// @name         pure-douyu
// @namespace    https://github.com/ljezio
// @version      1.1
// @description  斗鱼纯净版
// @homepage     https://github.com/ljezio/pure-douyu
// @author       ljezio
// @license      MIT
// @match        https://www.douyu.com/*
// @icon         https://www.douyu.com/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const player = document.querySelector('.layout-Player');
    const root = document.querySelector('#root') ||
        document.querySelector('section[class="layout-Container"]');
    if (!root || !player) return;
    removeNude(root);
    // 先把播放器设置为root子节点，再处理播放器
    root.appendChild(player);
    clearPayer(player)
    resize(player);

    /**
     * 移除无用元素
     */
    function removeNude(root) {
        root.style.padding = '0';
        const header = document.querySelector('#js-header');
        if (header) {
            header.style.display = 'none';
        }
        root.innerHTML = '';
        root.appendChild(header);
    }

    /**
     * 清空播放器无用元素
     */
    function clearPayer() {
        document.querySelector('#js-player-title')?.remove();
        document.querySelector('#js-player-toolbar')?.remove();
        document.querySelector('.layout-Player .layout-Player-aside')?.remove();
        const interval = setInterval(() => {
            const element = document.querySelector('div[class^="controlbar-"]');
            if (!element) return;
            element.style.width = '100%';
            document.querySelector('div[title="主播精彩时刻"]')?.remove();
            document.querySelector('div[title="问题反馈"]')?.remove();
            document.querySelector('div[title="显示字幕"]')?.remove();
            document.querySelector('div[title="多路观看"]')?.remove();
            document.querySelector('div[title="网页全屏"]')?.remove();
            clearInterval(interval)
        }, 1000)
    }

    /**
     * 播放器自适应宽高
     */
    function resize(player) {
        const windowHeight = innerHeight - 10;
        const height = player.offsetHeight;
        if (height > windowHeight) {
            player.style.width = innerWidth * (windowHeight / height) + 'px'
        }
        player.style.margin = '0 auto';
    }
})();