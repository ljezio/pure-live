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
import { createApp } from 'vue';
import BulletChat from '@/components/BulletChat.vue';
import FunctionButtons from '@/components/function-buttons/FunctionButtons.vue';

function buildMountedPoint(element) {
  const div = document.createElement('div');
  element.append(div);
  return div;
}

export function mountFunctionButtons() {
  createApp(FunctionButtons).mount(buildMountedPoint(document.body));
}

export function mountBulletChat(topLayerEl, inputMaxlength, sendBulletChatFn) {
  // 为了在全屏下显示，必须挂载在top-layer元素下
  createApp(BulletChat, { inputMaxlength, sendBulletChatFn }).mount(buildMountedPoint(topLayerEl));
}
