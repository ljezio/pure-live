import pureBilibili from './bilibili';
import pureDouyu from './douyu';
import pureHuya from './huya';

(() => {
  const url = window.location.href;
  const protocol = url.split('//')[0];
  if (url.startsWith(`${protocol}//www.douyu.com/`)) {
    pureDouyu();
  } else if (url.startsWith(`${protocol}//www.huya.com/`)) {
    pureHuya();
  } else if (url.startsWith(`${protocol}//live.bilibili.com/`)) {
    pureBilibili();
  }
})();
