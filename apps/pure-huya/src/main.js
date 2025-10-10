import mountFunctionButton, { scriptSwitch } from '@pure-live/function-button';
import { autoHighestImage, dbClick } from './core';

(() => {
  // 非直播页面不执行脚本
  if (!document.querySelector('#J_playerMain')) return;
  mountFunctionButton();
  if (scriptSwitch.isOn()) {
    import('./restyle.css');
    autoHighestImage();
    dbClick();
  }
})();
