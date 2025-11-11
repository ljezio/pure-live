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
import { STORAGE_KEY } from '@/common/constants';
import { GM_getValue, GM_setValue } from '$';

/**
 * 统一封装本地存储实现
 */
export const storage = (() => {
  const cache = new Map();
  return {
    set: (key, value) => {
      cache.set(key, value);
      GM_setValue(key, value);
    },
    get: (key, defaultValue) => {
      const cacheVal = cache.get(key);
      if (cacheVal !== undefined && cacheVal !== null) {
        return cacheVal;
      }
      const storageValue = GM_getValue(key);
      if (storageValue !== undefined && storageValue !== null) {
        cache.set(key, storageValue);
        return storageValue;
      } else {
        return defaultValue;
      }
    },
  };
})();

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
    isOff() {
      return !this.isOn();
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
    script: new SwitchFunction(STORAGE_KEY.SWITCH_SCRIPT),
    // 是否显示弹幕侧边栏
    showSidebar: new SwitchFunction(STORAGE_KEY.SHOW_SIDEBAR),
    // 是否自动切换最高画质
    autoHighestImage: new SwitchFunction(STORAGE_KEY.AUTO_HIGHEST_IMAGE),
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
 * 延迟（n秒 + [0, jitter]毫秒）执行
 */
export function delayJitter(seconds, jitter = 500 * seconds) {
  const random = Math.floor(Math.random() * jitter);
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000 + random));
}
