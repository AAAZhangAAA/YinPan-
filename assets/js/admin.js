/* =============================================================================
 *  影盘集 · 资源管理后台逻辑（admin.html）
 *  功能：表单添加资源 -> 生成可粘贴代码 / 导出完整 data.js（复制 + 下载）
 *  安全：后台设有访问密码门（站长本人才能添加资源）。密码以 SHA-256 哈希
 *        形式保存在本文件 ADMIN_HASH 中，不存明文；校验通过前不会初始化表单，
 *        因此无法绕过密码门直接操作。
 *  注意：纯前端，无后端。新增资源先存浏览器 localStorage 方便暂存，
 *        最终需「导出 data.js」覆盖 assets/js/data.js 才会真正生效。
 * ========================================================================== */

/* —— 访问密码哈希（SHA-256）。默认密码 yinpan@2026 ——
 * 修改密码：在后台登录页底部「修改访问密码」里输入新密码，
 * 会生成新的哈希，把下面这串替换掉即可。 */
var ADMIN_HASH = "c1d3e07018ee928f63915081ac17fa8ddad7be59cbac3875280b19ecbf4a6c57";

(function () {
  "use strict";

  /* ---------- 密码哈希工具 ---------- */
  function sha256Hex(str) {
    if (window.crypto && crypto.subtle) {
      return crypto.subtle.digest("SHA-256", new TextEncoder().encode(str))
        .then(function (buf) {
          return [].map.call(new Uint8Array(buf), function (b) {
            return b.toString(16).padStart(2, "0");
          }).join("");
        });
    }
    // 非安全上下文（如 http 局域网）降级提示
    return Promise.reject(new Error("insecure"));
  }

  /* ---------- 密码门 ---------- */
  var gate = document.getElementById("gate");
  var gatePw = document.getElementById("gatePw");
  var gateBtn = document.getElementById("gateBtn");
  var gateErr = document.getElementById("gateErr");
  var adminWrap = document.getElementById("adminWrap");

  function showGate() {
    if (gate) gate.style.display = "grid";
    if (adminWrap) adminWrap.style.display = "none";
  }
  function unlock() {
    try { sessionStorage.setItem("yinpan-auth", "1"); } catch (e) {}
    if (gate) gate.style.display = "none";
    if (adminWrap) adminWrap.style.display = "block";
    initAdmin();
  }
  function tryUnlock() {
    var val = (gatePw && gatePw.value) || "";
    if (!val) { if (gateErr) gateErr.textContent = "请输入访问密码"; return; }
    sha256Hex(val).then(function (h) {
      if (h === ADMIN_HASH) { unlock(); }
      else { if (gateErr) gateErr.textContent = "密码错误，仅限站长本人访问"; }
    }).catch(function () {
      if (gateErr) gateErr.textContent = "请在 https 或 localhost 下打开本页以使用密码门";
    });
  }

  if (gateBtn) gateBtn.addEventListener("click", tryUnlock);
  if (gatePw) gatePw.addEventListener("keydown", function (e) {
    if (e.key === "Enter") tryUnlock();
  });

  // 修改密码：生成新哈希
  var genHashBtn = document.getElementById("genHashBtn");
  var newPw = document.getElementById("newPw");
  var hashOut = document.getElementById("hashOut");
  if (genHashBtn) genHashBtn.addEventListener("click", function () {
    var v = (newPw && newPw.value) || "";
    if (!v) { if (hashOut) hashOut.textContent = "请先输入新密码"; return; }
    sha256Hex(v).then(function (h) {
      if (hashOut) hashOut.textContent = h;
    }).catch(function () {
      if (hashOut) hashOut.textContent = "（安全上下文不可用，请改用 https/localhost）";
    });
  });

  // 已在本会话解锁则直接进入；否则显示密码门（不初始化表单）
  var authed = false;
  try { authed = sessionStorage.getItem("yinpan-auth") === "1"; } catch (e) {}
  if (authed) { unlock(); } else { showGate(); return; }

  /* =========================================================================
   *  以下为后台主体逻辑，仅在通过密码门后执行
   * ========================================================================= */
  function initAdmin() {
    var $ = function (s) { return document.querySelector(s); };
    var form = $("#resForm");
    var catSelect = $("#catSelect");
    var subSelect = $("#subSelect");
    var linksContainer = $("#linksContainer");
    var addedList = $("#addedList");
    var LS_KEY = "yinpan-added";

    function loadAdded() {
      try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch (e) { return []; }
    }
    function saveAdded() {
      try { localStorage.setItem(LS_KEY, JSON.stringify(added)); } catch (e) {}
    }
    var added = loadAdded();

    /* ---------- 工具 ---------- */
    function esc(s) {
      return String(s == null ? "" : s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }
    function jq(s) { return JSON.stringify(s == null ? "" : s); }
    function today() { return new Date().toISOString().slice(0, 10); }

    function toast(msg) {
      var el = $("#toast");
      el.textContent = msg;
      el.classList.add("show");
      clearTimeout(toast._t);
      toast._t = setTimeout(function () { el.classList.remove("show"); }, 1900);
    }
    function copyText(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { toast("已复制到剪贴板"); }).catch(fallback);
      } else { fallback(); }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); toast("已复制到剪贴板"); } catch (e) {}
        document.body.removeChild(ta);
      }
    }

    /* ---------- 分类下拉 ---------- */
    catSelect.innerHTML = CATEGORIES.map(function (c) {
      return '<option value="' + esc(c.name) + '">' + esc(c.name) + "</option>";
    }).join("");
    function refreshSub() {
      var cat = CATEGORIES.filter(function (c) { return c.name === catSelect.value; })[0];
      var subs = (cat && cat.subs) || [];
      if (!subs.length) {
        subSelect.innerHTML = '<option value="">（该分类无二级分类）</option>';
        subSelect.disabled = true;
      } else {
        subSelect.disabled = false;
        subSelect.innerHTML = '<option value="">不指定</option>' +
          subs.map(function (s) { return '<option value="' + esc(s) + '">' + esc(s) + "</option>"; }).join("");
      }
    }
    catSelect.addEventListener("change", refreshSub);
    refreshSub();

    /* ---------- 网盘链接行 ---------- */
    function linkRow(name, url, pw) {
      var div = document.createElement("div");
      div.className = "link-row";
      div.innerHTML =
        '<input class="lk-name" placeholder="网盘名(如夸克)" value="' + esc(name || "") + '" />' +
        '<input class="lk-url" placeholder="网盘链接 URL" value="' + esc(url || "") + '" />' +
        '<input class="lk-pw" placeholder="提取码(可空)" value="' + esc(pw || "") + '" />' +
        '<button type="button" class="lk-del" title="删除此链接">✕</button>';
      div.querySelector(".lk-del").addEventListener("click", function () { div.remove(); });
      return div;
    }
    linksContainer.appendChild(linkRow());
    $("#addLinkBtn").addEventListener("click", function () { linksContainer.appendChild(linkRow()); });

    /* ---------- ID 生成 ---------- */
    function genId(cat) {
      var map = { "纪录片": "d", "电影": "m", "电视剧": "t", "综艺": "v", "插件工具": "p" };
      var p = map[cat] || "r";
      return p + "-" + Date.now().toString(36).slice(-5) + Math.floor(Math.random() * 9);
    }

    /* ---------- 提交 ---------- */
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var title = $("#f-title").value.trim();
      var brief = $("#f-brief").value.trim();
      var cat = catSelect.value;
      if (!title || !brief || !cat) { toast("请填写标题、简介并选择分类"); return; }

      var links = [].slice.call(linksContainer.querySelectorAll(".link-row")).map(function (r) {
        return {
          name: r.querySelector(".lk-name").value.trim(),
          url: r.querySelector(".lk-url").value.trim(),
          password: r.querySelector(".lk-pw").value.trim(),
        };
      }).filter(function (l) { return l.url; });
      if (!links.length) { toast("请至少填写一个带链接的网盘地址"); return; }

      var item = {
        id: genId(cat),
        title: title,
        brief: brief,
        description: $("#f-desc").value.trim() || brief,
        category: cat,
        cover: $("#f-cover").value.trim(),
        tags: $("#f-tags").value.split(/[,，]/).map(function (s) { return s.trim(); }).filter(Boolean),
        recommended: $("#f-rec").checked,
        date: $("#f-date").value || today(),
        links: links,
      };
      var sub = subSelect.disabled ? "" : subSelect.value;
      if (sub) item.subcategory = sub;

      added.push(item);
      saveAdded();
      renderAdded();
      form.reset();
      $("#f-date").value = today();
      refreshSub();
      toast("已加入列表，记得最后导出 data.js 生效");
    });

    /* ---------- 单条代码生成 ---------- */
    function singleCode(it) {
      var lines = [
        "  {",
        "    id: " + jq(it.id) + ",",
        "    title: " + jq(it.title) + ",",
        "    brief: " + jq(it.brief) + ",",
        "    description: " + jq(it.description) + ",",
        "    category: " + jq(it.category) + ",",
      ];
      if (it.subcategory) lines.push("    subcategory: " + jq(it.subcategory) + ",");
      lines.push("    cover: " + jq(it.cover || "") + ",");
      lines.push("    tags: [" + it.tags.map(jq).join(", ") + "],");
      lines.push("    recommended: " + (it.recommended ? "true" : "false") + ",");
      lines.push("    date: " + jq(it.date) + ",");
      lines.push("    links: [");
      lines.push(it.links.map(function (l) {
        return "      { name: " + jq(l.name) + ", url: " + jq(l.url) + ", password: " + jq(l.password) + " }";
      }).join(",\n"));
      lines.push("    ]");
      lines.push("  }");
      return lines.join("\n");
    }

    /* ---------- 已添加列表渲染 ---------- */
    function renderAdded() {
      if (!added.length) {
        addedList.innerHTML = '<p class="muted">还没有添加任何资源。</p>';
        return;
      }
      addedList.innerHTML = added.map(function (it, i) {
        return '<div class="admin-card" style="margin-bottom:12px">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
            "<strong>" + esc(it.title) + "</strong>" +
            '<button class="btn" data-del="' + i + '">删除</button>' +
          "</div>" +
          '<pre class="code">' + esc(singleCode(it)) + "</pre>" +
          '<button class="btn" data-copy="' + i + '">复制此条代码</button>' +
        "</div>";
      }).join("");
      [].slice.call(addedList.querySelectorAll("[data-del]")).forEach(function (b) {
        b.addEventListener("click", function () {
          added.splice(+b.getAttribute("data-del"), 1); saveAdded(); renderAdded(); toast("已删除");
        });
      });
      [].slice.call(addedList.querySelectorAll("[data-copy]")).forEach(function (b) {
        b.addEventListener("click", function () { copyText(singleCode(added[+b.getAttribute("data-copy")])); });
      });
    }

    /* ---------- 导出 data.js ---------- */
    function buildDataJs() {
      var header = "/* 影盘集 · 资源数据文件（由后台导出，已含新增资源） */\n";
      return header +
        "const CATEGORIES = " + JSON.stringify(CATEGORIES, null, 2) + ";\n\n" +
        "const RESOURCES = " + JSON.stringify(RESOURCES.concat(added), null, 2) + ";\n";
    }
    $("#exportBtn").addEventListener("click", function () {
      var text = buildDataJs();
      $("#exportOut").textContent = text;
      copyText(text);
      toast("已生成 data.js 并复制到剪贴板，也可点下载");
    });
    $("#downloadBtn").addEventListener("click", function () {
      var text = buildDataJs();
      $("#exportOut").textContent = text;
      var blob = new Blob([text], { type: "text/javascript" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "data.js";
      a.click();
      toast("已开始下载 data.js");
    });
    $("#resetBtn").addEventListener("click", function () {
      if (confirm("清空本机暂存的所有已添加资源？此操作不可恢复。")) {
        added = []; saveAdded(); renderAdded(); toast("已清空");
      }
    });

    /* ---------- 直接保存到 GitHub ---------- */
    var ghRepo = $("#ghRepo"), ghToken = $("#ghToken"), ghBanner = $("#ghBanner");
    try {
      var svRepo = localStorage.getItem("yinpan-ghrepo");
      var svToken = localStorage.getItem("yinpan-ghtoken");
      if (svRepo) ghRepo.value = svRepo;
      if (svToken) ghToken.value = svToken;
    } catch (e) {}
    function ghSetStatus(msg, type) {
      // type: "busy" | "ok" | "err"
      if (ghBanner) {
        ghBanner.className = "gh-banner " + (type || "busy");
        ghBanner.textContent = msg;
      }
    }
    $("#ghSaveToken").addEventListener("click", function () {
      try {
        localStorage.setItem("yinpan-ghrepo", (ghRepo.value || "").trim());
        localStorage.setItem("yinpan-ghtoken", (ghToken.value || "").trim());
        ghSetStatus("已记住仓库与令牌（仅存于本浏览器）", "ok");
      } catch (e) { ghSetStatus("保存失败：" + e.message, "err"); }
    });
    function utf8ToBase64(str) { return btoa(unescape(encodeURIComponent(str))); }
    $("#ghPush").addEventListener("click", function () {
      try {
        var repo = (ghRepo.value || "").trim();
        var token = (ghToken.value || "").trim();
        if (!repo || !token) {
          ghSetStatus("❌ 请先填写「访问令牌」再点保存。（仓库名已预填，只需去 GitHub 生成一个带 repo 权限的令牌粘贴进来）", "err");
          return;
        }
        var api = "https://api.github.com/repos/" + repo + "/contents/assets/js/data.js";
        var headers = { "Authorization": "Bearer " + token, "Accept": "application/vnd.github+json" };
        ghSetStatus("⏳ 正在读取仓库当前 data.js …", "busy");
        fetch(api, { headers: headers })
          .then(function (r) {
            if (!r.ok) return r.json().then(function (j) { throw new Error(j.message || ("读取失败 " + r.status)); });
            return r.json();
          })
          .then(function (cur) {
            ghSetStatus("⏳ 正在提交到 GitHub …", "busy");
            return fetch(api, {
              method: "PUT",
              headers: headers,
              body: JSON.stringify({ message: "update resources via admin", content: utf8ToBase64(buildDataJs()), sha: cur.sha })
            });
          })
          .then(function (r) {
            if (!r.ok) return r.json().then(function (j) { throw new Error(j.message || ("提交失败 " + r.status)); });
            return r.json();
          })
          .then(function () {
            ghSetStatus("✅ 已保存到 GitHub！GitHub Pages 约 1–2 分钟后自动更新，粉丝刷新即可看到。", "ok");
            added = []; saveAdded(); renderAdded();
            toast("已保存到 GitHub");
          })
          .catch(function (err) {
            var extra = "";
            if (/401|bad credentials/i.test(err.message)) extra = "\n→ 令牌无效或权限不足：请重新生成带 repo 权限的 PAT。";
            else if (/404/i.test(err.message)) extra = "\n→ 仓库名有误或令牌无权访问该仓库，请检查 owner/name。";
            ghSetStatus("❌ " + err.message + extra, "err");
          });
      } catch (e) {
        ghSetStatus("❌ 本地出错：" + e.message, "err");
      }
    });

    /* ---------- 初始化 ---------- */
    $("#f-date").value = today();
    renderAdded();
  }
})();
