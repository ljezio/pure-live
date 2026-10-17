/* Default quality selection for pure-live (GPL-3.0-or-later). */
import { watchDefaultQuality } from "../../common/quality.js";

export function watchDouyuQuality({ document, shouldSwitch }) {
  return watchDefaultQuality({
    document,
    shouldSwitch,
    playerSelector: "#js-player-main",
    menuSelector: '[class^="rate-"]',
    getOptions(menu) {
      // Identify the quality group by its label; route and enhancement groups move.
      const group = Array.from(menu.querySelectorAll('[class^="tipItem-"]')).find((item) =>
        item.querySelector("input")?.value.trim().startsWith("画质"),
      );
      return group?.querySelectorAll("ul > li") || [];
    },
  });
}
