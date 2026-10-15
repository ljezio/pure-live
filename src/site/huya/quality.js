/*
 * Huya quality compatibility fix for pure-live (GPL-3.0-or-later).
 */

/** Watch existing and rebuilt menus, including jQuery data assigned after insertion. */
export function watchHuyaQuality({ document, pageWindow, shouldSwitch }) {
  const selector = ".player-videotype-list > li";
  const view = document.defaultView;
  let autoSelected = new WeakMap();
  let pending;
  let stopped = false;

  function scan() {
    if (stopped) return;
    const jquery = pageWindow.jQuery || pageWindow.$;
    if (typeof jquery !== "function") return;

    const candidates = [];
    for (const item of document.querySelectorAll(selector)) {
      const data = jquery(item).data("data");
      // Huya inserts menu nodes before attaching their data and click handlers.
      if (!data || typeof data !== "object") continue;

      // 4 is the free QR-code gate; retain login, paid and trial restrictions.
      if (Number(data.status) === 4) {
        data.status = 0;
        data.iEnable = 1;
        item.querySelectorAll(".common-enjoy-btn").forEach((badge) => badge.remove());
      }

      const bitrate = Number(data.iBitRate);
      if (Number(data.status) !== 0 || Number(data.isAuto) === 1 || bitrate === 99) continue;
      if (!Number.isFinite(bitrate) || bitrate < 0) continue;

      // Original quality uses iBitRate=0, not 20000. Preserve that stream ID.
      const rank =
        Number(data.iSortValue) > 0 ? Number(data.iSortValue) : bitrate === 0 ? Infinity : bitrate;
      candidates.push({ item, data, rank });
    }

    if (!shouldSwitch()) {
      autoSelected = new WeakMap();
      return;
    }

    const best = candidates.reduce(
      (best, candidate) => (!best || candidate.rank > best.rank ? candidate : best),
      null,
    );
    if (!best || autoSelected.get(best.item) === best.data) return;
    if (!best.item.classList.contains("on")) best.item.click();
    // Retry if the handler was not ready; leave later manual selections alone.
    if (best.item.classList.contains("on")) autoSelected.set(best.item, best.data);
  }

  function schedule() {
    if (pending !== undefined || stopped) return;
    pending = view.setTimeout(() => {
      pending = undefined;
      scan();
    }, 0);
  }

  const observer = new view.MutationObserver((mutations) => {
    const relevant = mutations.some(
      (mutation) =>
        (mutation.target.nodeType === 1 && mutation.target.closest(".player-videotype-list")) ||
        Array.from(mutation.addedNodes).some(
          (node) =>
            node.nodeType === 1 &&
            (node.matches(".player-videotype-list, " + selector) || node.querySelector(selector)),
        ),
    );
    if (relevant) schedule();
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  // jQuery .data() updates do not emit DOM mutations. Keep a small fallback poll.
  const retry = view.setInterval(scan, 1000);
  scan();

  return () => {
    stopped = true;
    observer.disconnect();
    view.clearInterval(retry);
    if (pending !== undefined) view.clearTimeout(pending);
  };
}
