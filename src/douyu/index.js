import { mountVue } from '../common';
import { scriptSwitch } from '../common/utils';
import { autoHighestImage, avoidSmallWindow, dbClick } from './core';

export default function pureDouyu() {
  // 非直播页面不执行脚本
  if (!document.querySelector('#js-player-main')) return;
  mountVue();
  if (scriptSwitch.isOn()) {
    import('./restyle.css');
    avoidSmallWindow();
    autoHighestImage();
    dbClick();
  }
}
