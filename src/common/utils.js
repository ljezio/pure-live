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
 * 等待n秒
 */
export function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
