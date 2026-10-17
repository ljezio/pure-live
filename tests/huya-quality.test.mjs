import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { setTimeout as wait } from "node:timers/promises";
import { runInNewContext } from "node:vm";
import { JSDOM, VirtualConsole } from "jsdom";
import { jQueryFactory } from "jquery/factory";

const source = readFileSync(new URL("../src/site/huya/quality.js", import.meta.url), "utf8");
const { watchHuyaQuality } = await import(
  "data:text/javascript;base64," + Buffer.from(source).toString("base64")
);

const coreSource = readFileSync(new URL("../src/site/huya/core.js", import.meta.url), "utf8");
const entrySource = readFileSync(new URL("../src/site/huya/index.js", import.meta.url), "utf8");

function loadCore(document, window) {
  return runInNewContext(
    coreSource.replace(/^import .+;\r?\n/gm, "").replace(/^export /gm, "") +
      "\n({ skipAd, unlockAndSwitchHighestImage, dbClick, sendBulletChatFn });",
    {
      document,
      MutationObserver: window.MutationObserver,
      delayJitter: () => new Promise(() => {}),
      swt: { autoHighestImage: { isOn: () => true } },
      unsafeWindow: window,
      watchHuyaQuality,
    },
  );
}

function fixture(t, { accelerated = false } = {}) {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("jsdomError", (error) => errors.push(error.message));
  const dom = new JSDOM('<div id="liveRoomObj"><div id="videoContainer"></div></div>', {
    runScripts: "outside-only",
    virtualConsole,
  });
  const { window } = dom;
  const jquery = jQueryFactory(window);
  window.$ = window.jQuery = jquery;
  if (accelerated) {
    const interval = window.setInterval.bind(window);
    window.setInterval = (fn) => interval(fn, 15);
  }
  const document = window.document;
  const requests = [];
  let enabled = true;
  let stop;
  t.after(() => {
    stop?.();
    window.close();
    assert.deepEqual(errors, []);
  });

  function menu({
    attach = true,
    bind = true,
    data = true,
    parent = document.querySelector("#videoContainer"),
  } = {}) {
    const ul = document.createElement("ul");
    ul.className = "player-videotype-list";
    ul.innerHTML =
      '<li><span>蓝光20M</span><div class="common-enjoy-btn">扫码即享</div></li><li class="on"><span>蓝光8M</span></li>';
    const [high, low] = ul.children;
    const highData = {
      status: 4,
      isAuto: 0,
      sDisplayName: "蓝光20M",
      iBitRate: 0,
      iHEVCBitRate: 0,
      iSortValue: 20000,
      iEnable: 0,
      iEnableMethod: 4,
    };
    const lowData = {
      status: 0,
      isAuto: 0,
      sDisplayName: "蓝光8M",
      iBitRate: 8000,
      iSortValue: 8000,
      iEnable: 1,
      iEnableMethod: 0,
    };
    const bindHandlers = () => {
      for (const item of ul.children) {
        item.addEventListener("click", () => {
          const d = jquery(item).data("data");
          if (!d || d.status !== 0) return;
          for (const sibling of ul.children) sibling.classList.toggle("on", sibling === item);
          requests.push(d.iBitRate);
        });
      }
    };
    const attachData = () => {
      jquery(high).data("data", highData);
      jquery(low).data("data", lowData);
    };
    if (data) attachData();
    if (bind) bindHandlers();
    if (attach) parent.append(ul);
    return { ul, high, low, highData, lowData, attachData, bindHandlers };
  }
  return {
    window,
    document,
    requests,
    menu,
    enable(value) {
      enabled = value;
    },
    start() {
      stop = watchHuyaQuality({
        document,
        pageWindow: window,
        shouldSwitch: () => enabled,
      });
      return stop;
    },
  };
}

test("existing menu unlocks QR quality and requests original stream ID 0", (t) => {
  const f = fixture(t);
  const m = f.menu();
  f.start();
  assert.equal(m.highData.status, 0);
  assert.equal(m.highData.iEnable, 1);
  assert.equal(m.highData.iBitRate, 0);
  assert.equal(m.highData.iHEVCBitRate, 0);
  assert.equal(m.highData.iEnableMethod, 4);
  assert.ok(m.high.classList.contains("on"));
  assert.equal(m.high.querySelector(".common-enjoy-btn"), null);
  assert.deepEqual(f.requests, [0]);
});

test("page jQuery is used independently of the userscript global", (t) => {
  const f = fixture(t);
  f.menu();
  const pageWindow = { jQuery: f.window.jQuery };
  delete f.window.$;
  delete f.window.jQuery;
  const stop = watchHuyaQuality({
    document: f.document,
    pageWindow,
    shouldSwitch: () => true,
  });
  t.after(stop);
  assert.deepEqual(f.requests, [0]);
});

test("an initially selected highest quality does not undo later manual selections", async (t) => {
  const f = fixture(t, { accelerated: true });
  const m = f.menu();
  m.low.classList.remove("on");
  m.high.classList.add("on");
  f.start();
  assert.deepEqual(f.requests, []);
  m.low.click();
  await wait(50);
  assert.deepEqual(f.requests, [8000]);
  assert.ok(m.low.classList.contains("on"));
});

