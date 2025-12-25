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
import { delayJitter, swt } from '@/common/utils';

/**
 * 避免小窗口化
 */
export function avoidSmallWindow() {
  const element = document.querySelector('#js-player-video-case');
  if (!element) return;
  const observer = new MutationObserver(() => {
    observer.disconnect();
    setTimeout(() => element.querySelector('.roomSmallPlayerFloatLayout-closeBtn')?.click(), 3000);
    element.style.left = 0;
    element.className = element.className.replace('is-smallDangling', '');
    const subEl = element.querySelector('.room-Player-Box');
    if (subEl) {
      subEl.className = subEl.className.replace('is-smallDangling', '');
    }
  });
  observer.observe(element, {
    attributes: true,
    attributeFilter: ['class', 'style'],
  });
}

/**
 * 自动切换最高画质
 */
export function autoHighestImage() {
  if (swt.autoHighestImage.isOff()) return;
  const controlBar = document.querySelector('#js-player-controlbar');
  if (!controlBar) return;
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE || !node.className?.startsWith('ControlBar-')) continue;
        observer.disconnect();
        node.querySelector('[class^="tipItem-"]:nth-child(2) li:first-child')?.click();
        return;
      }
    }
  });
  observer.observe(controlBar, { childList: true, subtree: true });
  delayJitter(10).then(() => observer.disconnect());
}

/**
 * 双击全屏
 */
export function dbClick(element) {
  const keyboardEvent = new KeyboardEvent('keydown', {
    code: 'KeyH',
    bubbles: true,
  });
  element.ondblclick = () => {
    if (!document.fullscreenElement) {
      document.body.dispatchEvent(keyboardEvent);
    } else {
      document.exitFullscreen().then();
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
      const aside = document.querySelector('#js-player-asideMain');
      txt = aside?.querySelector('.ChatSend-txt');
      button = aside?.querySelector('.ChatSend-button');
      if (!txt || !button) return;
    }
    txt.innerHTML = bulletChat;
    button.click();
  };
})();
