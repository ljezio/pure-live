import mountElement, { scriptSwitch } from '@pure-live/function-button';
import {autoHighestImage, blockPreAd, dbClick } from './core';

(() => {
  // 非直播页面不执行脚本
  if (!document.querySelector('#J_playerMain')) return;
  mountElement();
  if (scriptSwitch.isOn()) {
    import('./restyle.css');
    blockPreAd();
    autoHighestImage();
    dbClick();
  }
})();
