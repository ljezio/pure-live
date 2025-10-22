import { mountVue } from '../common';
import { swt } from '../common/utils';
import { autoHighestImage, dbClick, redirectRealLive } from './core';

export default function pureBilibili() {
  // 非直播页面不执行脚本
  if (!document.querySelector('#live-player, #app .rendererRoot')) return;
  mountVue();
  if (swt.script.isOn()) {
    redirectRealLive();
    import('./restyle.css');
    autoHighestImage();
    dbClick();
  }
}
