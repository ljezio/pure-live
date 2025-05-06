// ==UserScript==
// @name         纯净版斗鱼（douyu）
// @namespace    https://github.com/ljezio
// @version      1.3
// @description  斗鱼（douyu）纯净版
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
    dbClick(player);
    removeNude(root, player);
    clearPayer(player);

    /**
     * 双击全屏
     */
    function dbClick(player) {
        player.ondblclick = () => {
            if (!document.fullscreenElement) {
                document.querySelector('div[title="全屏"]')?.click();
            } else {
                document.exitFullscreen().then();
            }
        }
    }

    /**
     * 隐藏无用元素
     */
    function removeNude(root, player) {
        root.style.padding = '0';
        root.appendChild(player);
        for (let node of root.children) {
            if (!node.isSameNode(player)) {
                setDisplayNone(node);
            }
        }
    }

    /**
     * 播放器隐藏无用元素
     */
    function clearPayer(player) {
        document.querySelector('#js-player-title')?.remove();
        document.querySelector('#js-player-toolbar')?.remove();
        document.querySelector('.layout-Player .layout-Player-aside')?.remove();
        const interval = setInterval(() => {
            const element = document.querySelector('div[class^="controlbar-"]');
            if (!element) return;
            element.style.width = '100%';
            setDisplayNone(document.querySelector('div[title="网页全屏"]'));
            setDisplayNone(document.querySelector('div[title="退出网页全屏"]'));
            clearInterval(interval)
        }, 1000)
        resizePlayer(player);
    }

    /**
     * 播放器自适应宽高
     */
    function resizePlayer(player) {
        const windowHeight = innerHeight - 10;
        const height = player.offsetHeight;
        if (height > windowHeight) {
            player.style.width = innerWidth * (windowHeight / height) + 'px'
        }
        player.style.margin = '0 auto';
    }

    /**
     * 隐藏元素
     */
    function setDisplayNone(node) {
        if (!node) return;
        node.style.display = "none";
    }
})();