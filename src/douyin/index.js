import { mountVue } from '../common';
import { swt } from '../common/utils';
import { autoHighestImage, dbClick } from './core';

export default function pureDouyin() {
  // 非直播页面不执行脚本
  if (!document.querySelector('#PlayerLayout')) return;
  mountVue();
  if (swt.script.isOn()) {
    import('./restyle.css');
    autoHighestImage();
    dbClick();
  }
}
