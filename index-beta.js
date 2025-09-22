// ==UserScript==
// @name         纯净版斗鱼（douyu）
// @namespace    https://github.com/ljezio
// @version      4.0.0-alpha
// @description  斗鱼纯净版（douyu.com）。只保留直播和弹幕【斗鱼精简版、斗鱼极简版、斗鱼清爽版】；支持按钮切换是否启用脚本、切换开关灯模式；
// @homepage     https://github.com/ljezio/pure-douyu
// @author       ljezio
// @license      MIT
// @match        *://*.douyu.com/0*
// @match        *://*.douyu.com/1*
// @match        *://*.douyu.com/2*
// @match        *://*.douyu.com/3*
// @match        *://*.douyu.com/4*
// @match        *://*.douyu.com/5*
// @match        *://*.douyu.com/6*
// @match        *://*.douyu.com/7*
// @match        *://*.douyu.com/8*
// @match        *://*.douyu.com/9*
// @match        *://*.douyu.com/topic/*
// @match        *://*.douyu.com/beta/*
// @icon         https://www.douyu.com/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    functionButtons();
    if (localStorage.getItem('pure_douyu_switch')) return;

    const interval = setInterval(() => {
        if (!document.querySelectorAll('.wm-general')) return;

        setDisplayNone(document.querySelector('header'));
        setDisplayNone(document.querySelector('aside'));
        document.querySelectorAll('.wm-general')?.forEach(node => setDisplayNone(node));
        document.querySelectorAll('.bc-wrapper ')?.forEach(node => setDisplayNone(node));
        setDisplayNone(document.querySelector('[class^="snapbar__"]'));
        setDisplayNone(document.querySelector('[class^="sidebar__"]'));
        setDisplayNone(document.querySelector('[class^="title__"]'));
        document.querySelector('[class^="interactive__"]')?.remove();
        setDisplayNone(document.querySelector('#js-bottom-left'));

        document.querySelector('[class^="stream__"]').style.bottom = '0';
        document.querySelector('[class^="case__"]').style.padding = '0';
        document.querySelector('#js-player-main').style.margin = '0';

        const controlBar = document.querySelector('[class^="right__"]');
        if (!controlBar) return;
        const controlButtons = controlBar.childNodes;
        controlButtons[controlButtons.length - 2].click();
        clearInterval(interval);
    }, 500);

    document.querySelector('#js-player-main').ondblclick = event => {
        event.stopPropagation();
        const controlBar = document.querySelector('[class^="right__"]') ||
            document.querySelector('[class^="right-"]');
        if (!controlBar) return;
        const controlButtons = controlBar.childNodes;
        if (!document.fullscreenElement) {
            controlButtons[controlButtons.length - 1].click();
        } else {
            document.exitFullscreen().then(() => setTimeout(() =>
                controlButtons[controlButtons.length - 2].click(), 0));
        }
    };
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
                <path d="M643.7888 112.3328A465.3056 465.3056 0 0 1 980.992 533.7088l0.6144 25.1904A465.5104 465.5104 0 0 1 515.7888 1024 465.5104 465.5104 0 0 1 50.4832 583.0656L49.8688 559.104a464.896 464.896 0 0 1 338.1248-446.6688v113.9712a356.7616 356.7616 0 0 0-228.864 310.0672 356.864 356.864 0 0 0 333.4144 378.88l23.2448 0.8192a357.376 357.376 0 0 0 357.0688-335.872l0.6144-20.8896a356.6592 356.6592 0 0 0-229.7856-333.2096zM515.7888 0c30.9248 0 57.4464 22.016 63.0784 52.4288l1.024 11.5712v223.4368a64 64 0 0 1-128.2048 0V64c0-35.328 28.672-63.8976 64-64z"/>
            </svg>`
    buttonGroup.appendChild(switchButton);
    // 按钮半透明样式与鼠标悬停效果
    switchButton.style.cssText = 'display: block; cursor: pointer; opacity: 0.3; transition: opacity 0.3s ease;';
    switchButton.onmouseover = () => switchButton.style.opacity = '1';
    switchButton.onmouseout = () => switchButton.style.opacity = '0.3';
    // 开关脚本按钮功能
    switchButton.onclick = () => {
        if (localStorage.getItem('pure_douyu_switch')) {
            localStorage.removeItem('pure_douyu_switch');
        } else {
            localStorage.setItem('pure_douyu_switch', 'off');
        }
        location.reload();
    };
}

/**
 * 隐藏元素
 */
function setDisplayNone(node) {
    if (!node) return;
    node.style.display = "none";
}