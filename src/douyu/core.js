import { sleep, swt } from '../common/utils';

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
  if (!swt.autoHighestImage.isOn()) return;
  const controlBar = document.querySelector('#js-player-controlbar');
  if (!controlBar) return;
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE || !node.className?.startsWith('ControlBar-')) continue;
        observer.disconnect();
        node.querySelector('[class^="tipItem-"]:nth-child(2) li:first-child')?.click();
        return;
      }
    }
  });
  observer.observe(controlBar, { childList: true, subtree: true });
  sleep(10).then(() => observer.disconnect());
}

/**
 * 双击全屏
 */
export function dbClick() {
  const playerMain = document.querySelector('#js-player-main');
  const keyboardEvent = new KeyboardEvent('keydown', {
    code: 'KeyH',
    bubbles: true,
  });
  document.body.ondblclick = (event) => {
    event.stopPropagation();
    if (!document.fullscreenElement) {
      playerMain?.dispatchEvent(keyboardEvent);
    } else {
      document.exitFullscreen().then();
    }
  };
}