test("a complete menu inserted inside a new wrapper is detected", async (t) => {
  const f = fixture(t);
  f.start();
  const wrapper = f.document.createElement("div");
  const m = f.menu({ parent: wrapper });
  f.document.querySelector("#videoContainer").append(wrapper);
  await wait(35);
  assert.equal(m.highData.status, 0);
  assert.deepEqual(f.requests, [0]);
});

test("jQuery data and click handlers attached later without DOM changes are retried", async (t) => {
  const f = fixture(t, { accelerated: true });
  const m = f.menu({ data: false, bind: false });
  f.start();
  await wait(35);
  m.attachData();
  await wait(35);
  assert.equal(m.highData.status, 0);
  assert.deepEqual(f.requests, []);
  m.bindHandlers();
  await wait(45);
  assert.deepEqual(f.requests, [0]);
});

test("a rebuilt player menu is unlocked again", async (t) => {
  const f = fixture(t);
  const first = f.menu();
  f.start();
  first.ul.remove();
  const second = f.menu();
  await wait(35);
  assert.equal(second.highData.status, 0);
  assert.deepEqual(f.requests, [0, 0]);
});

test("disabled automatic switching still unlocks QR quality", async (t) => {
  const f = fixture(t, { accelerated: true });
  const m = f.menu();
  f.enable(false);
  f.start();
  assert.equal(m.highData.status, 0);
  assert.deepEqual(f.requests, []);
  f.enable(true);
  await wait(40);
  assert.deepEqual(f.requests, [0]);
});

test("polling preserves a later manual quality selection", async (t) => {
  const f = fixture(t, { accelerated: true });
  const m = f.menu();
  f.start();
  m.low.click();
  await wait(70);
  assert.ok(m.low.classList.contains("on"));
  assert.deepEqual(f.requests, [0, 8000]);
});

test("login, paid and trial statuses are retained; menu order does not decide quality", (t) => {
  const f = fixture(t);
  const m = f.menu();
  m.ul.prepend(m.low);
  const restricted = [-1, 2, 5].map((status) => {
    const item = f.document.createElement("li");
    const data = {
      status,
      iEnable: 0,
      iEnableMethod: status,
      iBitRate: 40000,
      iSortValue: 40000,
    };
    f.window.$(item).data("data", data);
    m.ul.prepend(item);
    return data;
  });
  const auto = f.document.createElement("li");
  f.window.$(auto).data("data", { status: 0, isAuto: 1, iBitRate: 99, iSortValue: 99999 });
  m.ul.prepend(auto);
  f.start();
  assert.deepEqual(
    restricted.map((d) => d.status),
    [-1, 2, 5],
  );
  assert.deepEqual(f.requests, [0]);
});

test("jQuery can appear after the watcher and cleanup cancels further work", async (t) => {
  const f = fixture(t, { accelerated: true });
  const m = f.menu();
  const jq = f.window.$;
  delete f.window.$;
  delete f.window.jQuery;
  const stop = f.start();
  assert.equal(m.highData.status, 4);
  f.window.jQuery = jq;
  await wait(40);
  assert.deepEqual(f.requests, [0]);
  stop();
  const next = f.menu();
  await wait(40);
  assert.equal(next.highData.status, 4);
  assert.deepEqual(f.requests, [0]);
});

test("ad watching is safe when the player container is absent", (t) => {
  const f = fixture(t);
  f.document.querySelector("#videoContainer").remove();
  assert.doesNotThrow(() => loadCore(f.document, f.window).skipAd());
});

test("ad watching survives a player wrapper created after script startup", async (t) => {
  const f = fixture(t);
  const core = loadCore(f.document, f.window);
  assert.equal(f.document.querySelector("#player-wrap"), null);
  assert.doesNotThrow(() => core.skipAd());
  const wrap = f.document.createElement("div");
  wrap.id = "player-wrap";
  f.document.querySelector("#videoContainer").append(wrap);
  const ad = f.document.createElement("div");
  ad.className = "new-reward-ab-container";
  ad.innerHTML = '<button class="ab-close"></button>';
  let closed = 0;
  ad.querySelector("button").addEventListener("click", () => closed++);
  wrap.append(ad);
  await wait(35);
  assert.equal(closed, 1);
});

test("full Huya entry starts quality handling before ads when the wrapper is delayed", async (t) => {
  const f = fixture(t);
  const core = loadCore(f.document, f.window);
  const calls = [];
  let stop;
  t.after(() => stop?.());
  const cssImport = 'import("@/site/huya/restyle.css")';
  assert.ok(entrySource.includes(cssImport));
  const entry = runInNewContext(
    entrySource
      .replace(/^import .+;\r?\n/gm, "")
      .replace("export default function", "function")
      .replace(cssImport, "Promise.resolve()") + "\npureHuya;",
    {
      document: f.document,
      INPUT_MAX: { HUYA: 30 },
      swt: { script: { isOn: () => true } },
      console,
      mountVue: () => calls.push("mount"),
      sendBulletChatFn: core.sendBulletChatFn,
      dbClick: core.dbClick,
      unlockAndSwitchHighestImage: () => {
        calls.push("quality");
        stop = core.unlockAndSwitchHighestImage();
      },
      skipAd: () => {
        calls.push("ads");
        core.skipAd();
      },
    },
  );
  assert.doesNotThrow(() => entry());
  assert.deepEqual(calls, ["mount", "quality", "ads"]);
  const m = f.menu();
  await wait(35);
  assert.equal(m.highData.status, 0);
  assert.deepEqual(f.requests, [0]);
});
