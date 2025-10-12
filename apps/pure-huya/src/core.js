import { autoHighestImageSwitch } from '@pure-live/function-button';

/**
 * 自动切换最高画质
 */
export function autoHighestImage() {
  if (!autoHighestImageSwitch.isOn()) return;
  let times = 0;
  const highestImageInterval = setInterval(() => {
    if (times++ >= 10) {
      clearInterval(highestImageInterval);
      return;
    }
    if (doAutoHighestImage()) {
      clearInterval(highestImageInterval);
    }
  }, 1000);
}

function doAutoHighestImage() {
  const videoType = document.querySelector('#player-ctrl-wrap .player-videotype-list');
  if (!videoType) return false;
  for (const li of videoType.children) {
    if (li.children.length >= 2) {
      continue;
    }
    if (li.className === 'on') {
      break;
    }
    li.click();
    break;
  }
  return true;
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
