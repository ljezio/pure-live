import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { Script } from "node:vm";
import { setTimeout as wait } from "node:timers/promises";
import { JSDOM, VirtualConsole } from "jsdom";
import { jQueryFactory } from "jquery/factory";

const require = createRequire(import.meta.url);
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const bundle = readFileSync(new URL("../dist/pure-live.user.js", import.meta.url), "utf8");
const vue = readFileSync(require.resolve("vue/dist/vue.global.prod.js"), "utf8");

test("release userscript has matching metadata, all four platforms and valid syntax", () => {
  assert.doesNotThrow(() => new Script(bundle));
  const metadata = bundle.match(/^\/\/ ==UserScript==[\s\S]*?^\/\/ ==\/UserScript==/m)?.[0];
  assert.ok(metadata, "userscript metadata must be present");
  const values = (key) =>
    Array.from(metadata.matchAll(new RegExp(`^// @${key}\\s+(.+)$`, "gm")), (m) => m[1].trim());
  assert.deepEqual(values("version"), [pkg.version]);
  assert.deepEqual(values("match").sort(), [
    "*://live.bilibili.com/*",
    "*://live.douyin.com/*",
    "*://www.douyu.com/*",
    "*://www.huya.com/*",
  ]);
  assert.ok(values("grant").includes("unsafeWindow"));
  assert.ok(values("require").some((value) => value.includes("vue.global.prod.js")));
  assert.deepEqual(values("license"), ["GPL-3.0-or-later"]);
});

for (const platform of ["douyu", "bilibili"]) {
  for (const automatic of [undefined, false]) {
    test(`built userscript: ${platform} defaults to highest quality and honours opt-out=${automatic === false}`, async (t) => {
      const errors = [];
      const virtualConsole = new VirtualConsole();
      virtualConsole.on("jsdomError", (error) => errors.push(error.message));
      const isDouyu = platform === "douyu";
      const id = isDouyu ? "js-player-main" : "live-player";
      const dom = new JSDOM(`<div id="${id}"></div>`, {
        url: isDouyu ? "https://www.douyu.com/213116" : "https://live.bilibili.com/544618",
        runScripts: "outside-only",
        pretendToBeVisual: true,
        virtualConsole,
      });
      t.after(() => dom.window.close());
      const { window } = dom;
      const { document } = window;
      const player = document.getElementById(id);
      window.eval(vue);
      window.GM_getValue = (key) => (key === "auto_highest_image" ? automatic : undefined);
      window.GM_setValue = () => {};
      window.GM_addStyle = () => {};
      const interval = window.setInterval.bind(window);
      window.setInterval = (fn) => interval(fn, 20);
      const requests = [];
      let list;
      const createMenu = () => {
        if (list) return;
        const controls = document.createElement("div");
        controls.innerHTML = isDouyu
          ? '<div id="js-player-controlbar"><div class="rate-ec9440"><div class="tipItem-e17801"><input value="画质 "><ul></ul></div></div></div>'
          : '<div class="quality-wrap svelte-770q4t"><div class="panel"><div class="line-wrap">主线</div></div></div>';
        list = controls.querySelector(isDouyu ? "ul" : ".panel");
        const menu = controls.querySelector(isDouyu ? '[class^="rate-"]' : ".quality-wrap");
        menu.addEventListener("mouseenter", () => {
          if (list.querySelector("[data-quality]")) return;
          for (const [i, label] of ["原画1080P60", "720P 超清"].entries()) {
            const item = document.createElement(isDouyu ? "li" : "div");
            item.dataset.quality = label;
            item.textContent = label;
            if (!isDouyu) item.classList.add("list-it");
            item.classList.toggle("selected", i === 1);
            item.addEventListener("click", () => {
              requests.push(label);
              for (const other of list.querySelectorAll("[data-quality]")) {
                other.classList.toggle("selected", other === item);
              }
            });
            list.append(item);
          }
        });
        player.append(controls);
      };
      assert.doesNotThrow(() => window.eval(bundle));
      // Controls and their native event handlers finish loading after the userscript.
      player.addEventListener("mousemove", createMenu);
      if (automatic === false) {
        createMenu();
        player
          .querySelector(isDouyu ? '[class^="rate-"]' : ".quality-wrap")
          .dispatchEvent(new window.MouseEvent("mouseenter"));
      }
      await wait(180);
      assert.equal(
        list.querySelector(".selected").textContent,
        automatic === false ? "720P 超清" : "原画1080P60",
      );
      assert.deepEqual(requests, automatic === false ? [] : ["原画1080P60"]);
      assert.deepEqual(errors, []);
    });
  }
}

test("built userscript starts before the player wrapper and keeps manual quality selections", async (t) => {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("jsdomError", (error) => errors.push(error.message));
  const dom = new JSDOM('<div id="liveRoomObj"><div id="videoContainer"></div></div>', {
    url: "https://www.huya.com/chuhe",
    runScripts: "outside-only",
    pretendToBeVisual: true,
    virtualConsole,
  });
  t.after(() => dom.window.close());
  const { window } = dom;
  const { document } = window;
  window.eval(vue);
  window.$ = window.jQuery = jQueryFactory(window);
  window.unsafeWindow = window;
  window.GM_getValue = () => undefined;
  window.GM_setValue = () => {};
  window.GM_addStyle = (text) => {
    const style = document.createElement("style");
    style.textContent = text;
    document.head.append(style);
  };

  assert.equal(document.querySelector("#player-wrap"), null);
  assert.doesNotThrow(() => window.eval(bundle));
  const wrap = document.createElement("div");
  wrap.id = "player-wrap";
  document.querySelector("#videoContainer").append(wrap);
  const menu = document.createElement("ul");
  menu.className = "player-videotype-list";
  const requests = [];
  const qualities = [
    { label: "蓝光50M", status: 4, iEnable: 0, iBitRate: 0, iSortValue: 50000 },
    { label: "蓝光20M", status: 4, iEnable: 0, iBitRate: 20000, iSortValue: 20000 },
    { label: "蓝光8M", status: 0, iEnable: 1, iBitRate: 8000, iSortValue: 8000 },
  ];
  for (const data of qualities) {
    const item = document.createElement("li");
    item.textContent = data.label;
    item.classList.toggle("on", data.iBitRate === 8000);
    window.$(item).data("data", data);
    item.addEventListener("click", () => {
      if (data.status !== 0) return;
      for (const sibling of menu.children) sibling.classList.toggle("on", sibling === item);
      requests.push(data.iBitRate);
    });
    menu.append(item);
  }
  wrap.append(menu);
  await wait(80);
  assert.equal(menu.querySelector(".on").textContent, "蓝光50M");
  assert.deepEqual(requests, [0]);
  assert.deepEqual(
    qualities.map((data) => data.status),
    [0, 0, 0],
  );
  assert.deepEqual(
    qualities.map((data) => data.iEnable),
    [1, 1, 1],
  );

  menu.children[1].click();
  // Wait through the fallback poll to catch accidental repeated auto-switching.
  await wait(1150);
  assert.equal(menu.querySelector(".on").textContent, "蓝光20M");
  assert.deepEqual(requests, [0, 20000]);
  assert.deepEqual(errors, []);
});
