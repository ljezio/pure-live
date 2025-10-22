import { mountVue } from '../common';
import { swt } from '../common/utils';
import { dbClick, skipAd, unlockAndSwitchHighestImage } from './core';

export default function pureHuya() {
  // 非直播页面不执行脚本
  if (!document.querySelector('#J_playerMain')) return;
  mountVue();
  if (swt.script.isOn()) {
    import('./restyle.css');
    skipAd();
    unlockAndSwitchHighestImage();
    dbClick();
  }
}
