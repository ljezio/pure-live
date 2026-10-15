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
import { delayJitter, swt } from "@/common/utils";
import { unsafeWindow } from "vite-plugin-monkey/dist/client";
import { watchHuyaQuality } from "@/site/huya/quality";

/**
 * 自动跳过贴片广告
 */
export function skipAd() {
  // 自动关闭前贴片广告
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.className !== "pre-ab-new-wrap") continue;
        node.querySelector(".ab-skip")?.click();
      }
    }
  });
  observer.observe(document.querySelector("#videoContainer"), { childList: true });
  delayJitter(10).then(() => observer.disconnect());
  // 自动关闭中贴片广告
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.className !== "new-reward-ab-container") continue;
        node.querySelector(".ab-close")?.click();
        node.querySelector(".ab-close-2")?.click();
      }
    }
  }).observe(document.querySelector("#player-wrap"), { childList: true });
}

/**
 * 解锁扫码限制并切换最高画质
 */
export function unlockAndSwitchHighestImage() {
  return watchHuyaQuality({
    document,
    pageWindow: unsafeWindow,
    shouldSwitch: () => swt.autoHighestImage.isOn(),
  });
}

/**
 * 双击全屏
 */
export function dbClick(element) {
  element.ondblclick = () => {
    if (!document.fullscreenElement) {
      document.querySelector("#player-fullscreen-btn")?.click();
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
      txt = document.querySelector("#player-full-input-txt");
      button = document.querySelector("#player-full-input-btn");
      if (!txt || !button) return;
    }
    txt.value = bulletChat;
    button.click();
  };
})();
