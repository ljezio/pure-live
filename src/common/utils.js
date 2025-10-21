class SwitchFunction {
  #key;
  constructor(key) {
    this.#key = key;
  }
  isOn() {
    return GM_getValue(this.#key, true);
  }
  switch() {
    if (this.isOn()) {
      GM_setValue(this.#key, false);
    } else {
      GM_setValue(this.#key, true);
    }
  }
}

/**
 * 是否启用脚本
 */
export const scriptSwitch = new SwitchFunction('pure_live_switch_script');

/**
 * 是否自动切换最高画质
 */
export const autoHighestImageSwitch = new SwitchFunction('pure_live_auto_highest');

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
