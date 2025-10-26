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
 * 自动跳过贴片广告
 */
export function skipAd() {
  // 自动关闭前贴片广告
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.className !== 'pre-ab-new-wrap') continue;
        node.querySelector('.ab-skip')?.click();
      }
    }
  });
  observer.observe(document.querySelector('#videoContainer'), { childList: true });
  sleep(10).then(() => observer.disconnect());
  // 自动关闭中贴片广告
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.className !== 'new-reward-ab-container') continue;
        node.querySelector('.ab-close')?.click();
        node.querySelector('.ab-close-2')?.click();
      }
    }
  }).observe(document.querySelector('#player-wrap'), { childList: true });
}

/**
 * 解锁扫码限制并切换最高画质
 */
export function unlockAndSwitchHighestImage() {
  const liveRoom = document.querySelector('#liveRoomObj');
  if (!liveRoom) return;
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE || node.id !== 'player-ctrl-wrap') continue;
        observer.disconnect();
        // 暂停3秒等待子元素创建
        sleep(3).then(() => {
          const videoTypeList = node.querySelector('.player-videotype-list')?.children;
          if (!videoTypeList) return;
          // 解除扫码解锁清晰度限制
          for (const ul of videoTypeList) {
            // 直接使用huya.com引入的jQuery
            /* global $ */
            $(ul).data('data').status = 0;
          }
          // 切换最高画质
          if (swt.autoHighestImage.isOn()) {
            videoTypeList[0].click();
          }
        });
        return;
      }
    }
  });
  observer.observe(liveRoom, { childList: true, subtree: true });
  sleep(10).then(() => observer.disconnect());
}

/**
 * 双击全屏
 */
export function dbClick() {
  document.body.ondblclick = (event) => {
    event.stopPropagation();
    if (!document.fullscreenElement) {
      document.querySelector('#player-fullscreen-btn')?.click();
    } else {
      document.exitFullscreen().then();
    }
  };
}

/**
 * 获取发送弹幕方法
 */
export function getSendBulletChatFn() {
  let txt, button;
  return (bulletChat) => {
    if (!txt || !button) {
      txt = document.querySelector('#player-full-input-txt');
      button = document.querySelector('#player-full-input-btn');
    }
    if (!txt || !button) return;
    txt.value = bulletChat;
    button.click();
  };
}
