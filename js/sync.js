(function () {
  var CK = "ledger.fb",
    cfg = null;
  try {
    cfg = JSON.parse(localStorage.getItem(CK) || "null");
  } catch (e) {}
  window.SYNC = 1;
  var enc = new TextEncoder(),
    dec = new TextDecoder(),
    keyP = null,
    space = "",
    MYID = "",
    NAMES = {};
  function b64(buf) {
    var s = "",
      b = new Uint8Array(buf);
    for (var i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
    return btoa(s);
  }
  function ub64(s) {
    var r = atob(s),
      b = new Uint8Array(r.length);
    for (var i = 0; i < r.length; i++) b[i] = r.charCodeAt(i);
    return b;
  }
  function hex(buf) {
    return Array.prototype.map
      .call(new Uint8Array(buf), function (x) {
        return ("0" + x.toString(16)).slice(-2);
      })
      .join("");
  }
  async function init() {
    if (keyP) return;
    var base = await crypto.subtle.importKey("raw", enc.encode(cfg.pass), "PBKDF2", false, [
      "deriveKey",
    ]);
    keyP = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: enc.encode("ledger-salt-v1"), iterations: 100000, hash: "SHA-256" },
      base,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    );
    space = hex(await crypto.subtle.digest("SHA-256", enc.encode("space:" + cfg.pass))).slice(
      0,
      32,
    );
  }
  async function en(s) {
    var iv = crypto.getRandomValues(new Uint8Array(12)),
      c = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, keyP, enc.encode(s)),
      o = new Uint8Array(12 + c.byteLength);
    o.set(iv);
    o.set(new Uint8Array(c), 12);
    return b64(o);
  }
  async function de(s) {
    try {
      var b = ub64(s),
        p = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b.slice(0, 12) }, keyP, b.slice(12));
      return dec.decode(p);
    } catch (e) {
      return null;
    }
  }
  function url(p) {
    return (
      cfg.url.replace(/\/+$/, "") +
      "/s/" +
      space +
      "/" +
      p.split("/").map(encodeURIComponent).join("/") +
      ".json"
    );
  }
  async function rd(p) {
    var r = await fetch(url(p), { cache: "no-store" });
    if (!r.ok) throw new Error("http " + r.status);
    return r.json();
  }
  async function toDoc(v) {
    if (!v || !v.c) return null;
    var j = await de(v.c);
    // 解密失败不能当成“云端没有数据”，否则会用本机数据覆盖云端
    if (j == null) throw new Error("decrypt");
    return { json: j, t: v.t || 0, name: v.n || "" };
  }
  async function toDocSafe(v) {
    try {
      return await toDoc(v);
    } catch (e) {
      return null;
    }
  }
  function snapOf(d, id) {
    return {
      exists: !!d,
      id: id,
      data: function () {
        return d || {};
      },
    };
  }
  function docRef(p) {
    var id = p.split("/").pop(),
      priv = p.indexOf("data/users/") === 0;
    return {
      get: async function () {
        if (priv) return snapOf(null, id);
        await init();
        return snapOf(await toDoc(await rd(p)), id);
      },
      set: async function (d) {
        if (priv) return;
        await init();
        var r = await fetch(url(p), {
          method: "PUT",
          body: JSON.stringify({ c: await en(d.json), t: d.t || Date.now(), n: cfg.name }),
        });
        if (!r.ok) throw new Error("http " + r.status);
      },
      onSnapshot: function (cb, eb) {
        if (priv) return function () {};
        var lastT,
          first = true,
          run = async function () {
            if (document.hidden && !first) return;
            try {
              await init();
              var t = await rd(p + "/t");
              if (first || t !== lastT) {
                first = false;
                lastT = t;
                cb(snapOf(await toDoc(await rd(p)), id));
              }
            } catch (e) {
              if (eb && first) eb(e);
            }
          };
        run();
        var iv = setInterval(run, 6000);
        return function () {
          clearInterval(iv);
        };
      },
    };
  }
  function colRef(p) {
    return {
      onSnapshot: function (cb) {
        var sig,
          run = async function () {
            if (document.hidden && sig !== undefined) return;
            try {
              await init();
              var r = await fetch(url(p) + "?shallow=true", { cache: "no-store" });
              if (!r.ok) return;
              var keys = Object.keys((await r.json()) || {}),
                ts = await Promise.all(
                  keys.map(function (k) {
                    return rd(p + "/" + k + "/t");
                  }),
                ),
                s = keys
                  .map(function (k, i) {
                    return k + ":" + ts[i];
                  })
                  .join(",");
              if (s === sig) return;
              sig = s;
              var raw = (await rd(p)) || {},
                docs = [];
              for (var id in raw) {
                var d = await toDocSafe(raw[id]);
                if (d) {
                  NAMES[id] = d.name;
                  (function (dd, ii) {
                    docs.push({
                      id: ii,
                      data: function () {
                        return dd;
                      },
                    });
                  })(d, id);
                }
              }
              cb({ docs: docs });
            } catch (e) {}
          };
        run();
        setInterval(run, 6000);
      },
    };
  }
  var db = { doc: docRef, collection: colRef };
  var user = {
    id: async function () {
      MYID =
        "u_" +
        hex(await crypto.subtle.digest("SHA-256", enc.encode("user:" + cfg.name))).slice(0, 10);
      NAMES[MYID] = cfg.name;
      return MYID;
    },
    profiles: async function (ids) {
      var o = {};
      ids.forEach(function (i) {
        o[i] = { name: i === MYID ? cfg.name : NAMES[i] || "对方" };
      });
      return o;
    },
    me: async function () {
      return { name: cfg.name };
    },
    isOwner: function () {
      return true;
    },
  };
  var dl = {
    save: async function (r) {
      var b = r.data instanceof Blob ? r.data : new Blob([r.data], { type: "text/csv" }),
        a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.download = r.filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        a.remove();
      }, 500);
      return { status: "saved" };
    },
  };
  window.claude = {
    use: async function (n) {
      if (n === "downloads") return dl;
      if (!cfg || !cfg.url || !cfg.pass || !cfg.name) return null;
      if (n === "db") return db;
      if (n === "user") return user;
      return null;
    },
  };
  function mkCode(u, p) {
    return (
      "LG1-" +
      btoa(unescape(encodeURIComponent(JSON.stringify({ u: u, p: p }))))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "")
    );
  }
  function rdCode(s) {
    try {
      s = String(s || "").trim();
      var i = s.indexOf("LG1-");
      if (i < 0) return null;
      s = s
        .slice(i + 4)
        .replace(/[^A-Za-z0-9_-]/g, "")
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      while (s.length % 4) s += "=";
      var o = JSON.parse(decodeURIComponent(escape(atob(s))));
      return o && o.u && o.p ? o : null;
    } catch (e) {
      return null;
    }
  }
  function cpy(t, msg) {
    var done = function () {
      toast(msg);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(done, function () {
        prompt("请手动复制：", t);
      });
    } else prompt("请手动复制：", t);
  }
  window.setupSync = function (pre) {
    var c = Object.assign({}, cfg || {}, pre && pre.u ? { url: pre.u, pass: pre.p } : {});
    var m = openSheet(
      '<b>同步设置</b><div class="mute" style="margin:6px 0">你们两个人填一样的「数据库网址」和「共同密码」，「名字」要不一样。也可以直接粘贴「同步码」自动填好。</div><label>同步码（粘贴后自动填入网址和密码）</label><input id="sc" placeholder="LG1-..."><label>Firebase 数据库网址</label><input id="s1" placeholder="https://xxx-default-rtdb.firebaseio.com" value="' +
        esc(c.url || "") +
        '"><label>共同密码（数据用它加密，两人必须一样）</label><input id="s2" type="password" value="' +
        esc(c.pass || "") +
        '"><label>你的名字（两人不同）</label><input id="s3" value="' +
        esc(c.name || "") +
        '"><button class="btn" id="ok">保存并连接</button>' +
        (cfg
          ? '<button class="btn" id="cc" style="background:var(--accbg);color:var(--acc);box-shadow:none">复制同步码</button><button class="btn" id="cl" style="background:var(--accbg);color:var(--acc);box-shadow:none;margin-top:8px">复制同步链接（发给对方点开即可）</button><button class="btn ghost" id="off">断开同步</button>'
          : ""),
    );
    var sc = m.querySelector("#sc");
    sc.oninput = function () {
      var o = rdCode(sc.value);
      if (o) {
        m.querySelector("#s1").value = o.u;
        m.querySelector("#s2").value = o.p;
        toast("已自动填入，请填写你的名字");
      }
    };
    var cc = m.querySelector("#cc");
    if (cc && cfg) {
      cc.onclick = function () {
        cpy(mkCode(cfg.url, cfg.pass), "同步码已复制");
      };
      m.querySelector("#cl").onclick = function () {
        cpy(
          location.origin + location.pathname + "#sync=" + mkCode(cfg.url, cfg.pass),
          "同步链接已复制",
        );
      };
    }
    m.querySelector("#ok").onclick = function () {
      var u = m.querySelector("#s1").value.trim(),
        p = m.querySelector("#s2").value,
        n = m.querySelector("#s3").value.trim();
      if (!/^https:\/\/.+firebase/.test(u) || p.length < 4 || !n) {
        toast("请填完整：网址要是 https 开头的 Firebase 网址，密码至少 4 个字");
        return;
      }
      try {
        localStorage.setItem(CK, JSON.stringify({ url: u, pass: p, name: n }));
        localStorage.setItem("ledger.shared", "1");
      } catch (e) {}
      location.reload();
    };
    var of = m.querySelector("#off");
    if (of)
      of.onclick = function () {
        try {
          localStorage.removeItem(CK);
        } catch (e) {}
        location.reload();
      };
  };
  window.addEventListener("load", function () {
    var h = location.hash;
    if (h.indexOf("#sync=") !== 0) return;
    var o = rdCode(h.slice(6));
    try {
      history.replaceState(null, "", location.pathname + location.search);
    } catch (e) {}
    if (o && (!cfg || cfg.url !== o.u || cfg.pass !== o.p))
      setTimeout(function () {
        window.setupSync(o);
      }, 300);
  });
})();
