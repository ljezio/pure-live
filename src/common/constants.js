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

/**
 * 本地存储数据key
 */
export const STORAGE_KEY = Object.freeze({
  // 是否启用脚本开关
  SWITCH_SCRIPT: 'switch_script',
  // 是否自动切换最高画质开关
  AUTO_HIGHEST_IMAGE: 'auto_highest_image',
  // 可拖动组件初始坐标
  DRAGGABLE_AXIS: 'draggable_axis',
});

/**
 * 依赖注入key
 */
export const INJECTION_KEY = Object.freeze({
  // 弹幕输入框挂载的topLayer元素
  TOP_LAYER_EL: 'topLayerEl',
  // 弹幕输入框可输入弹幕最大长度
  INPUT_MAX_LENGTH: 'inputMaxlength',
  // 发送弹幕回调方法
  SEND_BULLET_CHAT_FN: 'sendBulletChatFn',
});

/**
 * 各平台弹幕最大长度
 */
export const INPUT_MAX = Object.freeze({
  DOUYU: 70,
  HUYA: 30,
  BILIBILI: 40,
  DOUYIN: 50,
});
