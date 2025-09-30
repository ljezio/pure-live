import {scriptSwitch, autoHighestImageSwitch} from '../common';
import switchSvg from '../assets/switch.svg?raw';
import autoHighestImageSvg from '../assets/autoHightImage.svg?raw';

export default function functionButtons() {
    const buttonGroup = document.createElement('div');
    buttonGroup.style.cssText = 'z-index: 999; position: fixed; top: 0; right: 0;';
    document.body.appendChild(buttonGroup);
    // 开关脚本按钮
    const switchButton = document.createElement('button');
    switchButton.title = scriptSwitch.isOn() ? '关闭脚本' : '启用脚本';
    switchButton.innerHTML = switchSvg;
    switchButton.onclick = () => {
        if (scriptSwitch.isOn()) {
            scriptSwitch.turnOff();
        } else {
            scriptSwitch.turnOn();
        }
        location.reload();
    };
    buttonGroup.appendChild(switchButton);
    if (scriptSwitch.isOn()) {
        // 开关自动切换最高画质按钮
        const autoHighestImageButton = document.createElement('button');
        autoHighestImageButton.title = autoHighestImageSwitch.isOn() ? '关闭自动切换最高画质' : '开启自动切换最高画质';
        autoHighestImageButton.innerHTML = autoHighestImageSvg;
        autoHighestImageButton.onclick = () => {
            if (autoHighestImageSwitch.isOn()) {
                autoHighestImageButton.title = '开启自动切换最高画质';
                autoHighestImageSwitch.turnOff();
            } else {
                autoHighestImageButton.title = '关闭自动切换最高画质';
                autoHighestImageSwitch.turnOn();
            }
        };
        buttonGroup.appendChild(autoHighestImageButton);
    }
    // 按钮半透明样式与鼠标悬停透明度变化
    [...buttonGroup.children].forEach(button => {
        button.style.cssText = 'display: block; cursor: pointer; opacity: 0.5; transition: opacity 0.3s ease;';
        button.onmouseover = () => button.style.opacity = '1';
        button.onmouseout = () => button.style.opacity = '0.5';
    })
    return buttonGroup;
}