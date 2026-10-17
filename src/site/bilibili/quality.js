/* Default quality selection for pure-live (GPL-3.0-or-later). */
import { watchDefaultQuality } from "../../common/quality.js";

export function watchBilibiliQuality({ document, shouldSwitch }) {
  return watchDefaultQuality({
    document,
    shouldSwitch,
    playerSelector: "#live-player",
    menuSelector: ".quality-wrap",
    getOptions(menu) {
      return Array.from(menu.querySelectorAll(".list-it")).filter(
        (item) =>
          !item.closest(".line-wrap") &&
          !item.querySelector(".video-enhance") &&
          !/自动|增强/.test(item.textContent) &&
          /原画|蓝光|超清|高清|流畅|\d+\s*[pPkK]/.test(item.textContent),
      );
    },
  });
}
