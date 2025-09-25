// ==UserScript==
// @name         纯净版斗鱼（douyu）
// @namespace    https://github.com/ljezio
// @version      4.0.0-rc2
// @description  斗鱼纯净版（douyu.com）。只保留直播和弹幕【斗鱼精简版、斗鱼极简版、斗鱼清爽版】；支持按钮切换是否启用脚本；
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

const switchKey = 'pure_douyu_switch';

(function () {
    'use strict';

    const buttonGroup = functionButtons();
    if (localStorage.getItem(switchKey)) return;
    removeNude().finally(() => autoFullWindow());
    dbClick(buttonGroup);
    newNodeObserver();
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
        <svg viewBox="0 0 1025 1024" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
            <path d="M512.64 0C229.674667 0 0.298667 229.248 0.298667 512s229.376 512 512.384 512c282.965333 0 512.341333-229.248 512.341333-512S795.605333 0 512.64 0z m-37.290667 225.578667a38.528 38.528 0 0 1 77.141334 0v134.741333a38.528 38.528 0 0 1-77.141334 0V225.578667z m38.570667 578.773333a280.405333 280.405333 0 0 1-280.490667-280.277333 280.192 280.192 0 0 1 203.477334-269.312V323.413333a215.04 215.04 0 0 0 76.970666 415.829334 215.210667 215.210667 0 0 0 215.296-215.125334 215.04 215.04 0 0 0-138.282666-200.704V254.72c117.418667 33.493333 203.477333 141.269333 203.477333 269.312a280.362667 280.362667 0 0 1-280.448 280.32z" fill="#2C9EFF"/>
        </svg>
    `;
    buttonGroup.appendChild(switchButton);
    // 按钮半透明样式与鼠标悬停透明度变化
    switchButton.style.cssText = 'display: block; cursor: pointer; opacity: 0.5; transition: opacity 0.3s ease;';
    switchButton.onmouseover = () => switchButton.style.opacity = '1';
    switchButton.onmouseout = () => switchButton.style.opacity = '0.5';
    // 开关脚本按钮功能
    switchButton.onclick = () => {
        if (localStorage.getItem(switchKey)) {
            localStorage.removeItem(switchKey);
        } else {
            localStorage.setItem(switchKey, 'off');
        }
        location.reload();
    };
    return buttonGroup;
}

/**
 * 隐藏无用元素
 */
function removeNude() {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (!document.querySelectorAll('.wm-general')) return;
            setDisplayNone(document.querySelector('header'));
            document.querySelector('aside')?.remove();
            document.querySelectorAll('.wm-general')?.forEach(node => node.remove());
            document.querySelectorAll('.bc-wrapper ')?.forEach(node => node.remove());
            document.querySelector('[class^="snapbar__"]')?.remove();
            setDisplayNone(document.querySelector('[class^="sidebar__"]'));
            document.querySelector('[class^="title__"]')?.remove();
            document.querySelector('[class^="interactive__"]')?.remove();
            setDisplayNone(document.querySelector('#js-bottom-left'));
            document.querySelector('#bc3')?.remove();
            document.querySelector('#bc3-bgblur')?.remove();
            document.querySelector('#js-player-dialog')?.remove();
            document.querySelector('#js-player-above-controller')?.remove();
            // 修改样式
            const stream = document.querySelector('[class^="stream__"]');
            stream.style.bottom = '0';
            stream.style.top = '0';
            document.querySelector('[class^="case__"]').style.padding = '0';
            document.querySelector('#js-player-main').style.margin = '0';
            // 强制修改伪元素样式
            const style = document.createElement('style');
            style.textContent = `
              #js-player-main::before {
                content: none !important;
              }
              .${document.querySelector('[class^="player__"]').className.split(' ')[0]}::before {
                padding-top: 0 !important;
                padding-bottom: ${innerHeight - 16}px !important;
              }
            `;
            document.head.appendChild(style);
            clearInterval(interval);
            resolve();
        }, 500);
    });
}

/**
 * 自动网页全屏
 */
function autoFullWindow() {
    const fullWindowInterval = setInterval(() => {
        // 自动网页全屏
        if (fullWindow()) {
            clearInterval(fullWindowInterval);
            setTimeout(() => {
                setDisplayNone(document.querySelector('[class^="toggle__"]'));
                setDisplayNone(document.querySelector('#js-layout-fixed-buff'));
            }, 10);
        }
    }, 300);
}

/**
 * 双击全屏
 */
function dbClick(buttonGroup) {
    document.querySelector('body').ondblclick = event => {
        event.stopPropagation();
        const controlBar = document.querySelector('[class^="right-"]') ||
            document.querySelector('[class^="right__"]');
        if (!controlBar) return;
        const controlButtons = controlBar.childNodes;
        if (!document.fullscreenElement) {
            controlButtons[controlButtons.length - 1].click();
        } else {
            document.exitFullscreen().then();
        }
    };
    document.onfullscreenchange = () => {
        if (!document.fullscreenElement) {
            setTimeout(() => fullWindow(), 0);
            buttonGroup.style.display = 'block';
        } else {
            setDisplayNone(buttonGroup);
        }
    };
}

/**
 * 移除后增无用元素
 */
function newNodeObserver() {
    new MutationObserver(mutations => {
        for (let mutation of mutations) {
            if (mutation.type !== 'childList') {
                continue;
            }
            for (let node of mutation.addedNodes) {
                if (node.className === 'RechangeJulyPopups') {
                    node.remove();
                }
            }
        }
    }).observe(document.querySelector('body'), {childList: true})
}

/**
 * 网页全屏
 */
function fullWindow() {
    const controlBar = document.querySelector('[class^="right-"]') ||
        document.querySelector('[class^="right__"]');
    if (!controlBar) return false;
    const controlButtons = controlBar.childNodes;
    controlButtons[controlButtons.length - 2].click();
    return true;
}

/**
 * 隐藏元素
 */
function setDisplayNone(node) {
    if (!node) return;
    node.style.display = "none";
}