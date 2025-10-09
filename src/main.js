import { createApp } from 'vue';
import { scriptSwitch } from './common';
import {
  autoFullWindow,
  autoHighestImage,
  avoidSmallWindow,
  dbClick,
} from './core';
import App from './html/App.vue';

window.onload = () => {
  // 非直播页面不执行脚本
  if (!document.querySelector('#js-player-main')) return;

  createApp(App).mount(
    (() => {
      const div = document.createElement('div');
      document.body.append(div);
      return div;
    })(),
  );

  if (scriptSwitch.isOn()) {
    import('./restyle.css');
    avoidSmallWindow();
    autoFullWindow().then(() => autoHighestImage());
    dbClick();
  }
};
