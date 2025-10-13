import { autoHighestImageSwitch } from '@pure-live/function-button';

/**
 * 自动跳过片头广告
 */
export function skipPreAd() {
  const loading = document.querySelector('#player-loading');
  if (!loading) return;
  const interval = setInterval(() => {
    if (loading.style.display !== 'none') {
      return;
    }
    document.querySelector('.ab-skip-group .ab-skip')?.click();
    clearInterval(interval);
  }, 500);
}

/**
 * 解锁扫码限制并切换最高画质
 */
export function unlockAndSwitchHighestImage() {
  let times = 0;
  const highestImageInterval = setInterval(() => {
    if (times++ >= 10) {
      clearInterval(highestImageInterval);
      return;
    }
    const videoTypeList = document.querySelector('#player-ctrl-wrap .player-videotype-list')?.children;
    if (!videoTypeList) return;
    // 解除扫码解锁清晰度限制
    for (const ul of videoTypeList) {
      /* global $ */
      $(ul).data('data').status = 0; // 直接使用huya.com引入的jQuery
    }
    // 切换最高画质
    if (autoHighestImageSwitch.isOn() && videoTypeList[0].className !== 'on') {
      videoTypeList[0].click();
    }
    clearInterval(highestImageInterval);
  }, 1000);
}

/**
 * 双击全屏
 */
export function dbClick() {
  document.body.ondblclick = (event) => {
    event.stopPropagation();
    if (!document.fullscreenElement) {
      document.querySelector('#player-fullscreen-btn')?.click();
    } else {
      document.exitFullscreen().then();
    }
  };
}
