import pureBilibili from './bilibili';
import pureDouyin from './douyin';
import pureDouyu from './douyu';
import pureHuya from './huya';

const platformMap = new Map([
  ['www.douyu.com', pureDouyu],
  ['www.huya.com', pureHuya],
  ['live.bilibili.com', pureBilibili],
  ['live.douyin.com', pureDouyin],
]);

(() => {
  const hostname = new URL(window.location.href).hostname;
  platformMap.get(hostname)?.();
})();
