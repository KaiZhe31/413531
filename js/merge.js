/*
 * 记录级合并（防止同步时丢记录）
 *
 * 原则：同步只会“合并”，不会“覆盖”。
 * - 每条记录有 id；改动时自动记 _u（最后修改时间）
 * - 删除时自动记“墓碑” del["数组名:id"] = 删除时间（通过和上次保存的快照对比得出，不需要改每个删除的地方）
 * - 合并 = 两边记录取并集；同一条记录取 _u 较新的；有更新的墓碑才算删除
 * - 设置类字段（分类、汇率、预算…）以 _t 较新的一边为准
 */
var LM = (function () {
  var ARR = ["tx", "goals", "wish", "ann", "accounts", "rec"];
  var KEEP_DEL_MS = 400 * 24 * 3600 * 1000;
  var BASE = {};

  function clone(o) {
    return JSON.parse(JSON.stringify(o));
  }
  function stable(v) {
    if (Array.isArray(v)) return "[" + v.map(stable).join(",") + "]";
    if (v && typeof v === "object")
      return (
        "{" +
        Object.keys(v)
          .sort()
          .filter(function (k) {
            return v[k] !== undefined;
          })
          .map(function (k) {
            return JSON.stringify(k) + ":" + stable(v[k]);
          })
          .join(",") +
        "}"
      );
    return JSON.stringify(v);
  }
  function hash(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }
  function sig(i) {
    var c = Object.assign({}, i);
    delete c._u;
    return stable(c);
  }

  // 给没有 id 的旧记录补一个“由内容决定”的 id（不同设备算出来一样，不会重复）
  function ids(o) {
    ARR.forEach(function (k) {
      if (!Array.isArray(o[k])) return;
      o[k].forEach(function (i) {
        if (i && typeof i === "object" && !i.id) {
          var c = Object.assign({}, i);
          delete c._u;
          delete c.last;
          i.id = "L" + hash(k + stable(c));
        }
      });
    });
    return o;
  }

  function rebase(scope, o) {
    var b = {};
    ARR.forEach(function (k) {
      var m = {};
      (o[k] || []).forEach(function (i) {
        if (i && i.id) m[i.id] = sig(i);
      });
      b[k] = m;
    });
    BASE[scope] = b;
  }
  function ensure(scope, o) {
    if (!BASE[scope]) rebase(scope, o);
  }

  // 每次保存前调用：找出新增/修改/删除，记下 _u 和墓碑
  function track(scope, o) {
    ids(o);
    var b = BASE[scope];
    if (!b) {
      rebase(scope, o);
      return;
    }
    var now = Date.now();
    o.del = o.del || {};
    ARR.forEach(function (k) {
      var cur = {},
        old = b[k] || {};
      (o[k] || []).forEach(function (i) {
        if (!i || !i.id) return;
        cur[i.id] = 1;
        if (old[i.id] !== sig(i)) {
          i._u = now;
          delete o.del[k + ":" + i.id]; // 重新出现（如撤销删除）就撤掉墓碑
        }
      });
      Object.keys(old).forEach(function (id) {
        if (!cur[id]) o.del[k + ":" + id] = now;
      });
    });
    Object.keys(o.del).forEach(function (d) {
      if (now - o.del[d] > KEEP_DEL_MS) delete o.del[d];
    });
    rebase(scope, o);
  }

  // 合并：返回新对象，不修改入参
  function merge(L, R) {
    L = ids(clone(L));
    R = ids(clone(R));
    var Lt = L._t || 0,
      Rt = R._t || 0;
    var remoteBase = Rt > Lt; // 设置类字段以较新的一边为准
    var out = clone(remoteBase ? R : L);
    out.pin = L.pin;
    out._t = Math.max(Lt, Rt);
    var del = {};
    [R.del || {}, L.del || {}].forEach(function (d) {
      Object.keys(d).forEach(function (k) {
        del[k] = Math.max(del[k] || 0, d[k]);
      });
    });
    ARR.forEach(function (k) {
      var la = Array.isArray(L[k]) ? L[k] : [],
        ra = Array.isArray(R[k]) ? R[k] : [];
      var map = {},
        order = [];
      function pick(item, fromRemote) {
        if (!item || !item.id) return;
        var cur = map[item.id];
        if (!cur) {
          map[item.id] = { it: item, remote: fromRemote };
          order.push(item.id);
          return;
        }
        var cu = cur.it._u || 0,
          iu = item._u || 0;
        // 时间相同则以“整体更新”的那一边为准
        var win = iu > cu || (iu === cu && fromRemote === remoteBase);
        if (win) {
          if (k === "tx" && !item.img && cur.it.img) item.img = cur.it.img;
          map[item.id] = { it: item, remote: fromRemote };
        } else if (k === "tx" && !cur.it.img && item.img) cur.it.img = item.img;
      }
      la.forEach(function (i) {
        pick(i, false);
      });
      ra.forEach(function (i) {
        pick(i, true);
      });
      out[k] = order
        .map(function (id) {
          return map[id].it;
        })
        .filter(function (i) {
          var d = del[k + ":" + i.id];
          if (d === undefined) return true;
          if ((i._u || 0) > d) {
            delete del[k + ":" + i.id];
            return true;
          }
          return false;
        });
    });
    out.del = del;
    return out;
  }

  // 内容是否相同（忽略数组顺序、_t、pin、图片、私人记录）
  function canon(o) {
    var c = clone(o);
    delete c.pin;
    delete c._t;
    ARR.forEach(function (k) {
      if (!Array.isArray(c[k])) return;
      c[k] = c[k]
        .filter(function (i) {
          return !i.p;
        })
        .map(function (i) {
          delete i.img;
          return i;
        })
        .sort(function (a, b) {
          return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
        });
    });
    return stable(c);
  }
  function same(a, b) {
    return canon(a) === canon(b);
  }

  // 滚动备份（最近 3 份，不含图片）
  var BK = ["ledger.bak", "ledger.bak.1", "ledger.bak.2"];
  var lastBk = 0;
  function snapshot(o, force) {
    var now = Date.now();
    if (!force && now - lastBk < 10 * 60 * 1000) return;
    if (!o || !((o.tx || []).length || (o.goals || []).length || (o.accounts || []).length)) return;
    var c = clone(o);
    (c.tx || []).forEach(function (t) {
      delete t.img;
    });
    var s = JSON.stringify(c);
    try {
      var prev = localStorage.getItem(BK[0]);
      if (prev === s) return;
      try {
        if (prev) {
          var p1 = localStorage.getItem(BK[1]);
          if (p1) localStorage.setItem(BK[2], p1);
          localStorage.setItem(BK[1], prev);
        }
        localStorage.setItem(BK[0], s);
      } catch (e) {
        localStorage.removeItem(BK[2]);
        localStorage.removeItem(BK[1]);
        localStorage.setItem(BK[0], s);
      }
      lastBk = now;
    } catch (e) {}
  }
  function backups() {
    var r = [];
    BK.forEach(function (k) {
      try {
        var b = JSON.parse(localStorage.getItem(k));
        if (b && b.accounts) r.push(b);
      } catch (e) {}
    });
    return r;
  }

  return {
    track: track,
    rebase: rebase,
    ensure: ensure,
    merge: merge,
    same: same,
    ids: ids,
    snapshot: snapshot,
    backups: backups,
  };
})();
