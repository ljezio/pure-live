import mountElement, { scriptSwitch } from '@pure-live/function-button';
import {
  autoFullWindow,
  autoHighestImage,
  avoidSmallWindow,
  dbClick,
} from './core';

(() => {
  // 非直播页面不执行脚本
  if (!document.querySelector('#js-player-main')) return;
  mountElement();
  if (scriptSwitch.isOn()) {
    import('./restyle.css');
    avoidSmallWindow();
    autoFullWindow().then(() => autoHighestImage());
    dbClick();
  }
})();
