// ==UserScript==
// @name         纯净版斗鱼（douyu）
// @namespace    https://github.com/ljezio
// @version      2.2.4
// @description  斗鱼纯净版（douyu.com），只保留直播和弹幕，并提供关灯模式【斗鱼精简版、斗鱼极简版、斗鱼清爽版】
// @homepage     https://github.com/ljezio/pure-douyu
// @author       ljezio
// @license      MIT
// @match        https://www.douyu.com/*
// @icon         https://www.douyu.com/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 通过注入CSS的方式强制设置背景为纯黑色，避免被网站原有样式覆盖
    const style = document.createElement('style');
    style.innerHTML = 'html, body { background-color: #000 !important; }';
    document.head.appendChild(style);

    const player = document.querySelector('.layout-Player');
    const root = document.querySelector('#root') ||
        document.querySelector('section[class="layout-Container"]');
    if (!root || !player) return;
    dbClick(player);
    autoClick();
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
 * 自动点击按钮
 */
function autoClick() {
    // 点击关闭所有礼物特效按钮
    setTimeout(() => {
        document.querySelectorAll('.ShieldTool-list .ShieldTool-listItem.is-noChecked')
            ?.forEach(element => element.click());
    }, 1000 * 10);
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
    new MutationObserver(mutations => {
        for (let mutation of mutations) {
            if (mutation.type !== 'childList') {
                continue;
            }
            for (let node of mutation.addedNodes) {
                // 移除客服按钮
                if (node.className === 'bacpCommonKeFu  ' || node.id === 'webmActKefuWeidget'
                    || node.className === 'RechangeJulyPopups') {
                    setDisplayNone(node);
                }
            }
        }
    }).observe(document.querySelector('body'), {childList: true})
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
    }, 1000);
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
