class SwitchFunction {
  #key;

  constructor(key) {
    this.#key = key;
  }

  isOn() {
    return !localStorage.getItem(this.#key);
  }

  switch() {
    if (this.isOn()) {
      localStorage.setItem(this.#key, 'off');
    } else {
      localStorage.removeItem(this.#key);
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
