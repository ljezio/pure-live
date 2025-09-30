class SwitchFunction {
    #key

    constructor(key) {
        this.#key = key;
    }

    isOn() {
        return !localStorage.getItem(this.#key);
    }

    turnOn() {
        localStorage.removeItem(this.#key);
    }

    turnOff() {
        localStorage.setItem(this.#key, 'off');
    }
}

/**
 * 是否启用脚本
 */
export const scriptSwitch = new SwitchFunction('pure_douyu_switch');

/**
 * 是否自动切换最高画质
 */
export const autoHighestImageSwitch = new SwitchFunction('pure_douyu_auto_highest');
