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
import { sleep, swt } from '@/common/utils';

/**
 * 自动切换最高画质
 */
export function autoHighestImage() {
  if (swt.autoHighestImage.isOff()) return;
  const control = document.querySelector('.douyin-player-controls-right');
  if (!control) return;
  const observer = new MutationObserver(async (mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.localName !== 'div' || !node.className.includes('QualitySwitchNewPlugin')) continue;
        observer.disconnect();
        node.querySelector('[data-e2e="quality-selector"] > :nth-child(2)')?.click();
        return;
      }
    }
  });
  observer.observe(control, { childList: true, subtree: true });
  sleep(10).then(() => observer.disconnect());
}

/**
 * 双击全屏
 */
export function dbClick(element) {
  element.ondblclick = () => {
    if (!document.fullscreenElement) {
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyH' }));
    } else {
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyY', bubbles: true }));
    }
  };
}

/**
 * 发送弹幕方法
 */
export const sendBulletChatFn = (() => {
  let input, btn;
  return (bulletChat) => {
    if (!input || !btn) {
      const chat = document.querySelector('#chatInput');
      input = chat.querySelector('.zone-container');
      btn = chat.querySelector('.webcast-chatroom___send-btn');
      if (!input || !btn) return;
    }
    input.children[0].innerHTML = `<span data-string="true" data-leaf="true">${bulletChat}</span><span data-string="true" data-enter="true" data-leaf="true">​</span>`;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    btn.dispatchEvent(new Event('click', { bubbles: true }));
  };
})();
