// What's new: lists CHANGELOG (changelog.data.js) newest first, grouped by month, with app and kind
// filters (kept in ?app= and ?kind=) and a permalink for each entry (#e/<id>).
(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const SITE = window.SITE || { links: [] };
  const KINDS = window.CHANGELOG_KINDS || [];
  const APPS = window.CHANGELOG_APPS || {};
  const kindLabel = (id) => (KINDS.find((k) => k.id === id) || { label: id }).label;
  // Newest first. Entries on the same day keep their order in the file (newest at the top).
  const ENTRIES = (window.CHANGELOG || []).slice().sort((a, b) => b.date.localeCompare(a.date));

  const siteHref = (id) => ((SITE.links || []).find((l) => l.id === id) || {}).href || null;
  const appHref = (app, { q, hash } = {}) => {
    let u = siteHref(app);
    if (!u) return null;
    if (q) u += `${u.includes("?") ? "&" : "?"}q=${encodeURIComponent(q)}`;
    if (hash) u += `#${hash}`;
    return u;
  };

  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const SHORT = MONTHS.map((m) => m.slice(0, 3));
  const fmtDate = (d) => { const [y, m, day] = d.split("-").map(Number); return `${day} ${SHORT[m - 1]} ${y}`; };
  const monthOf = (d) => { const [y, m] = d.split("-").map(Number); return `${MONTHS[m - 1]} ${y}`; };

  // Which entries are new to you. On a first visit nothing is marked: it would be everything.
  const W = window.Whatsnew;
  const seen = W ? W.readSeen() : null;
  const newIds = new Set(seen && W ? W.unseen(ENTRIES, seen).map((e) => e.id) : []);
  if (W) W.markSeen(ENTRIES);

  const params = new URLSearchParams(location.search);
  const state = { app: params.get("app") || "", kind: params.get("kind") || "" };
  if (state.app && !APPS[state.app]) state.app = "";
  if (state.kind && !KINDS.some((k) => k.id === state.kind)) state.kind = "";

  const setUrl = () => {
    const p = new URLSearchParams();
    if (state.app) p.set("app", state.app);
    if (state.kind) p.set("kind", state.kind);
    const qs = p.toString();
    try { history.replaceState(null, "", `${location.pathname}${qs ? `?${qs}` : ""}${location.hash}`); } catch (e) { /* file:// */ }
  };

  const matches = (e, s = state) => (!s.app || e.apps.includes(s.app)) && (!s.kind || e.kind === s.kind);

  const chip = (group, id, label, n) =>
    `<button type="button" class="cl-chip${state[group] === id ? " on" : ""}" data-group="${group}" data-id="${esc(id)}" aria-pressed="${state[group] === id}">${esc(label)}<span class="n">${n}</span></button>`;

  function renderFilters() {
    const appIds = Object.keys(APPS).filter((a) => ENTRIES.some((e) => e.apps.includes(a)));
    const kindIds = KINDS.map((k) => k.id).filter((k) => ENTRIES.some((e) => e.kind === k));
    const count = (s) => ENTRIES.filter((e) => matches(e, s)).length;
    $("filters").innerHTML = `
      <div class="chip-row" role="group" aria-label="App">
        ${chip("app", "", "All apps", count({ ...state, app: "" }))}
        ${appIds.map((a) => chip("app", a, APPS[a], count({ ...state, app: a }))).join("")}
      </div>
      <div class="chip-row" role="group" aria-label="Kind of change">
        ${chip("kind", "", "All changes", count({ ...state, kind: "" }))}
        ${kindIds.map((k) => chip("kind", k, kindLabel(k), count({ ...state, kind: k }))).join("")}
      </div>`;
  }

  function entryHtml(e) {
    const apps = e.apps.filter((a) => a !== "changelog").map((a) => {
      const href = appHref(a);
      return href ? `<a class="app-tag" href="${esc(href)}">${esc(APPS[a] || a)}</a>` : `<span class="app-tag">${esc(APPS[a] || a)}</span>`;
    }).join("");
    const links = (e.links || []).map((l) => {
      const href = l.url || appHref(l.app, l);
      return href ? `<a class="try" href="${esc(href)}">${esc(l.label)} →</a>` : "";
    }).join("");
    return `
      <article class="cl-entry${newIds.has(e.id) ? " is-new" : ""}" id="e-${esc(e.id)}">
        <div class="cl-head">
          <span class="kind-badge kind-${esc(e.kind)}">${esc(kindLabel(e.kind))}</span>
          <time datetime="${esc(e.date)}">${esc(fmtDate(e.date))}</time>
          ${newIds.has(e.id) ? `<span class="new-pill">New since your last visit</span>` : ""}
          <a class="permalink" href="#e/${esc(e.id)}" title="Link to this update" aria-label="Link to ${esc(e.title)}">#</a>
        </div>
        <h3>${esc(e.title)}</h3>
        <p>${esc(e.summary)}</p>
        ${e.details && e.details.length ? `<ul>${e.details.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>` : ""}
        ${apps || links ? `<div class="cl-foot">${apps}${links}</div>` : ""}
      </article>`;
  }

  function render() {
    renderFilters();
    const shown = ENTRIES.filter((e) => matches(e));
    if (!shown.length) {
      $("view").innerHTML = `<p class="muted">No updates match these filters.</p>`;
      return;
    }
    let html = "";
    let month = "";
    for (const e of shown) {
      const m = monthOf(e.date);
      if (m !== month) { html += `${month ? "</section>" : ""}<section class="cl-month"><h2>${esc(m)}</h2>`; month = m; }
      html += entryHtml(e);
    }
    $("view").innerHTML = `${html}</section>`;
    focusHash();
  }

  // #e/<id>: scroll to that entry and highlight it, clearing filters that hide it.
  function focusHash() {
    const m = location.hash.match(/^#e\/(.+)$/);
    document.querySelectorAll(".cl-entry.target").forEach((el) => el.classList.remove("target"));
    if (!m) return;
    const id = decodeURIComponent(m[1]);
    const entry = ENTRIES.find((e) => e.id === id);
    if (!entry) return;
    if (!matches(entry)) { state.app = ""; state.kind = ""; setUrl(); render(); return; }
    const el = document.getElementById(`e-${id}`);
    if (el) { el.classList.add("target"); el.scrollIntoView({ block: "start" }); }
  }

  $("filters").addEventListener("click", (ev) => {
    const b = ev.target.closest("button[data-group]");
    if (!b) return;
    state[b.dataset.group] = b.dataset.id;
    // Choosing a filter replaces any "jump to this update" link, which would otherwise undo it.
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { location.hash = ""; }
    setUrl();
    render();
  });
  window.addEventListener("hashchange", focusHash);

  $("siteLinks").innerHTML = (SITE.links || []).map((l) => `<a href="${esc(l.href)}">${esc(l.label)} →</a>`).join("");
  const latest = ENTRIES[0];
  $("meta").textContent = [
    `${ENTRIES.length} updates`,
    latest ? `latest ${fmtDate(latest.date)}` : "",
    newIds.size ? `${newIds.size} new since your last visit` : "",
  ].filter(Boolean).join(" · ");

  render();
})();
