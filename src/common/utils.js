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
import { KEYS } from './constants';

/**
 * 统一封装本地存储实现
 */
export const storage = {
  set: (key, value) => GM_setValue(key, value),
  get: (key, defaultValue) => GM_getValue(key, defaultValue),
};

/**
 * 开关
 */
export const swt = (() => {
  class SwitchFunction {
    #key;
    constructor(key) {
      this.#key = key;
    }
    isOn() {
      return storage.get(this.#key, true);
    }
    switch() {
      if (this.isOn()) {
        storage.set(this.#key, false);
      } else {
        storage.set(this.#key, true);
      }
    }
  }
  return {
    // 是否启用脚本
    script: new SwitchFunction(KEYS.SWITCH_SCRIPT),
    // 是否自动切换最高画质
    autoHighestImage: new SwitchFunction(KEYS.AUTO_HIGHEST_IMAGE),
  };
})();

/**
 * 节流
 */
export function throttle(fn, delay = 100) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime > delay) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}

/**
 * 等待n秒，并增加[0, 500]之间的随机毫秒数
 */
export function sleep(seconds) {
  const random = Math.floor(Math.random() * 500);
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000 + random));
}
