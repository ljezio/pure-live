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
import { mountBulletChat, mountFunctionButtons } from '@/components';
import { autoHighestImage, dbClick, getSendBulletChatFn, redirectRealLive } from './core';

export default function pureBilibili() {
  // 非直播页面不执行脚本
  const video = document.querySelector('#live-player');
  if (!video && !document.querySelector('#app .rendererRoot')) return;
  mountFunctionButtons();
  if (swt.script.isOn()) {
    redirectRealLive();
    import('./restyle.css');
    autoHighestImage();
    dbClick();
    mountBulletChat(video, INPUT_MAX.BILIBILI, getSendBulletChatFn());
  }
}
