import './restyle.css'
import {switchKey} from './common';
import functionButtons from './button';

(function () {
    window.onload = () => {
        const buttonGroup = functionButtons();
        if (localStorage.getItem(switchKey)) return;
        avoidSmallWindow();
        autoFullWindow()
            .then(() => autoHighestImage());
        dbClick(buttonGroup);
    };
})();

/**
 * 避免小窗口化
 */
function avoidSmallWindow() {
    const observer = new MutationObserver(() => {
        document.querySelector('#js-player-video-widgets .roomSmallPlayerFloatLayout-closeBtn')?.click();
        observer.disconnect();
    });
    observer.observe(document.querySelector('#js-player-video-case'), {
        attributes: true,
        attributeFilter: ['class', 'style']
    });
}

/**
 * 自动网页全屏
 */
function autoFullWindow() {
    return new Promise((resolve) => {
        const fullWindowInterval = setInterval(() => {
            if (!controlBar.fullWindow()) return;
            setTimeout(() => {
                // 网页全屏可以输入弹幕
                document.querySelector('#js-player-main [class^="toggle__"] button')?.click();
            }, 10);
            clearInterval(fullWindowInterval);
            resolve();
        }, 300);
    })
}

/**
 * 自动切换最高画质
 */
function autoHighestImage() {
    if (localStorage.getItem(autoHighestImageKey)) return;
    let times = 0;
    const highestImageInterval = setInterval(() => {
        if (times++ >= 10) { // 小主播没有画质切换功能
            clearInterval(highestImageInterval);
            return;
        }
        const highestImageButton = document.querySelector('#js-player-controlbar [class^="tipItem-"]:nth-child(2) li:first-child');
        if (!highestImageButton) return;
        setTimeout(() => {
            if (!highestImageButton.className.startsWith('selected-')) {
                highestImageButton.click();
            }
        }, 5000);
        clearInterval(highestImageInterval);
    }, 1000);
}

/**
 * 双击全屏
 */
function dbClick(buttonGroup) {
    document.body.ondblclick = event => {
        event.stopPropagation();
        if (!document.fullscreenElement) {
            controlBar.fullScreen();
        } else {
            document.exitFullscreen().then();
        }
    };
    document.onfullscreenchange = () => {
        if (!document.fullscreenElement) {
            setTimeout(() => controlBar.fullWindow(), 0);
            buttonGroup.style.display = 'block';
        } else {
            buttonGroup.style.display = 'none';
        }
    };
}

/**
 * 获取控制栏按钮
 */
const controlBar = {
    fullWindow() {
        return this._clickControlButton(2)
    },
    fullScreen() {
        return this._clickControlButton(1)
    },
    _clickControlButton(nthLast) {
        const parent = '#js-player-controlbar';
        const nth = `:nth-last-child(${nthLast})`;
        const button = document.querySelector(`${parent} [class^="right-"] > ${nth}, ${parent} [class^="right__"] > ${nth}`);
        if (!button) return false;
        button.click();
        return true;
    }
}