(function () {
  "use strict";
  var script = document.currentScript;
  if (!script || !script.src) return;
  var source = new URL(script.src, document.baseURI);
  var origin = source.origin;
  var sequence = 0;
  function mount(target, options) {
    options = options || {};
    if (typeof target === "string") target = document.querySelector(target);
    if (!target || typeof target.appendChild !== "function")
      throw new Error("KoulivandEmbed: target element was not found.");
    var theme =
      String(options.theme || "light").toLowerCase() === "dark"
        ? "dark"
        : "light";
    var requested = String(options.layout || "vertical").toLowerCase();
    var layout =
      requested === "horizontal" || requested === "horizental"
        ? "horizontal"
        : "vertical";
    var id = "koulivand-" + Date.now().toString(36) + "-" + ++sequence;
    var url = new URL("/embed/", origin);
    url.searchParams.set("theme", theme);
    url.searchParams.set("layout", layout);
    url.searchParams.set("id", id);
    var frame = document.createElement("iframe");
    frame.title = "آخرین نوشته‌ی وبلاگ امیر کولیوند";
    frame.setAttribute("loading", "lazy");
    frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    frame.setAttribute(
      "sandbox",
      "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox",
    );
    frame.style.display = "block";
    frame.style.width = "100%";
    frame.style.border = "0";
    frame.style.height = layout === "vertical" ? "560px" : "290px";
    frame.style.colorScheme = theme;
    var disposed = false;
    var allocation = options.container || target;
    function allocatedHeight() {
      if (!allocation.getBoundingClientRect) return 0;
      var style = window.getComputedStyle && window.getComputedStyle(allocation);
      return Math.max(0, allocation.getBoundingClientRect().height - (style ? (parseFloat(style.paddingTop)||0)+(parseFloat(style.paddingBottom)||0)+(parseFloat(style.borderTopWidth)||0)+(parseFloat(style.borderBottomWidth)||0) : 0));
    }
    var fixedHeight = options.height === "auto" ? 0 : Number(options.height) || (target.children.length === 0 ? allocatedHeight() : 0);
    var paletteKey = "";
    function rgb(value) {
      var match = String(value).match(/^rgba?\(([^)]+)\)$/);
      if (!match) return null;
      var parts = match[1].split(/[, /]+/).filter(Boolean).map(Number);
      return parts.length >= 3 && parts.every(Number.isFinite) ? parts : null;
    }
    function hex(parts) {
      return "#" + parts.slice(0, 3).map(function (n) { return Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, "0"); }).join("");
    }
    function sync() {
      if (disposed || !window.getComputedStyle) return;
      var node = target, layers = [], bg = [255, 255, 255];
      while (node) {
        var layer = rgb(window.getComputedStyle(node).backgroundColor);
        if (layer) layers.push(layer);
        node = node.parentElement;
      }
      layers.reverse().forEach(function (layer) {
        var alpha = layer.length > 3 ? layer[3] : 1;
        bg = bg.map(function (n, i) { return layer[i] * alpha + n * (1 - alpha); });
      });
      var dark = bg[0] * .299 + bg[1] * .587 + bg[2] * .114 < 140;
      var style = window.getComputedStyle(target);
      var ink = rgb(style.color) || (dark ? [238, 241, 248] : [32, 40, 48]);
      // Host styles sometimes leave an unreadable inherited foreground.
      if (Math.abs(ink[0]*.299+ink[1]*.587+ink[2]*.114 - (bg[0]*.299+bg[1]*.587+bg[2]*.114)) < 70)
        ink = dark ? [238,241,248] : [32,40,48];
      var link = target.parentElement && target.parentElement.querySelector("a[href]");
      var accent = link && rgb(window.getComputedStyle(link).color);
      if (!accent || Math.abs(accent[0]*.299+accent[1]*.587+accent[2]*.114 - (bg[0]*.299+bg[1]*.587+bg[2]*.114)) < 70) accent = ink;
      var palette = { bg:hex(bg), ink:hex(ink), accent:hex(accent), muted:hex(bg.map(function(n,i){return n*.3+ink[i]*.7;})), border:hex(bg.map(function(n,i){return n*.8+ink[i]*.2;})) };
      var height = fixedHeight ? Math.max(100, Number(options.height) || allocatedHeight() || fixedHeight) : 0;
      if (height) frame.style.height = height + "px";
      frame.style.background = palette.bg;
      frame.style.colorScheme = dark ? "dark" : "light";
      var data = {type:"koulivand:host",id:id,palette:palette,font:style.fontFamily,height:height};
      var key = JSON.stringify(data);
      if (key !== paletteKey) { paletteKey = key; frame.contentWindow.postMessage(data, origin); }
    }
    if (frame.addEventListener) frame.addEventListener("load", function(){paletteKey="";sync();});
    var resizeObserver = window.ResizeObserver ? new window.ResizeObserver(sync) : null;
    if (resizeObserver) resizeObserver.observe(allocation);
    var mutationObserver = window.MutationObserver ? new window.MutationObserver(sync) : null;
    if (mutationObserver) {
      var ancestor = target;
      while (ancestor) { mutationObserver.observe(ancestor,{attributes:true,attributeFilter:["class","style","data-theme"]}); ancestor=ancestor.parentElement; }
    }
    window.addEventListener("resize",sync);
    var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    if (media && media.addEventListener) media.addEventListener("change",sync);
    function receive(event) {
      var data = event.data;
      if (
        disposed ||
        event.origin !== origin ||
        event.source !== frame.contentWindow ||
        !data ||
        data.type !== "koulivand:resize" ||
        data.id !== id ||
        typeof data.height !== "number" ||
        !Number.isFinite(data.height)
      )
        return;
      paletteKey = ""; sync();
      if (!fixedHeight) frame.style.height =
        Math.max(100, Math.min(2000, Math.ceil(data.height))) + "px";
    }
    window.addEventListener("message", receive);
    frame.src = url.href;
    target.appendChild(frame);
    sync();
    return {
      iframe: frame,
      destroy: function () {
        disposed = true;
        if (resizeObserver) resizeObserver.disconnect();
        if (mutationObserver) mutationObserver.disconnect();
        window.removeEventListener("resize",sync);
        if (media && media.removeEventListener) media.removeEventListener("change",sync);
        window.removeEventListener("message", receive);
        frame.remove();
      },
    };
  }
  window.KoulivandEmbed = { mount: mount };
  if (
    script.getAttribute("data-auto") !== "false" &&
    script.parentElement &&
    script.parentElement.tagName !== "HEAD"
  ) {
    var container = script.parentElement.children && script.parentElement.children.length === 1 ? script.parentElement : null;
    var host = document.createElement("div");
    script.insertAdjacentElement("afterend", host);
    mount(host, {
      container: container,
      theme:
        script.getAttribute("data-theme") || source.searchParams.get("theme"),
      layout:
        script.getAttribute("data-layout") || source.searchParams.get("layout"),
    });
  }
})();
