/*
 * Default quality selection for pure-live (GPL-3.0-or-later).
 * Copyright (C) 2025-present ljezio and contributors
 */

/** Select once when a lazy quality menu is ready, then leave manual choices alone. */
export function watchDefaultQuality({
  document,
  shouldSwitch,
  playerSelector,
  menuSelector,
  getOptions,
}) {
  const view = document.defaultView;
  let stopped = false;
  let pending;
  let openedMenu;
  let attempted;
  let retry;

  function stop() {
    stopped = true;
    observer.disconnect();
    view.clearInterval(retry);
    if (pending !== undefined) view.clearTimeout(pending);
    view.removeEventListener("pagehide", stop);
  }

  function scan(forceRetry = false) {
    if (stopped) return;
    if (!shouldSwitch()) return stop();
    const player = document.querySelector(playerSelector);
    if (!player) return;

    let menu = player.querySelector(menuSelector);
    if (!menu || menu !== openedMenu || forceRetry) {
      // Both sites create parts of the controls only after pointer movement.
      player.dispatchEvent(new view.MouseEvent("mousemove", { bubbles: true }));
      menu = player.querySelector(menuSelector);
      if (!menu) return;
      openedMenu = menu;
      // React delegates mouseover; Svelte binds mouseenter directly.
      menu.dispatchEvent(new view.MouseEvent("mouseover", { bubbles: true }));
      menu.dispatchEvent(new view.MouseEvent("mouseenter"));
    }

    // The native menus list quality from highest to lowest. Keep their stream IDs.
    const best = Array.from(getOptions(menu)).find(
      (item) =>
        item.textContent.trim() &&
        !item.matches('[disabled], [aria-disabled="true"]') &&
        !Array.from(item.classList).some((name) => /^(disabled|locked)(-|$)/.test(name)),
    );
    if (!best) return;
    const isSelected = () =>
      best.getAttribute("aria-selected") === "true" ||
      Array.from(best.classList).some((name) => /^selected(-|$)/.test(name));

    if (!isSelected() && (attempted !== best || forceRetry)) {
      attempted = best;
      best.click();
    }
    // Event handlers and selected classes can appear after the menu's DOM nodes.
    if (!isSelected()) return;
    stop();
    menu.dispatchEvent(new view.MouseEvent("mouseout", { bubbles: true }));
    menu.dispatchEvent(new view.MouseEvent("mouseleave"));
  }

  const observer = new view.MutationObserver((mutations) => {
    const relevant = mutations.some(
      (mutation) =>
        mutation.target.nodeType === 1 &&
        (mutation.target.closest(menuSelector) ||
          Array.from(mutation.addedNodes).some(
            (node) =>
              node.nodeType === 1 &&
              (node.matches(`${playerSelector}, ${menuSelector}`) ||
                node.querySelector(menuSelector)),
          )),
    );
    if (!relevant || stopped || pending !== undefined) return;
    pending = view.setTimeout(() => {
      pending = undefined;
      scan();
    }, 0);
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "aria-selected", "aria-disabled", "disabled"],
  });
  // No startup deadline: slow players and handlers attached later must also work.
  retry = view.setInterval(() => scan(true), 1000);
  view.addEventListener("pagehide", stop);
  scan();
  return stop;
}
