import { mountVue } from '../common';
import { scriptSwitch } from '../common/utils';
import { dbClick, skipAd, unlockAndSwitchHighestImage } from './core';

export default function pureHuya() {
  // 非直播页面不执行脚本
  if (!document.querySelector('#J_playerMain')) return;
  mountVue();
  if (scriptSwitch.isOn()) {
    import('./restyle.css');
    skipAd();
    unlockAndSwitchHighestImage();
    dbClick();
  }
}
