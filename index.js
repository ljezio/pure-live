// ==UserScript==
// @name         纯净版斗鱼（douyu）
// @namespace    https://github.com/ljezio
// @version      3.0.0
// @description  斗鱼纯净版（douyu.com）。只保留直播和弹幕【斗鱼精简版、斗鱼极简版、斗鱼清爽版】；支持按钮切换脚本开关、切换开关灯；
// @homepage     https://github.com/ljezio/pure-douyu
// @author       ljezio
// @license      MIT
// @match        https://www.douyu.com/*
// @icon         https://www.douyu.com/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    functionButtons();
    const player = document.querySelector('.layout-Player');
    const root = document.querySelector('#root') ||
        document.querySelector('section[class="layout-Container"]');
    if (localStorage.getItem('pure_douyu_switch') || !root || !player) return;
    dbClick(player);
    autoClick();
    removeNude(root, player);
    clearPayer(player);
})();

/**
 * 功能按钮
 */
function functionButtons() {
    const body = document.querySelector('body');
    const buttonGroup = document.createElement('div');
    buttonGroup.style.cssText = 'z-index: 999; position: fixed; top: 0; right: 0;';
    body.appendChild(buttonGroup);
    const switchButton = document.createElement('button');
    switchButton.title = '切换脚本启用状态';
    switchButton.innerHTML = `
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
            <filter id="pure-douyu-invert-filter-0">
                <feColorMatrix type="matrix" values="-1 0 0 0 1 0 -1 0 0 1 0 0 -1 0 1 0 0 0 1 0" />
            </filter>
            <path d="M643.7888 112.3328A465.3056 465.3056 0 0 1 980.992 533.7088l0.6144 25.1904A465.5104 465.5104 0 0 1 515.7888 1024 465.5104 465.5104 0 0 1 50.4832 583.0656L49.8688 559.104a464.896 464.896 0 0 1 338.1248-446.6688v113.9712a356.7616 356.7616 0 0 0-228.864 310.0672 356.864 356.864 0 0 0 333.4144 378.88l23.2448 0.8192a357.376 357.376 0 0 0 357.0688-335.872l0.6144-20.8896a356.6592 356.6592 0 0 0-229.7856-333.2096zM515.7888 0c30.9248 0 57.4464 22.016 63.0784 52.4288l1.024 11.5712v223.4368a64 64 0 0 1-128.2048 0V64c0-35.328 28.672-63.8976 64-64z"/>
        </svg>`
    buttonGroup.appendChild(switchButton);
    const themeButton = document.createElement('button');
    themeButton.title = '切换开关灯状态';
    themeButton.innerHTML = `
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
            <filter id="pure-douyu-invert-filter-1">
                <feColorMatrix type="matrix" values="-1 0 0 0 1 0 -1 0 0 1 0 0 -1 0 1 0 0 0 1 0" />
            </filter>
            <path d="M506 64.7C257.9 64.7 58.6 263.9 58.6 512S257.9 959.4 506 959.4 953.4 760.1 953.4 512 754.1 64.7 506 64.7z m0 854.1c-223.7 0-406.7-183-406.7-406.7s183-406.7 406.7-406.7v813.4z"/>
        </svg>`
    buttonGroup.appendChild(themeButton);
    const buttonArr = [switchButton, themeButton];
    // 按钮半透明样式与鼠标悬停效果
    buttonArr.forEach(button => {
        button.style.color = 'red';
        button.style.cssText = 'display: block; cursor: pointer; opacity: 0.3; transition: opacity 0.3s ease;';
        button.onmouseover = () => button.style.opacity = '1';
        button.onmouseout = () => button.style.opacity = '0.3';
    });
    // 开关脚本按钮功能
    switchButton.onclick = () => {
        if (localStorage.getItem('pure_douyu_switch')) {
            localStorage.removeItem('pure_douyu_switch');
        } else {
            localStorage.setItem('pure_douyu_switch', 'off');
        }
        location.reload();
    };
    if (localStorage.getItem('pure_douyu_switch')) {
        // 不启用脚本时不激活开关灯按钮功能
        return;
    }
    // 开关灯按钮功能
    if (localStorage.getItem('pure_douyu_theme')) {
        darkModel();
    } else {
        lightModel();
    }
    themeButton.onclick = () => {
        if (localStorage.getItem('pure_douyu_theme')) {
            lightModel();
            localStorage.removeItem('pure_douyu_theme');
        } else {
            darkModel();
            localStorage.setItem('pure_douyu_theme', 'dark');
        }
    };
    function darkModel() {
        body.style.setProperty('background-color', '#000', 'important');
        buttonArr.forEach((button, index) =>
            button.children[0].setAttribute('filter', `url(#pure-douyu-invert-filter-${index})`));
    }
    function lightModel() {
        body.style.setProperty('background-color', '#fff', 'important');
        buttonArr.forEach(button =>
            button.children[0].removeAttribute('filter'));
    }
}

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