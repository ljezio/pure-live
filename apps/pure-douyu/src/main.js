import mountFunctionButton, { scriptSwitch } from '@pure-live/function-button';
import {
  autoFullWindow,
  autoHighestImage,
  avoidSmallWindow,
  dbClick,
} from './core';

window.onload = () => {
  // 非直播页面不执行脚本
  if (!document.querySelector('#js-player-main')) return;
  mountFunctionButton();
  if (scriptSwitch.isOn()) {
    import('./restyle.css');
    avoidSmallWindow();
    autoFullWindow().then(() => autoHighestImage());
    dbClick();
  }
};
