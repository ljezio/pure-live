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
import { dbClick, getSendBulletChatFn, skipAd, unlockAndSwitchHighestImage } from '@/huya/core';

export default function pureHuya() {
  // 非直播页面不执行脚本
  const video = document.querySelector('#videoContainer');
  if (!video) return;
  mountVue(video, INPUT_MAX.HUYA, getSendBulletChatFn());
  if (swt.script.isOn()) {
    import('./restyle.css');
    skipAd();
    unlockAndSwitchHighestImage();
    dbClick();
  }
}
