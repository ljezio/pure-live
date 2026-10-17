import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { setTimeout as wait } from "node:timers/promises";
import { JSDOM } from "jsdom";

const sources = ["common/quality", "site/douyu/quality", "site/bilibili/quality"]
  .map((path) =>
    readFileSync(new URL(`../src/${path}.js`, import.meta.url), "utf8")
      .replace(/^import .+;\r?\n/gm, "")
      .replace(/^export /gm, ""),
  )
  .join("\n");
const watchers = runInNewContext(sources + "\n({ watchDouyuQuality, watchBilibiliQuality });");

// Reduced DOM fixtures captured from the live Douyu and Bilibili menus.
const platforms = [
  {
    name: "Douyu",
    player: "js-player-main",
    watch: watchers.watchDouyuQuality,
    markup: `<div id="js-player-controlbar"><div class="ControlBar-49a2e6">
      <div class="rate-ec9440"><div class="tip-cd016b">
        <div class="tipItem-e17801 enhance-d36d10">画质增强</div>
        <div class="tipItem-e17801"><input value="画质 "><ul></ul></div>
        <div class="tipItem-e17801"><input value="线路 "><ul><li>线路1</li></ul></div>
      </div><div class="textLabel-429176">超清</div></div>
    </div></div>`,
    menu: '[class^="rate-"]',
    list: '[class^="tipItem-"] ul',
    high: "原画1080P60",
    low: "超清",
    itemTag: "li",
    selected: "selected-ab049e",
  },
  {
    name: "Bilibili",
    player: "live-player",
    watch: watchers.watchBilibiliQuality,
    markup: `<div id="web-player-controller-wrap-el"><div class="quality-wrap svelte-770q4t">
      <div class="panel svelte-770q4t"><div class="line-wrap">主线</div><div>新增菜单分隔</div></div>
      <div class="selected-qn">720P 超清</div>
    </div></div>`,
    menu: ".quality-wrap",
    list: ".panel",
    high: "1080P 原画（高帧率）",
    low: "720P 超清",
    itemTag: "div",
    selected: "selected",
  },
];

function fixture(t, platform, { attached = true, lazy = false, bind = true, async = false } = {}) {
  const dom = new JSDOM(`<div id="${platform.player}"></div>`, { runScripts: "outside-only" });
  const { window } = dom;
  const { document } = window;
  const player = document.getElementById(platform.player);
  const intervals = new Map();
  let nextInterval = 0;
  window.setInterval = (fn) => {
    intervals.set(++nextInterval, fn);
    return nextInterval;
  };
  window.clearInterval = (id) => intervals.delete(id);
  let enabled = true;
  let stop;
  let bound = bind;
  const requests = [];
  let opens = 0;

  function attach() {
    player.innerHTML = platform.markup;
    const menu = player.querySelector(platform.menu);
    const list = menu.querySelector(platform.list);
    const populate = () => {
      if (list.querySelector("[data-quality]")) return;
      for (const label of [platform.high, platform.low]) {
        const item = document.createElement(platform.itemTag);
        item.dataset.quality = label;
        item.textContent = label;
        if (platform.name === "Bilibili") item.classList.add("list-it", "svelte-770q4t");
        if (label === platform.low) item.classList.add(platform.selected);
        item.addEventListener("click", () => {
          if (!bound) return;
          requests.push(label);
          const select = () => {
            for (const other of list.querySelectorAll("[data-quality]")) {
              other.classList.toggle(platform.selected, other === item);
            }
          };
          if (async) window.setTimeout(select, 5);
          else select();
        });
        list.append(item);
      }
      if (platform.name === "Bilibili") {
        list.insertAdjacentHTML(
          "beforeend",
          '<div class="list-it">自动</div><div class="list-it"><div class="video-enhance">画质增强</div></div>',
        );
      }
    };
    menu.addEventListener("mouseenter", () => {
      opens++;
      if (lazy) window.setTimeout(populate, 5);
    });
    if (!lazy) populate();
    return menu;
  }
  if (attached) attach();
  t.after(() => {
    stop?.();
    window.close();
  });
  return {
    document,
    player,
    requests,
    intervals,
    attach,
    get opens() {
      return opens;
    },
    get high() {
      return player.querySelector('[data-quality="' + platform.high + '"]');
    },
    get low() {
      return player.querySelector('[data-quality="' + platform.low + '"]');
    },
    enable(value) {
      enabled = value;
    },
    bind() {
      bound = true;
    },
    start() {
      stop = platform.watch({ document, shouldSwitch: () => enabled });
    },
    async tick(count = 1) {
      for (let i = 0; i < count; i++) {
        for (const fn of intervals.values()) fn();
        await wait(15);
      }
    },
  };
}

for (const platform of platforms) {
  test(`${platform.name}: selects the highest quality from an already mounted menu`, (t) => {
    const f = fixture(t, platform);
    f.start();
    assert.deepEqual(f.requests, [platform.high]);
    assert.ok(f.high.classList.contains(platform.selected));
    assert.equal(f.intervals.size, 0);
  });

  test(`${platform.name}: opens lazy menus after controls appear later than ten retries`, async (t) => {
    const f = fixture(t, platform, { attached: false, lazy: true });
    f.start();
    await f.tick(12);
    f.attach();
    await wait(50);
    assert.ok(f.opens > 0);
    assert.deepEqual(f.requests, [platform.high]);
    assert.equal(f.intervals.size, 0);
  });

  test(`${platform.name}: retries when handlers attach after menu nodes`, async (t) => {
    const f = fixture(t, platform, { bind: false, async: true });
    f.start();
    assert.deepEqual(f.requests, []);
    f.bind();
    await f.tick();
    await wait(40);
    assert.deepEqual(f.requests, [platform.high]);
    assert.equal(f.intervals.size, 0);
  });

  test(`${platform.name}: keeps later manual selections even if the menu is rebuilt`, async (t) => {
    const f = fixture(t, platform);
    f.start();
    f.low.click();
    f.attach();
    await f.tick();
    assert.ok(f.low.classList.contains(platform.selected));
    assert.deepEqual(f.requests, [platform.high, platform.low]);
  });

  test(`${platform.name}: honours a disabled automatic quality preference`, (t) => {
    const f = fixture(t, platform);
    f.enable(false);
    f.start();
    assert.deepEqual(f.requests, []);
    assert.equal(f.opens, 0);
    assert.equal(f.intervals.size, 0);
  });

  test(`${platform.name}: stops if automatic switching is disabled while waiting`, async (t) => {
    const f = fixture(t, platform, { attached: false });
    f.start();
    f.enable(false);
    f.attach();
    await wait(30);
    assert.deepEqual(f.requests, []);
    assert.equal(f.intervals.size, 0);
  });

  test(`${platform.name}: skips explicitly disabled options and accepts the best usable quality`, (t) => {
    const f = fixture(t, platform);
    f.high.setAttribute("aria-disabled", "true");
    f.start();
    assert.deepEqual(f.requests, []);
    assert.ok(f.low.classList.contains(platform.selected));
    assert.equal(f.intervals.size, 0);
  });
}
