/*
 * pure-live, a script that makes live webpages pure.
 * Copyright (C) 2025-present ljezio
 *
 * This program is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */
import { swt } from "@/common/utils";
import { watchBilibiliQuality } from "@/site/bilibili/quality";

/**
 * 跳转实际直播页
 */
export function redirectRealLive() {
  const root = document.querySelector(".rendererRoot");
  if (!root) return;
  const urlPrefix = `${window.location.href.split("//")[0]}//live.bilibili.com`;
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        const iframe = node.querySelector("iframe");
        if (!iframe?.src?.startsWith(urlPrefix)) continue;
        window.location.replace(iframe.src);
      }
    }
  });
  observer.observe(root, { childList: true, subtree: true });
  setInterval(() => observer.disconnect(), 1000 * 10);
}

/**
 * 自动切换最高画质
 */
export function autoHighestImage() {
  return watchBilibiliQuality({
    document,
    shouldSwitch: () => swt.autoHighestImage.isOn(),
  });
}

/**
 * 双击全屏
 */
export function dbClick(element) {
  let sideOpenFlag = true;
  element.ondblclick = () => {
    if (!document.fullscreenElement) {
      document
        .querySelector("#web-player-controller-wrap-el .right-area :first-child span")
        ?.click();
      // 关闭侧边栏
      if (sideOpenFlag) {
        document.querySelector("#aside-area-toggle-btn")?.click();
        sideOpenFlag = false;
      }
    } else {
      document.exitFullscreen().catch((e) => console.error(e));
    }
  };
}

/**
 * 发送弹幕方法
 */
export const sendBulletChatFn = (() => {
  let txt, button;
  return (bulletChat) => {
    if (!txt || !button) {
      const box = document.querySelector("#control-panel-ctnr-box");
      txt = box?.querySelector(".chat-input");
      button = box?.querySelector(".bl-button");
      if (!txt || !button) return;
    }
    txt.value = bulletChat;
    txt.dispatchEvent(new InputEvent("input"));
    button.click();
  };
})();
