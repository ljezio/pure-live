import { sleep, swt } from '../common/utils';

/**
 * 自动跳过贴片广告
 */
export function skipAd() {
  // 自动关闭前贴片广告
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.className !== 'pre-ab-new-wrap') continue;
        node.querySelector('.ab-skip')?.click();
      }
    }
  });
  observer.observe(document.querySelector('#videoContainer'), { childList: true });
  sleep(10).then(() => observer.disconnect());
  // 自动关闭中贴片广告
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.className !== 'new-reward-ab-container') continue;
        node.querySelector('.ab-close')?.click();
        node.querySelector('.ab-close-2')?.click();
      }
    }
  }).observe(document.querySelector('#player-wrap'), { childList: true });
}

/**
 * 解锁扫码限制并切换最高画质
 */
export function unlockAndSwitchHighestImage() {
  const liveRoom = document.querySelector('#liveRoomObj');
  if (!liveRoom) return;
  const observer = new MutationObserver(async (mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE || node.id !== 'player-ctrl-wrap') continue;
        observer.disconnect();
        await sleep(3);
        const videoTypeList = node.querySelector('.player-videotype-list')?.children;
        if (!videoTypeList) return;
        // 解除扫码解锁清晰度限制
        for (const ul of videoTypeList) {
          // 直接使用huya.com引入的jQuery
          /* global $ */
          $(ul).data('data').status = 0;
        }
        // 切换最高画质
        if (swt.autoHighestImage.isOn() && videoTypeList[0].className !== 'on') {
          videoTypeList[0].click();
        }
      }
    }
  });
  observer.observe(liveRoom, { childList: true, subtree: true });
  sleep(10).then(() => observer.disconnect());
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
