// ==UserScript==
// @name         纯净版斗鱼（douyu）
// @namespace    https://github.com/ljezio
// @version      2.0
// @description  斗鱼（douyu.com）极致纯净版，只保留直播和弹幕
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
})();

/**
 * 双击全屏
 */
function dbClick(player) {
    player.ondblclick = event => {
        event.stopPropagation();
        if (!document.fullscreenElement) {
            const element = document.querySelector('div[title="全屏"]');
            if (element) {
                element.click();
            } else {
                toast.show("等待加载完成...");
            }
        } else {
            document.exitFullscreen().then();
        }
    };
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
    setTimeout(() => {
        setDisplayNone(document.querySelector('div[class^="bacpCommonKeFu"]'));
        setDisplayNone(document.querySelector('#webmActKefuWeidget'));
    }, 2000);
}

/**
 * 播放器隐藏无用元素
 */
function clearPayer(player) {
    setDisplayNone(document.querySelector('#js-player-title'));
    setDisplayNone(document.querySelector('.layout-Player .layout-Player-aside'));
    document.querySelector('#js-player-toolbar')?.remove();
    // 播放器自适应宽高
    const windowHeight = innerHeight - 10;
    const height = player.offsetHeight;
    if (height > windowHeight) {
        player.style.width = innerWidth * (windowHeight / height) + 'px'
    }
    player.style.margin = '0 auto';
    // 移除播放器控制栏多余按钮
    const interval = setInterval(() => {
        const element = document.querySelector('div[class^="controlbar-"]');
        if (!element) return;
        element.style.width = '100%';
        setDisplayNone(document.querySelector('div[title="主播精彩时刻"]'));
        setDisplayNone(document.querySelector('div[title="问题反馈"]'));
        setDisplayNone(document.querySelector('div[title="多路观看"]'));
        setDisplayNone(document.querySelector('div[title="网页全屏"]'));
        setDisplayNone(document.querySelector('div[title="退出网页全屏"]'));
        clearInterval(interval)
    }, 500);
}

/**
 * 隐藏元素
 */
function setDisplayNone(node) {
    if (!node) return;
    node.style.display = "none";
}

/**
 * toast
 */
const toast = {
    _toast: null,
    show(msg) {
        if (this._toast) return;
        this._toast = document.createElement('div');
        this._toast.innerHTML = msg;
        this._toast.style.cssText = `font-size: 20px;
                                   color: rgb(255, 255, 255);
                                   background-color: rgba(0, 0, 0, 0.6);
                                   padding: 10px 15px;
                                   margin: 0 0 0 -60px;
                                   border-radius: 4px;
                                   position: fixed;
                                   top: 20%;
                                   left: 50%;
                                   text-align: center;`;
        document.body.appendChild(this._toast);
        setTimeout(() => {
            document.body.removeChild(this._toast)
            this._toast = null
        }, 1500);
    }
}