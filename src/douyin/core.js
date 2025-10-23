import { sleep, swt } from '../common/utils';

/**
 * 自动切换最高画质
 */
export function autoHighestImage() {
  if (!swt.autoHighestImage.isOn()) return;
  const control = document.querySelector('.douyin-player-controls-right');
  if (!control) return;
  const observer = new MutationObserver(async (mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.localName !== 'div' || !node.className.includes('QualitySwitchNewPlugin')) continue;
        observer.disconnect();
        node.querySelector('[data-e2e="quality-selector"] > :nth-child(2)')?.click();
        return;
      }
    }
  });
  observer.observe(control, { childList: true, subtree: true });
  sleep(10).then(() => observer.disconnect());
}

/**
 * 双击全屏
 */
export function dbClick() {
  const keyboardEvent = new KeyboardEvent('keydown', {
    code: 'KeyH',
  });
  document.body.ondblclick = (event) => {
    event.stopPropagation();
    if (!document.fullscreenElement) {
      document.dispatchEvent(keyboardEvent);
    } else {
      document.exitFullscreen().then();
    }
  };
}
