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
      frame.style.height =
        Math.max(100, Math.min(2000, Math.ceil(data.height))) + "px";
    }
    window.addEventListener("message", receive);
    frame.src = url.href;
    target.appendChild(frame);
    return {
      iframe: frame,
      destroy: function () {
        disposed = true;
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
    var host = document.createElement("div");
    script.insertAdjacentElement("afterend", host);
    mount(host, {
      theme:
        script.getAttribute("data-theme") || source.searchParams.get("theme"),
      layout:
        script.getAttribute("data-layout") || source.searchParams.get("layout"),
    });
  }
})();
