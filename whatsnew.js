// "What's new" dot. Every app loads this from the changelog app (a short loader in each index.html
// finds the changelog link in SITE.links), so the logic lives in one place.
//   - Loads changelog.data.js from next to this file, unless the page already has it.
//   - Counts entries you haven't seen, and adds a dot to the header link to the changelog.
//   - window.Whatsnew.markSeen() is called by the changelog page itself.
// "Seen" is kept in the browser. The published apps share one origin, so it's shared between them.
(function () {
  const KEY = "sc-changelog:seen";
  const script = document.currentScript;
  const base = script && script.src ? script.src.replace(/[^/]*$/, "") : "";

  // Seen = the newest date you've seen, plus the ids from that date (several entries can share a day).
  const readSeen = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; }
  };
  const isNew = (entry, seen) => !seen || entry.date > seen.date || (entry.date === seen.date && !(seen.ids || []).includes(entry.id));
  const unseen = (entries, seen = readSeen()) => (entries || []).filter((e) => isNew(e, seen));
  const markSeen = (entries) => {
    if (!entries || !entries.length) return;
    const date = entries.reduce((d, e) => (e.date > d ? e.date : d), "");
    try { localStorage.setItem(KEY, JSON.stringify({ date, ids: entries.filter((e) => e.date === date).map((e) => e.id) })); } catch (e) { /* storage unavailable */ }
  };
  window.Whatsnew = { readSeen, isNew, unseen, markSeen };

  // The changelog page does its own marking. Every other page gets the dot.
  if (!base || document.documentElement.dataset.app === "changelog") return;

  const addStyle = () => {
    if (document.getElementById("whatsnew-style")) return;
    const s = document.createElement("style");
    s.id = "whatsnew-style";
    s.textContent = ".whatsnew-dot{display:inline-block;width:8px;height:8px;margin-left:6px;border-radius:50%;background:var(--accent,#4cc2ff);vertical-align:middle;}"
      + ".whatsnew-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;}";
    document.head.appendChild(s);
  };

  const mark = (box, n) => {
    for (const a of box.querySelectorAll("a[href]")) {
      if (!a.href.startsWith(base) || a.querySelector(".whatsnew-dot")) continue;
      addStyle();
      a.title = `${n} new update${n === 1 ? "" : "s"} since your last visit`;
      a.insertAdjacentHTML("beforeend", `<span class="whatsnew-dot" aria-hidden="true"></span><span class="whatsnew-sr"> (${n} new)</span>`);
    }
  };

  const run = () => {
    const n = unseen(window.CHANGELOG).length;
    if (!n) return;
    // Apps draw their header links (#siteLinks) when they start, which can be after this runs, and
    // some redraw them. Mark now, and again whenever the links change.
    const start = () => {
      const box = document.getElementById("siteLinks") || document.body;
      mark(box, n);
      new MutationObserver(() => mark(box, n)).observe(box, { childList: true, subtree: box !== document.body });
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  };

  if (window.CHANGELOG) run();
  else {
    const s = document.createElement("script");
    s.src = `${base}changelog.data.js`;
    s.onload = run;
    s.onerror = () => { /* changelog not reachable: no dot */ };
    document.head.appendChild(s);
  }
})();
