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
import { watchDouyuQuality } from "@/site/douyu/quality";

/**
 * 避免小窗口化
 */
export function avoidSmallWindow() {
  const element = document.querySelector("#js-player-video-case");
  if (!element) return;
  const observer = new MutationObserver(() => {
    observer.disconnect();
    setTimeout(() => element.querySelector(".roomSmallPlayerFloatLayout-closeBtn")?.click(), 3000);
    element.style.left = 0;
    element.className = element.className.replace("is-smallDangling", "");
    const subEl = element.querySelector(".room-Player-Box");
    if (subEl) {
      subEl.className = subEl.className.replace("is-smallDangling", "");
    }
  });
  observer.observe(element, {
    attributes: true,
    attributeFilter: ["class", "style"],
  });
}

/**
 * 自动切换最高画质
 */
export function autoHighestImage() {
  return watchDouyuQuality({
    document,
    shouldSwitch: () => swt.autoHighestImage.isOn(),
  });
}

/**
 * 双击全屏
 */
export function dbClick(element) {
  element.ondblclick = () => {
    if (!document.fullscreenElement) {
      document.body.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyH", bubbles: true }));
    } else {
      document.body.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyY", bubbles: true }));
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
      const aside = document.querySelector("#js-player-asideMain");
      txt = aside?.querySelector(".ChatSend-txt");
      button = aside?.querySelector(".ChatSend-button");
      if (!txt || !button) return;
    }
    txt.innerHTML = bulletChat;
    button.click();
  };
})();
