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
import { sleep, swt } from '../common/utils';

/**
 * 跳转实际直播页
 */
export function redirectRealLive() {
  const root = document.querySelector('.rendererRoot');
  if (!root) return;
  const urlPrefix = `${window.location.href.split('//')[0]}//live.bilibili.com`;
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        const iframe = node.querySelector('iframe');
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
  if (!swt.autoHighestImage.isOn()) return;
  const player = document.querySelector('#live-player');
  if (!player) return;
  // 模拟鼠标滑动，触发弹出控制栏
  player.dispatchEvent(new MouseEvent('mousemove'));
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.localName !== 'div') continue;
        if (node.className?.startsWith('quality-wrap')) {
          node.dispatchEvent(new MouseEvent('mouseenter'));
        } else if (
          node.className?.startsWith('list-it') &&
          node.previousElementSibling?.className?.startsWith('line-wrap')
        ) {
          observer.disconnect();
          // 暂停1秒模拟手动点击
          sleep(1).then(async () => {
            node.click();
            await sleep(1);
            player.querySelector('.quality-wrap')?.dispatchEvent(new MouseEvent('mouseleave'));
          });
          return;
        }
      }
    }
  });
  observer.observe(player, { childList: true, subtree: true });
  // 先尝试获取切换画质按钮，如果有则直接触发mouseenter事件，没有则通过MutationObserver监听按钮出现后触发mouseenter事件
  player.querySelector('.quality-wrap')?.dispatchEvent(new MouseEvent('mouseenter'));
  sleep(10).then(() => observer.disconnect());
}

/**
 * 双击全屏
 */
export function dbClick() {
  document.body.ondblclick = (event) => {
    event.stopPropagation();
    if (!document.fullscreenElement) {
      document.querySelector('#web-player-controller-wrap-el .right-area :first-child span')?.click();
    } else {
      document.exitFullscreen().then();
    }
  };
}
