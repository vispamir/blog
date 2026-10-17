import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { embedOptions, renderEmbed } from "../src/lib/embed";
import { GET } from "../src/app/embed/route";
import { getArticles } from "../src/lib/articles";

test("embed options support defaults, both horizontal spellings and safe IDs", () => {
  assert.deepEqual(embedOptions(new URLSearchParams()), {
    theme: "light",
    layout: "vertical",
    id: "",
  });
  for (const layout of ["horizontal", "horizental"])
    assert.equal(
      embedOptions(new URLSearchParams({ theme: "dark", layout })).layout,
      "horizontal",
    );
  assert.equal(
    embedOptions(
      new URLSearchParams({
        theme: "unknown",
        layout: "unknown",
        id: '<script>"',
      }),
    ).id,
    "script",
  );
  assert.equal(
    embedOptions(new URLSearchParams({ theme: "unknown" })).theme,
    "light",
  );
});
test("HTML escapes content and handles an empty blog", () => {
  const html = renderEmbed(
    {
      slug: "sample",
      title: "<script>alert(1)</script>",
      description: "<img src=x onerror=alert(1)>",
      date: "2026-10-15",
      readingTime: 3,
    },
    "/images/test.webp",
    "test",
    embedOptions(new URLSearchParams()),
    "nonce",
  );
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(!html.includes("<img src=x"));
  assert.ok(html.includes('rel="noopener noreferrer"'));
  assert.ok(
    renderEmbed(
      undefined,
      "",
      "",
      embedOptions(new URLSearchParams()),
      "nonce",
    ).includes("هنوز نوشته‌ای"),
  );
});
test("embed route serves latest published content with framing and freshness headers", async () => {
  const response = GET(
    new Request("https://koulivand.ir/embed/?theme=dark&layout=horizental"),
  );
  assert.equal(
    response.headers.get("content-type"),
    "text/html; charset=utf-8",
  );
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("x-frame-options"), null);
  assert.ok(
    response.headers
      .get("content-security-policy")
      ?.includes("frame-ancestors *"),
  );
  const html = await response.text();
  assert.ok(html.includes(getArticles(false)[0].title));
  assert.ok(html.includes('class="dark"'));
  assert.ok(html.includes("widget horizontal"));
  assert.ok(!html.includes("/_next/"));
  assert.ok(!html.includes("ناوبری اصلی"));
});
function host(attrs: Record<string, string> = {}, adaptive = false) {
  const messages: any[] = [];
  const observers: any[] = [];
  let background = "rgb(8, 12, 24)";
  const listeners = new Set<(event: unknown) => void>();
  const added: any[] = [];
  const element = (tag: string) => ({
    tagName: tag.toUpperCase(),
    style: {} as Record<string, string>,
    attributes: {} as Record<string, string>,
    children: [] as any[],
    contentWindow: { postMessage(data: unknown, origin: string) { messages.push({data, origin}); } },
    getBoundingClientRect() { return {height: 0}; },
    setAttribute(key: string, value: string) {
      this.attributes[key] = value;
    },
    appendChild(child: any) {
      this.children.push(child);
    },
    remove() {},
  });
  const script = {
    src: "https://koulivand.ir/embed.js?theme=dark&layout=horizental",
    parentElement: { tagName: "BODY" },
    getAttribute(key: string) {
      return attrs[key] ?? null;
    },
    insertAdjacentElement(_position: string, target: any) {
      added.push(target);
    },
  };
  const document = {
    currentScript: script,
    baseURI: "https://example.org/",
    createElement: element,
    querySelector: () => null,
  };
  const window: any = {
    addEventListener: (_type: string, listener: any) => listeners.add(listener),
    removeEventListener: (_type: string, listener: any) =>
      listeners.delete(listener),
  };
  if (adaptive) {
    window.getComputedStyle = () => ({backgroundColor: background, color:"rgb(230, 235, 255)",fontFamily:"Tahoma"});
    window.ResizeObserver = window.MutationObserver = class {
      disconnected = false;
      constructor(public callback: () => void) {observers.push(this);}
      observe() {}
      disconnect() {this.disconnected = true;}
    };
  }
  runInNewContext(readFileSync("public/embed.js", "utf8"), {
    document,
    window,
    URL,
  });
  return { listeners, added, window, element, messages, observers, setBackground(value: string) {background=value;} };
}
test("loader supports attributes, query options and multiple isolated instances", () => {
  const h = host({ "data-theme": "light" });
  const automatic = h.added[0].children[0];
  assert.equal(new URL(automatic.src).searchParams.get("theme"), "light");
  assert.equal(new URL(automatic.src).searchParams.get("layout"), "horizontal");
  const target = h.element("div");
  const mounted = h.window.KoulivandEmbed.mount(target, {
    theme: "dark",
    layout: "vertical",
  });
  const frame = mounted.iframe;
  const id = new URL(frame.src).searchParams.get("id");
  assert.equal(frame.style.height, "560px");
  const data = { type: "koulivand:resize", id, height: 680 };
  for (const fn of h.listeners)
    fn({ origin: "https://evil.example", source: frame.contentWindow, data });
  assert.equal(frame.style.height, "560px");
  for (const fn of h.listeners)
    fn({
      origin: "https://koulivand.ir",
      source: automatic.contentWindow,
      data,
    });
  assert.equal(frame.style.height, "560px");
  for (const fn of h.listeners)
    fn({ origin: "https://koulivand.ir", source: frame.contentWindow, data });
  assert.equal(frame.style.height, "680px");
  for (const fn of h.listeners)
    fn({
      origin: "https://koulivand.ir",
      source: frame.contentWindow,
      data: { ...data, height: Infinity },
    });
  assert.equal(frame.style.height, "680px");
  mounted.destroy();
  assert.equal(h.listeners.size, 2);
  assert.throws(
    () => h.window.KoulivandEmbed.mount("#missing"),
    /target element/,
  );
});

test("host palette overrides fallback theme, reacts to changes and preserves allocated height", () => {
  const h = host({"data-auto":"false"}, true);
  const target = h.element("div");
  let height = 360;
  target.getBoundingClientRect = () => ({height});
  const widget = h.window.KoulivandEmbed.mount(target,{theme:"light",layout:"horizontal"});
  assert.equal(widget.iframe.style.height,"360px");
  assert.equal(h.messages.at(-1).data.palette.bg,"#080c18");
  assert.equal(h.messages.at(-1).origin,"https://koulivand.ir");
  h.setBackground("rgb(234, 241, 251)");
  height = 280;
  h.observers[0].callback();
  assert.equal(widget.iframe.style.height,"280px");
  assert.equal(h.messages.at(-1).data.palette.bg,"#eaf1fb");
  assert.equal(h.messages.at(-1).data.palette.ink,"#202830");
  const id = new URL(widget.iframe.src).searchParams.get("id");
  for(const fn of h.listeners) fn({origin:"https://koulivand.ir",source:widget.iframe.contentWindow,data:{type:"koulivand:resize",id,height:700}});
  assert.equal(widget.iframe.style.height,"280px");
  widget.destroy();
  assert.ok(h.observers.every(observer=>observer.disconnected));
});
