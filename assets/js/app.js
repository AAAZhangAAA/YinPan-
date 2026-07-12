/* =============================================================================
 *  影盘集 · 应用逻辑
 *  前端 hash 路由 + 动态渲染 + 搜索/筛选 + 详情页密码管理
 *  依赖：data.js（提供 CATEGORIES 与 RESOURCES）
 * ========================================================================== */
(function () {
  "use strict";

  /* ---------- 工具函数 ---------- */
  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  function truncate(str, n) {
    str = String(str || "");
    return str.length > n ? str.slice(0, n) + "…" : str;
  }
  function countByCat(cat) {
    return RESOURCES.filter((r) => r.category === cat).length;
  }
  function countBySub(cat, sub) {
    return RESOURCES.filter((r) => r.category === cat && r.subcategory === sub).length;
  }
  function getResourceById(id) {
    return RESOURCES.find((r) => r.id === id);
  }
  function getCategory(name) {
    return CATEGORIES.find((c) => c.name === name);
  }

  /* 封面占位图：根据分类生成渐变 SVG（离线可用） */
  const COVER_PALETTE = {
    "纪录片": ["#0d9488", "#0891b2"],
    "电影": ["#4f46e5", "#7c3aed"],
    "电视剧": ["#0ea5e9", "#2563eb"],
    "综艺": ["#f59e0b", "#ef4444"],
    "插件工具": ["#10b981", "#059669"],
  };
  function placeholderCover(item) {
    const c = COVER_PALETTE[item.category] || ["#64748b", "#475569"];
    const svg =
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 180'>" +
      "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
      "<stop offset='0' stop-color='" + c[0] + "'/><stop offset='1' stop-color='" + c[1] + "'/>" +
      "</linearGradient></defs>" +
      "<rect width='320' height='180' fill='url(#g)'/>" +
      "<text x='160' y='92' font-family='sans-serif' font-size='24' fill='rgba(255,255,255,.96)' text-anchor='middle' font-weight='700'>" +
      escapeHtml(item.category) + "</text>" +
      "<text x='160' y='122' font-family='sans-serif' font-size='13' fill='rgba(255,255,255,.82)' text-anchor='middle'>" +
      escapeHtml(truncate(item.title, 16)) + "</text>" +
      "</svg>";
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }
  function coverOf(item) {
    return item.cover && item.cover.trim() ? item.cover : placeholderCover(item);
  }

  /* ---------- DOM 引用 ---------- */
  const content = document.getElementById("content");
  const catNav = document.getElementById("catNav");
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  const toastEl = document.getElementById("toast");

  /* ---------- Toast ---------- */
  let toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1800);
  }

  /* ---------- 复制 ---------- */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => toast("已复制：" + text)).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
    function fallbackCopy() {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); toast("已复制：" + text); }
      catch (e) { toast("复制失败，请手动复制"); }
      document.body.removeChild(ta);
    }
  }

  /* ---------- 卡片 ---------- */
  function cardHTML(item) {
    const cover = coverOf(item);
    const badge = item.subcategory || item.category;
    const rec = item.recommended ? '<span class="card-rec">推荐</span>' : "";
    return (
      '<a class="card" href="#/resource/' + encodeURIComponent(item.id) + '">' +
        '<div class="card-cover">' +
          '<img src="' + cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy" />' +
          '<span class="card-badge">' + escapeHtml(badge) + "</span>" + rec +
        "</div>" +
        '<div class="card-body">' +
          '<div class="card-title">' + escapeHtml(item.title) + "</div>" +
          '<div class="card-brief">' + escapeHtml(item.brief) + "</div>" +
          '<div class="card-foot"><span>🕒 ' + escapeHtml(item.date) + '</span><span class="dl">查看 ›</span></div>' +
        "</div>" +
      "</a>"
    );
  }
  function gridHTML(list) {
    if (!list.length) {
      return '<div class="empty"><div class="big">🔍</div>没有找到匹配的资源，换个关键词或分类试试～</div>';
    }
    return '<div class="grid">' + list.map(cardHTML).join("") + "</div>";
  }

  /* ---------- 侧边栏分类导航 ---------- */
  function buildSidebar() {
    let html = '<ul>';
    CATEGORIES.forEach((cat) => {
      const total = countByCat(cat.name);
      html +=
        '<li class="cat-group" data-cat="' + escapeHtml(cat.name) + '">' +
          '<a class="cat-link" href="#/category/' + encodeURIComponent(cat.name) + '">' +
            '<span class="cat-ico">' + escapeHtml(cat.icon || "📁") + "</span>" +
            "<span>" + escapeHtml(cat.name) + "</span>" +
            '<span class="cat-count">' + total + "</span>" +
            '<svg class="caret" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          "</a>";
      if (cat.subs && cat.subs.length) {
        html += '<ul class="sub-list">';
        cat.subs.forEach((sub) => {
          const n = countBySub(cat.name, sub);
          if (n === 0) return;
          html +=
            '<li><a href="#/category/' + encodeURIComponent(cat.name) + "/" + encodeURIComponent(sub) + '">' +
              "<span>" + escapeHtml(sub) + "</span>" +
              '<span class="cat-count">' + n + "</span>" +
            "</a></li>";
        });
        html += "</ul>";
      }
      html += "</li>";
    });
    html += "</ul>";
    catNav.innerHTML = html;

    /* 点击顶级分类：导航同时展开/收起子类 */
    catNav.querySelectorAll(".cat-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        const group = link.closest(".cat-group");
        if (group) group.classList.toggle("open");
      });
    });
  }
  function highlightSidebar(cat, sub) {
    catNav.querySelectorAll(".cat-group").forEach((g) => {
      const name = g.getAttribute("data-cat");
      const isCat = name === cat;
      g.classList.toggle("open", isCat);
      const top = g.querySelector(".cat-link");
      top.classList.toggle("active", isCat && !sub);
      g.querySelectorAll(".sub-list a").forEach((a) => {
        const href = a.getAttribute("href");
        const active = isCat && sub && decodeURIComponent(href.split("/").pop()) === sub;
        a.classList.toggle("active", !!active);
      });
    });
  }

  /* ---------- 面包屑 ---------- */
  function breadcrumb(parts) {
    let html = '<nav class="breadcrumb"><a href="#/">首页</a>';
    parts.forEach((p, i) => {
      html += '<span class="sep">›</span>';
      if (p.href && i < parts.length - 1) html += '<a href="' + p.href + '">' + escapeHtml(p.label) + "</a>";
      else html += "<span>" + escapeHtml(p.label) + "</span>";
    });
    return html + "</nav>";
  }

  /* ---------- 首页 ---------- */
  function renderHome() {
    const recommended = RESOURCES.filter((r) => r.recommended);
    const latest = RESOURCES.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

    const hero =
      '<section class="hero">' +
        "<h1>影盘集 · 精选影视与插件资源</h1>" +
        "<p>为粉丝整理的电影、剧集、动漫、综艺与实用插件网盘资源，一键直达，持续更新。</p>" +
        '<div class="hero-stats">' +
          "<div><b>" + RESOURCES.length + "</b>资源总量</div>" +
          "<div><b>" + CATEGORIES.length + "</b>分类栏目</div>" +
          "<div><b>" + recommended.length + "</b>站长推荐</div>" +
        "</div>" +
      "</section>";

    const quick =
      '<section class="section"><div class="section-head"><h2>📂 分类导航</h2>' +
      '<a class="more" href="#/category/' + encodeURIComponent(CATEGORIES[0].name) + '">浏览全部 ›</a></div>' +
      '<div class="cat-quick">' +
      CATEGORIES.map((c) =>
        '<a class="cat-chip" href="#/category/' + encodeURIComponent(c.name) + '">' +
          '<div class="ico">' + escapeHtml(c.icon || "📁") + "</div>" +
          '<div class="name">' + escapeHtml(c.name) + "</div>" +
          '<div class="num">' + countByCat(c.name) + " 个资源</div>" +
        "</a>"
      ).join("") +
      "</div></section>";

    const recSection =
      '<section class="section"><div class="section-head"><h2>🔥 推荐资源</h2>' +
      '<span class="section-sub">站长精选，热门必看</span></div>' +
      gridHTML(recommended) + "</section>";

    const latestSection =
      '<section class="section"><div class="section-head"><h2>🆕 最新更新</h2>' +
      '<span class="section-sub">按更新时间排序</span>' +
      '<a class="more" href="#/search">搜索更多 ›</a></div>' +
      gridHTML(latest) + "</section>";

    content.innerHTML = hero + quick + recSection + latestSection;
    highlightSidebar(null, null);
  }

  /* ---------- 分类列表 ---------- */
  function renderCategory(cat, sub) {
    const catObj = getCategory(cat);
    if (!catObj) { renderNotFound("分类不存在"); return; }

    let list = RESOURCES.filter((r) => r.category === cat);
    if (sub) list = list.filter((r) => r.subcategory === sub);

    const crumbs = [{
      label: cat,
      href: "#/category/" + encodeURIComponent(cat),
    }, ...(sub ? [{ label: sub }] : [])];

    const subChips = (catObj.subs || [])
      .filter((s) => countBySub(cat, s) > 0)
      .map((s) =>
        '<a class="chip" href="#/category/' + encodeURIComponent(cat) + "/" + encodeURIComponent(s) + '">' +
          escapeHtml(s) +
          '<span class="cat-count" style="margin-left:6px">' + countBySub(cat, s) + "</span>" +
        "</a>"
      ).join("");

    const filterbar =
      '<div class="filterbar">' +
        '<a class="chip" href="#/category/' + encodeURIComponent(cat) + '">全部' +
          '<span class="cat-count" style="margin-left:6px">' + countByCat(cat) + "</span></a>" +
        subChips +
        '<span class="result-count">共 ' + list.length + " 个资源</span>" +
      "</div>";

    content.innerHTML =
      breadcrumb(crumbs) +
      '<div class="section-head"><h2>' + escapeHtml(cat) +
      (sub ? " · " + escapeHtml(sub) : "") + "</h2></div>" +
      filterbar +
      gridHTML(list);

    highlightSidebar(cat, sub);
  }

  /* ---------- 搜索 ---------- */
  function renderSearch(q, cat) {
    q = (q || "").trim();
    const kw = q.toLowerCase();

    function runFilter(keyword, category) {
      keyword = (keyword || "").trim().toLowerCase();
      let list = RESOURCES;
      if (keyword) {
        list = list.filter((r) =>
          (r.title + " " + r.brief + " " + r.description + " " + r.tags.join(" ")).toLowerCase().indexOf(keyword) > -1
        );
      }
      if (category) list = list.filter((r) => r.category === category);
      return list;
    }

    const crumbs = [{ label: "搜索" }];
    const catOptions =
      '<select id="searchCat" class="btn" style="padding:6px 10px">' +
        '<option value="">全部分类</option>' +
        CATEGORIES.map((c) =>
          '<option value="' + escapeHtml(c.name) + '"' + (c.name === cat ? " selected" : "") + ">" +
          escapeHtml(c.name) + "</option>"
        ).join("") +
      "</select>";

    const filterbar =
      '<div class="filterbar">' +
        '<input id="searchInputPage" class="search-input" style="max-width:320px;background:var(--surface-2);border:1px solid var(--border);border-radius:999px;padding:8px 14px" placeholder="输入关键词继续筛选…" value="' + escapeHtml(q) + '" />' +
        catOptions +
        (q || cat ? '<button class="btn" id="clearSearch">清除</button>' : "") +
      "</div>";

    content.innerHTML =
      breadcrumb(crumbs) +
      '<div class="section-head"><h2>🔎 搜索资源</h2>' +
      (q ? '<span class="section-sub">关键词：「' + escapeHtml(q) + "」</span>" : '<span class="section-sub">输入关键词查找资源</span>') +
      "</div>" +
      filterbar +
      '<div id="searchResults">' + gridHTML(runFilter(q, cat)) + "</div>";

    highlightSidebar(cat, null);

    /* 页面内实时筛选 */
    const input = document.getElementById("searchInputPage");
    const sel = document.getElementById("searchCat");
    const results = document.getElementById("searchResults");
    let t = null;
    if (input) {
      input.addEventListener("input", () => {
        clearTimeout(t);
        t = setTimeout(() => {
          results.innerHTML = gridHTML(runFilter(input.value, sel.value));
        }, 200);
      });
    }
    if (sel) {
      sel.addEventListener("change", () => {
        results.innerHTML = gridHTML(runFilter(input ? input.value : q, sel.value));
      });
    }
    const clearBtn = document.getElementById("clearSearch");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => { location.hash = "#/search"; });
    }
  }

  /* ---------- 详情页 ---------- */
  function renderDetail(id) {
    const item = getResourceById(id);
    if (!item) { renderNotFound("资源不存在或已下架"); return; }

    const crumbs = [
      { label: item.category, href: "#/category/" + encodeURIComponent(item.category) },
      ...(item.subcategory ? [{ label: item.subcategory, href: "#/category/" + encodeURIComponent(item.category) + "/" + encodeURIComponent(item.subcategory) }] : []),
      { label: item.title },
    ];

    const tags = (item.tags || []).map((t) => '<span class="tag">' + escapeHtml(t) + "</span>").join("");

    const linksHTML = (item.links || []).map((lk, i) => {
      const hasPw = lk.password && String(lk.password).trim() !== "";
      const pwBlock = hasPw
        ? '<div class="link-row" style="margin-top:10px">' +
            '<span class="pw-label">访问密码</span>' +
            '<span class="pw-value hidden" data-pw>' + escapeHtml(lk.password) + "</span>" +
            '<button class="btn" data-action="toggle-pw">显示</button>' +
            '<button class="btn" data-action="copy" data-copy="' + escapeHtml(lk.password) + '">复制密码</button>' +
          "</div>"
        : '<div class="link-row" style="margin-top:10px"><span class="pw-label">无需提取码</span></div>';
      return (
        '<div class="link-card">' +
          '<div class="link-head"><span class="link-name">' + escapeHtml(lk.name || "网盘链接") + "</span>" +
            '<span class="link-tag">第 ' + (i + 1) + " 个</span></div>" +
          '<div class="link-row">' +
            '<span class="link-url" title="' + escapeHtml(lk.url) + '">' + escapeHtml(lk.url) + "</span>" +
            '<a class="btn primary" href="' + escapeHtml(lk.url) + '" target="_blank" rel="noopener">前往下载 ›</a>' +
          "</div>" + pwBlock +
        "</div>"
      );
    }).join("");

    const related = RESOURCES.filter((r) => r.category === item.category && r.id !== item.id).slice(0, 4);
    const relatedHTML = related.length
      ? '<section class="related section"><div class="section-head"><h2>📎 相关推荐</h2>' +
        '<span class="section-sub">同分类其他资源</span></div>' + gridHTML(related) + "</section>"
      : "";

    content.innerHTML =
      breadcrumb(crumbs) +
      '<div class="detail">' +
        '<div class="detail-cover"><img src="' + coverOf(item) + '" alt="' + escapeHtml(item.title) + '" /></div>' +
        "<div>" +
          '<h1 class="detail-title">' + escapeHtml(item.title) + "</h1>" +
          '<div class="detail-meta">' +
            '<span class="meta-line">📁 ' + escapeHtml(item.category) + (item.subcategory ? " / " + escapeHtml(item.subcategory) : "") + "</span>" +
            '<span class="meta-line">🕒 更新于 ' + escapeHtml(item.date) + "</span>" +
            tags +
          "</div>" +
          '<div class="detail-desc">' + escapeHtml(item.description || item.brief) + "</div>" +
          '<h3 class="links-title">🔗 网盘下载（' + (item.links ? item.links.length : 0) + "）</h3>" +
          (linksHTML || '<div class="empty">暂无下载链接</div>') +
        "</div>" +
      "</div>" +
      relatedHTML;

    highlightSidebar(item.category, item.subcategory);
  }

  function renderNotFound(msg) {
    content.innerHTML = '<div class="empty"><div class="big">🫥</div>' + escapeHtml(msg || "页面不存在") +
      '<div style="margin-top:14px"><a class="btn primary" href="#/">返回首页</a></div></div>';
    highlightSidebar(null, null);
  }

  /* ---------- 路由 ---------- */
  function parseHash() {
    const h = location.hash.slice(1) || "/";
    if (h.indexOf("/search") === 0) {
      const qs = h.slice("/search".length);
      const params = new URLSearchParams(qs.indexOf("?") === 0 ? qs.slice(1) : qs);
      return { name: "search", q: params.get("q") || "", cat: params.get("cat") || "" };
    }
    const parts = h.split("/").filter(Boolean);
    if (parts.length === 0) return { name: "home" };
    if (parts[0] === "category") {
      return { name: "category", cat: decodeURIComponent(parts[1] || ""), sub: decodeURIComponent(parts[2] || "") };
    }
    if (parts[0] === "resource") return { name: "resource", id: decodeURIComponent(parts[1] || "") };
    return { name: "home" };
  }

  function router() {
    const route = parseHash();
    window.scrollTo({ top: 0, behavior: "auto" });
    if (route.name === "home") renderHome();
    else if (route.name === "category") renderCategory(route.cat, route.sub);
    else if (route.name === "search") renderSearch(route.q, route.cat);
    else if (route.name === "resource") renderDetail(route.id);
    else renderNotFound();

    /* 移动端：路由切换后关闭侧边栏 */
    closeSidebar();
  }

  /* ---------- 事件委托：密码显示/复制 ---------- */
  content.addEventListener("click", (e) => {
    const toggle = e.target.closest('[data-action="toggle-pw"]');
    if (toggle) {
      const box = toggle.parentElement.querySelector("[data-pw]");
      if (box) {
        const hidden = box.classList.toggle("hidden");
        toggle.textContent = hidden ? "显示" : "隐藏";
      }
      return;
    }
    const copy = e.target.closest('[data-action="copy"]');
    if (copy) {
      copyText(copy.getAttribute("data-copy"));
      return;
    }
  });

  /* ---------- 搜索框（顶部） ---------- */
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = searchInput.value.trim();
    location.hash = "#/search" + (q ? "?q=" + encodeURIComponent(q) : "");
  });

  /* ---------- 侧边栏（移动端） ---------- */
  function openSidebar() { sidebar.classList.add("open"); backdrop.classList.add("show"); }
  function closeSidebar() { sidebar.classList.remove("open"); backdrop.classList.remove("show"); }
  document.getElementById("menuToggle").addEventListener("click", openSidebar);
  document.getElementById("sidebarClose").addEventListener("click", closeSidebar);
  backdrop.addEventListener("click", closeSidebar);

  /* ---------- 深色模式 ---------- */
  const themeToggle = document.getElementById("themeToggle");
  function applyTheme(theme) {
    if (theme === "dark") document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
  }
  let savedTheme = null;
  try { savedTheme = localStorage.getItem("yinpan-theme"); } catch (e) {}
  applyTheme(savedTheme);
  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("yinpan-theme", next); } catch (e) {}
  });

  /* ---------- 启动 ---------- */
  buildSidebar();
  window.addEventListener("hashchange", router);
  if (!location.hash) location.hash = "#/";
  else router();
})();
