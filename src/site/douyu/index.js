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
import { INPUT_MAX } from '@/common/constants';
import { swt } from '@/common/utils';
import mountVue from '@/components';
import { autoHighestImage, avoidSmallWindow, dbClick, sendBulletChatFn } from '@/site/douyu/core';

export default function pureDouyu() {
  // 非直播页面不执行脚本
  const player = document.querySelector('#js-player-main');
  if (!player) return;
  mountVue(document.body, INPUT_MAX.DOUYU, sendBulletChatFn);
  if (swt.script.isOn()) {
    // 跳转beta页面（2025-11-20 00:00:00之前）
    const location = window.location;
    if (!location.pathname.startsWith('/beta/') && Date.now() <= 1763568000000) {
      window.location.replace(`${location.origin}/beta${location.pathname}${location.search}`);
    }
    import('@/site/douyu/restyle.css');
    avoidSmallWindow();
    autoHighestImage();
    dbClick(player);
  }
}
