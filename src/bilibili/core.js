import { swt } from '../common/utils';

/**
 * 跳转实际直播页
 */
export function redirectRealLive() {
  const root = document.querySelector('.rendererRoot');
  if (!root) return;
  const urlPrefix = `${window.location.href.split('//')[0]}//live.bilibili.com`;
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        const iframe = node.querySelector('iframe');
        if (!iframe?.src?.startsWith(urlPrefix)) continue;
        window.location.replace(iframe.src);
      }
    }
  });
  observer.observe(root, { childList: true, subtree: true });
  setInterval(() => observer.disconnect(), 1000 * 10);
}

/**
 * 自动切换最高画质
 */
export function autoHighestImage() {
  if (!swt.autoHighestImage.isOn()) return;
  setTimeout(() => {
    const controller = document.querySelector('#web-player-controller-wrap-el');
    if (!controller) return;
    // 先尝试获取切换画质按钮，如果有则直接触发mouseenter事件，没有则通过MutationObserver监听按钮出现后触发mouseenter事件
    controller.querySelector('.quality-wrap')?.dispatchEvent(new MouseEvent('mouseenter'));
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.localName !== 'div') continue;
          if (node.className?.startsWith('quality-wrap')) {
            node.dispatchEvent(new MouseEvent('mouseenter'));
          } else if (
            node.className?.startsWith('list-it') &&
            node.previousElementSibling?.className?.startsWith('line-wrap')
          ) {
            observer.disconnect();
            node.click();
          }
        }
      }
    });
    observer.observe(controller, { childList: true, subtree: true });
  }, 1000);
}

/**
 * 双击全屏
 */
export function dbClick() {
  document.body.ondblclick = (event) => {
    event.stopPropagation();
    if (!document.fullscreenElement) {
      document.querySelector('#web-player-controller-wrap-el .right-area :first-child span')?.click();
    } else {
      document.exitFullscreen().then();
    }
  };
}
