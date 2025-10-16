import { autoHighestImageSwitch } from '@pure-live/function-button';

/**
 * 避免小窗口化
 */
export function avoidSmallWindow() {
  const observer = new MutationObserver(() => {
    document.querySelector('#js-player-video-widgets .roomSmallPlayerFloatLayout-closeBtn')?.click();
    observer.disconnect();
  });
  observer.observe(document.querySelector('#js-player-video-case'), {
    attributes: true,
    attributeFilter: ['class', 'style'],
  });
}

/**
 * 自动切换最高画质
 */
export function autoHighestImage() {
  if (!autoHighestImageSwitch.isOn()) return;
  let times = 0;
  const interval = setInterval(() => {
    if (times++ >= 10) {
      // 小主播没有画质切换功能
      clearInterval(interval);
      return;
    }
    const highestImageButton = document.querySelector(
      '#js-player-controlbar [class^="tipItem-"]:nth-child(2) li:first-child',
    );
    if (!highestImageButton) return;
    setTimeout(() => {
      if (!highestImageButton.className.startsWith('selected-')) {
        highestImageButton.click();
      }
    }, 3000);
    clearInterval(interval);
  }, 1000);
}

/**
 * 双击全屏
 */
export function dbClick() {
  document.body.ondblclick = (event) => {
    event.stopPropagation();
    if (!document.fullscreenElement) {
      document
        .querySelector(
          '#js-player-controlbar [class^="right-"] > :last-child, #js-player-controlbar [class^="right__"] > :last-child',
        )
        ?.click();
    } else {
      document.exitFullscreen().then();
    }
  };
}
