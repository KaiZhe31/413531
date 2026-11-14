var KEY = "ledger.v1";
var TYPES = {
  cash: ["现金", "💵"],
  bank: ["银行卡", "🏦"],
  wallet: ["电子钱包", "📱"],
  credit: ["信用卡", "💳"],
  invest: ["投资", "📈"],
  saving: ["储蓄", "🐷"],
  prepaid: ["预付卡 / Prepaid", "📶"],
  other: ["其他", "👛"],
};
var CURS_MAIN = ["MYR", "SGD", "CNY"],
  CURS_MORE = ["USD", "EUR", "GBP", "JPY", "HKD", "THB", "IDR", "KRW", "AUD", "TWD", "VND", "PHP", "INR", "NZD", "CAD"],
  CURS = CURS_MAIN.concat(CURS_MORE),
  SYM = {
    MYR: "RM ", SGD: "S$", CNY: "CN¥",
    USD: "US$", EUR: "€", GBP: "£", JPY: "JP¥", HKD: "HK$", THB: "฿", IDR: "Rp ", KRW: "₩",
    AUD: "A$", TWD: "NT$", VND: "₫", PHP: "₱", INR: "₹", NZD: "NZ$", CAD: "C$",
  },
  // 其他币种的默认汇率（1 外币 = ? MYR），只是大概值，请在「更多 → 汇率」里按实际修改
  DEFR = {
    USD: 4.2, EUR: 4.9, GBP: 5.6, JPY: 0.028, HKD: 0.54, THB: 0.13, IDR: 0.00026, KRW: 0.003,
    AUD: 2.75, TWD: 0.135, VND: 0.00017, PHP: 0.073, INR: 0.048, NZD: 2.45, CAD: 3.05,
  };
var EXPC = [
  "餐饮",
  "交通",
  "油费",
  "过路费",
  "购物",
  "水电网络",
  "房租",
  "娱乐",
  "医疗",
  "学习",
  "旅行",
  "其他",
];
var INCC = ["工资", "奖金", "理财", "红包", "兼职", "其他"];
var P = [
  ["Touch 'n Go eWallet", "wallet", "MYR"],
  ["GrabPay", "wallet", "MYR"],
  ["Boost", "wallet", "MYR"],
  ["ShopeePay", "wallet", "MYR"],
  ["Maybank", "bank", "MYR"],
  ["CIMB", "bank", "MYR"],
  ["Public Bank", "bank", "MYR"],
  ["RHB", "bank", "MYR"],
  ["Hong Leong", "bank", "MYR"],
  ["AmBank", "bank", "MYR"],
  ["Bank Islam", "bank", "MYR"],
  ["BSN", "bank", "MYR"],
  ["UOB Malaysia", "bank", "MYR"],
  ["GXBank", "bank", "MYR"],
  ["信用卡", "credit", "MYR"],
  ["ASB", "invest", "MYR"],
  ["Tabung Haji", "saving", "MYR"],
  ["StashAway", "invest", "MYR"],
  ["DBS/POSB", "bank", "SGD"],
  ["OCBC", "bank", "SGD"],
  ["UOB Singapore", "bank", "SGD"],
  ["GrabPay SG", "wallet", "SGD"],
  ["支付宝", "wallet", "CNY"],
  ["微信支付", "wallet", "CNY"],
  ["中国银行", "bank", "CNY"],
  ["Wise", "wallet", "MYR"],
  ["现金", "cash", "MYR"],
  ["Affin Bank", "bank", "MYR"],
  ["Alliance Bank", "bank", "MYR"],
  ["HSBC Malaysia", "bank", "MYR"],
  ["Standard Chartered", "bank", "MYR"],
  ["OCBC Malaysia", "bank", "MYR"],
  ["Bank Rakyat", "bank", "MYR"],
  ["Agrobank", "bank", "MYR"],
  ["Bank Muamalat", "bank", "MYR"],
  ["Citibank", "bank", "MYR"],
  ["BigPay", "wallet", "MYR"],
  ["Setel", "wallet", "MYR"],
  ["Revolut", "wallet", "MYR"],
  ["PayLah!", "wallet", "SGD"],
  ["HSBC Singapore", "bank", "SGD"],
  ["工商银行", "bank", "CNY"],
  ["建设银行", "bank", "CNY"],
  ["招商银行", "bank", "CNY"],
  ["农业银行", "bank", "CNY"],
  ["U Mobile Prepaid", "prepaid", "MYR"],
  ["Hotlink Prepaid", "prepaid", "MYR"],
  ["CelcomDigi Prepaid", "prepaid", "MYR"],
  ["Unifi Mobile Prepaid", "prepaid", "MYR"],
  ["Yoodo", "prepaid", "MYR"],
  ["Tune Talk", "prepaid", "MYR"],
  ["redONE", "prepaid", "MYR"],
  ["XOX", "prepaid", "MYR"],
  ["Buzzme", "prepaid", "MYR"],
  ["Speakout", "prepaid", "MYR"],
  ["Singtel Prepaid", "prepaid", "SGD"],
  ["现金 SGD", "cash", "SGD"],
  ["现金 CNY", "cash", "CNY"],
  ["现金 USD", "cash", "USD"],
  ["现金 EUR", "cash", "EUR"],
  ["现金 JPY", "cash", "JPY"],
  ["现金 THB", "cash", "THB"],
];
var S = load();
migrate();
LM.ensure("mine", S);
LM.snapshot(S);
function migrate() {
  LM.ids(S);
  S.cats = S.cats || { expense: EXPC.slice(), income: INCC.slice() };
  S.rates = S.rates || { MYR: 1, SGD: 3.3, CNY: 0.6 };
  CURS.forEach(function (c) {
    if (!(S.rates[c] > 0)) S.rates[c] = DEFR[c] || 1;
  });
  S.base = S.base || "MYR";
  S.budget = S.budget || {};
  S.rec = S.rec || [];
  S.goals = S.goals || [];
  S.pin = S.pin || "";
  S.ci = S.ci || {};
  S.sub = S.sub || {
    餐饮: ["早餐", "午餐", "晚餐", "宵夜", "饮料", "零食"],
    交通: ["Grab", "公共交通", "停车", "过路费"],
    购物: ["衣服", "日用品", "电子产品", "网购"],
    娱乐: ["电影", "游戏", "订阅", "聚会"],
    旅行: ["机票", "住宿", "门票", "交通"],
  };
  S.accounts.forEach(function (a) {
    a.cur = a.cur || "MYR";
  });
}
function fxText(cur, am, mv) {
  var r = S.rates[cur] || 0;
  if (!(am > 0)) return "";
  if (mv > 0) return "实际汇率 1 " + cur + " = " + (mv / am).toFixed(4) + " MYR";
  return "按汇率约 RM " + (am * r).toFixed(2);
}
function curChips(cur) {
  var more = CURS_MORE.indexOf(cur) >= 0;
  function chip(c, x) {
    return (
      '<button class="chip' + (c === cur ? " on" : "") + (x ? " mx" : "") + '" data-cu="' + c + '"' +
      (x && !more ? ' style="display:none"' : "") + ">" + c + "</button>"
    );
  }
  return (
    CURS_MAIN.map(function (c) { return chip(c, 0); }).join("") +
    '<button class="chip" data-more="1" style="border-style:dashed">更多币种 ▾</button>' +
    CURS_MORE.map(function (c) { return chip(c, 1); }).join("")
  );
}
var ratesMore = false;
function rateRows(list) {
  return list
    .map(function (c) {
      var r = S.rates[c] || 0;
      return (
        "<label>1 " + c + " = ? MYR　（1 MYR ≈ " + (r ? (1 / r).toFixed(4) : "-") + " " + c +
        '）</label><input type="number" inputmode="decimal" step="any" data-rate="' + c + '" value="' + r + '">'
      );
    })
    .join("");
}
function conv(n, f, t) {
  return (n * S.rates[f]) / S.rates[t];
}
function accRow(a, at) {
  var b = balance(a),
    x = a.cur !== S.base ? " · ≈" + fmt(conv(b, a.cur, S.base)) : "";
  return (
    '<div class="item row"' +
    at +
    ">" +
    aico(a) +
    '<div class="sp"><div class="ellip">' +
    esc(a.name) +
    '</div><div class="mute">' +
    TYPES[a.type][0] +
    " · " +
    a.cur +
    x +
    (a.hide ? " · 已隐藏" : "") +
    '</div></div><div class="num ' +
    (b < 0 ? "exp" : "") +
    '">' +
    fmt(b, a.cur) +
    "</div></div>"
  );
}
var tab = "home",
  mon = new Date(),
  statMode = "day",
  statDay = today(),
  statWeek = new Date(),
  statYear = new Date().getFullYear(),
  fAcc = "all",
  fQ = "";
function load() {
  try {
    var r = localStorage.getItem(KEY);
    if (r) return JSON.parse(r);
  } catch (e) {}
  return {
    accounts: [
      { id: "a1", name: "现金", type: "cash", cur: "MYR", bal: 0 },
      { id: "a2", name: "Maybank", type: "bank", cur: "MYR", bal: 0 },
      { id: "a3", name: "Touch 'n Go eWallet", type: "wallet", cur: "MYR", bal: 0 },
    ],
    tx: [],
  };
}
function save() {
  if (RO) return;
  // 先记下新增/修改/删除（_u 与删除墓碑），同步合并时才不会丢记录
  LM.track(cur === "joint" ? "joint" : "mine", S);
  S._t = Date.now();
  if (cur === "joint") {
    syncJ();
    return;
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
  } catch (e) {
    toast("手机存储空间不足，请先导出备份");
  }
  sync();
}
function uid() {
  try {
    var a = crypto.getRandomValues(new Uint32Array(2));
    return a[0].toString(36) + a[1].toString(36).slice(0, 4);
  } catch (e) {
    return Math.random().toString(36).slice(2, 9);
  }
}
function fmt(n, c) {
  var s = Math.abs(n).toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (n < 0 ? "-" : "") + (SYM[c || S.base] || (c || S.base) + " ") + s;
}
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}
function acc(id) {
  return S.accounts.find(function (a) {
    return a.id === id;
  });
}
function balance(a) {
  var b = +a.bal || 0;
  S.tx.forEach(function (t) {
    if (t.type === "income" && t.acc === a.id) b += t.amt;
    if (t.type === "expense" && t.acc === a.id) b -= t.amt;
    if (t.type === "transfer") {
      if (t.acc === a.id) b -= t.amt + (t.fee || 0);
      if (t.to === a.id) b += t.toAmt != null ? t.toAmt : t.amt;
    }
  });
  return b;
}
function today() {
  var d = new Date();
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}
function mk(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
}
function monthTx(m, a) {
  return S.tx.filter(function (t) {
    return t.date.slice(0, 7) === m && (!a || a === "all" || t.acc === a || t.to === a);
  });
}
function cvt(x, t) {
  // 手动填了实际 MYR 金额的外币记录，直接用它
  if (t.myr > 0 && x === t.amt && t.type !== "transfer") return conv(+t.myr, "MYR", S.base);
  var a = acc(t.acc);
  return conv(x, a ? a.cur : t.cur || "MYR", S.base);
}
function sums(list) {
  var i = 0,
    e = 0;
  list.forEach(function (t) {
    if (t.type === "income") i += cvt(t.amt, t);
    else if (t.type === "expense") e += cvt(t.amt, t);
    else e += cvt(t.fee || 0, t);
  });
  return { i: i, e: e };
}

function render() {
  if (UN && UN.fresh) {
    UN.fresh = false;
    setTimeout(showUndo, 0);
  }
  if (RO && tab === "set") tab = "home";
  var h = "";
  if (tab === "home") h = home();
  else if (tab === "bills") h = bills();
  else if (tab === "accts") h = accts() + peers();
  else if (tab === "stats") h = stats();
  else h = settings();
  if (0)
    h =
      '<div class="card row" style="background:var(--accbg)"><div class="sp"><b>正在查看 ' +
      esc(names[viewId] || "对方") +
      ' 的账本</b><div class="mute">只读，不能修改</div></div><button class="chip on" data-act="back">返回我的</button></div>' +
      h;
  document.getElementById("fab").style.display = RO ? "none" : "";
  document.getElementById("cam").style.display = camOK && !RO ? "" : "none";
  h =
    (backTo && tab !== "home"
      ? '<button class="chip" data-tab="' + backTo + '" style="margin-bottom:8px">‹ 返回</button>'
      : "") +
    switcher() +
    h;
  document.getElementById("app").innerHTML = h;
  var c2 = document.getElementById("lg2");
  if (c2) drawIcon(c2);
  var tabs = [
    ["home", "总览", "🍓"],
    ["bills", "账单", "📒"],
    ["accts", "账户", "👛"],
    ["stats", "统计", "🍰"],
    ["set", "更多", "🧸"],
  ];
  document.getElementById("nav").innerHTML = tabs
    .filter(function (t) {
      return !(RO && t[0] === "set");
    })
    .map(function (t) {
      return (
        '<button data-tab="' +
        t[0] +
        '" class="' +
        (tab === t[0] ? "on" : "") +
        '"><b>' +
        t[2] +
        "</b>" +
        t[1] +
        "</button>"
      );
    })
    .join("");
}

function txRow(t) {
  var a =
      acc(t.acc) ||
      (t.pay && t.pay !== "joint" ? { name: (t.by || "") + "付", cur: t.cur } : { name: "已删除" }),
    sign,
    cls,
    title,
    sub;
  if (t.type === "transfer") {
    var b = acc(t.to) || { name: "已删除" };
    title = "转账";
    sub =
      esc(a.name) +
      " → " +
      esc(b.name) +
      (t.fee ? "，手续费 " + fmt(t.fee, a.cur) : "") +
      (b.cur && a.cur && b.cur !== a.cur && t.toAmt ? "，到账 " + fmt(t.toAmt, b.cur) : "");
    cls = "tr";
    sign = "";
  } else {
    title = esc(t.cat) + (t.sub ? " · " + esc(t.sub) : "");
    sub = esc(a.name);
    cls = t.type === "income" ? "inc" : "exp";
    sign = t.type === "income" ? "+" : "-";
  }
  if (t.note) sub += "　" + esc(t.note);
  if (t.by)
    sub +=
      " · " +
      esc(t.by) +
      (t.aa ? " · AA" : "") +
      (t.gift ? " · 🎁" : t.p ? " · 🔒" : "") +
      (t.img ? " · 📎" : "");
  var fx = "";
  if (t.type !== "transfer" && a.cur && a.cur !== "MYR" && S.rates[a.cur])
    fx =
      '<div class="mute" style="font-size:11px;font-weight:400;text-align:right">' +
      (t.myr > 0 ? "= " : "≈ ") +
      fmt(t.myr > 0 ? t.myr : t.amt * S.rates[a.cur], "MYR") +
      "</div>";
  return (
    '<div class="item row" data-tx="' +
    t.id +
    '" style="cursor:pointer"><div class="ico">' +
    (t.type === "transfer" ? "⇄" : txi(t)) +
    '</div><div class="sp"><div class="ellip">' +
    title +
    '</div><div class="mute ellip">' +
    sub +
    '</div></div><div class="num ' +
    cls +
    '">' +
    sign +
    fmt(t.amt, a.cur).replace("-", "") +
    fx +
    "</div></div>"
  );
}

function home() {
  var net = 0,
    asset = 0,
    debt = 0;
  S.accounts.forEach(function (a) {
    var b = conv(balance(a), a.cur, S.base);
    net += b;
    if (b >= 0) asset += b;
    else debt += b;
  });
  var m = sums(monthTx(mk(new Date())));
  var recent = S.tx
    .slice()
    .sort(function (a, b) {
      return b.date.localeCompare(a.date) || b.ts - a.ts;
    })
    .slice(0, 6);
  return (
    '<div class="hero"><div class="row" style="gap:12px">' +
    hav() +
    '<h1 style="margin:0">净资产</h1></div><div class="big">' +
    fmt(net) +
    '</div><div class="mute">资产 ' +
    fmt(asset) +
    (debt ? "　负债 " + fmt(debt) : "") +
    "</div>" +
    moodBubble() +
    "</div>" +
    '<div class="card row"><div class="sp"><div class="mute">本月收入</div><div class="num inc" style="font-size:20px">' +
    fmt(m.i) +
    '</div></div><div class="sp"><div class="mute">本月支出</div><div class="num exp" style="font-size:20px">' +
    fmt(m.e) +
    '</div></div><div class="sp"><div class="mute">结余</div><div class="num" style="font-size:20px">' +
    fmt(m.i - m.e) +
    "</div></div></div>" +
    todayCard() +
    askCard() +
    annCard() +
    favs() +
    alerts() +
    recap() +
    aaCard() +
    '<div class="row"><b class="sp">账户</b><button class="chip" data-go="accts">管理</button></div><div class="card">' +
    S.accounts
      .filter(function (a) {
        return !a.hide;
      })
      .map(function (a) {
        return accRow(a, "");
      })
      .join("") +
    "</div>" +
    '<div class="row"><b class="sp">最近记录</b><button class="chip" data-go="bills">全部</button></div><div class="card">' +
    (recent.length
      ? recent.map(txRow).join("")
      : '<div class="empty">还没有记录，点右下角 + 记第一笔</div>') +
    "</div>"
  );
}

function bills() {
  var m = mk(mon),
    list = (fQ ? S.tx.filter(matchQ) : monthTx(m, fAcc)).sort(function (a, b) {
      return b.date.localeCompare(a.date) || b.ts - a.ts;
    }),
    s = sums(list);
  var h =
    '<div class="mnav"><button data-m="-1" aria-label="上个月">‹</button><b>' +
    mon.getFullYear() +
    "年" +
    (mon.getMonth() + 1) +
    '月</b><button data-m="1" aria-label="下个月">›</button></div>' +
    '<input id="q" type="search" placeholder="搜索备注、分类、账户、金额" value="' +
    esc(fQ) +
    '" style="margin-bottom:8px"><select id="fa"><option value="all">全部账户</option>' +
    S.accounts
      .map(function (a) {
        return (
          '<option value="' +
          a.id +
          '"' +
          (fAcc === a.id ? " selected" : "") +
          ">" +
          esc(a.name) +
          "</option>"
        );
      })
      .join("") +
    "</select>" +
    '<div class="card row"><div class="sp"><div class="mute">收入</div><div class="num inc">' +
    fmt(s.i) +
    '</div></div><div class="sp"><div class="mute">支出</div><div class="num exp">' +
    fmt(s.e) +
    "</div></div></div>";
  if (!list.length) return h + '<div class="empty">这个月没有记录</div>';
  var cur = "";
  list.forEach(function (t) {
    if (t.date !== cur) {
      cur = t.date;
      h += '<div class="date">' + cur.slice(5).replace("-", "月") + "日</div>";
    }
    h += '<div class="card" style="margin:6px 0;padding:0 14px">' + txRow(t) + "</div>";
  });
  return h;
}

function accts() {
  return (
    '<div class="row" style="margin-bottom:4px"><b class="sp">我的账户</b><button class="chip on" data-acc="new">＋ 新账户</button></div><div class="card">' +
    S.accounts
      .map(function (a) {
        return accRow(a, ' data-acc="' + a.id + '" style="cursor:pointer"');
      })
      .join("") +
    "</div>" +
    '<div class="card"><div class="mute">点账户可修改名称、初始余额或删除。账户之间的资金请用 + → 转账 记录，转账不会计入收支。</div></div>'
  );
}

function ds(d) {
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}
function pd(s) {
  var p = s.split("-");
  return new Date(+p[0], +p[1] - 1, +p[2] || 1);
}
function weekStart(d) {
  var x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); // 周一为一周开始
  return x;
}
var WD = ["日", "一", "二", "三", "四", "五", "六"];
function statRange() {
  var a, b, label, d, s, e;
  if (statMode === "day") {
    d = pd(statDay);
    a = b = ds(d);
    label = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日";
    if (a === today()) label += "（今天）";
  } else if (statMode === "week") {
    s = weekStart(statWeek);
    e = new Date(s.getFullYear(), s.getMonth(), s.getDate() + 6);
    a = ds(s);
    b = ds(e);
    label =
      s.getFullYear() +
      "年 " +
      (s.getMonth() + 1) +
      "月" +
      s.getDate() +
      "日 – " +
      (e.getMonth() + 1) +
      "月" +
      e.getDate() +
      "日";
    if (a <= today() && today() <= b) label += "（本周）";
  } else if (statMode === "month") {
    s = new Date(mon.getFullYear(), mon.getMonth(), 1);
    e = new Date(mon.getFullYear(), mon.getMonth() + 1, 0);
    a = ds(s);
    b = ds(e);
    label = mon.getFullYear() + "年" + (mon.getMonth() + 1) + "月";
  } else {
    a = statYear + "-01-01";
    b = statYear + "-12-31";
    label = statYear + "年";
  }
  return { a: a, b: b, label: label };
}
function statNav(n) {
  if (statMode === "day") {
    var d = pd(statDay);
    statDay = ds(new Date(d.getFullYear(), d.getMonth(), d.getDate() + n));
  } else if (statMode === "week") {
    var w = weekStart(statWeek);
    statWeek = new Date(w.getFullYear(), w.getMonth(), w.getDate() + 7 * n);
  } else if (statMode === "month") {
    mon = new Date(mon.getFullYear(), mon.getMonth() + n, 1);
  } else {
    statYear += n;
  }
}

function stats() {
  var r = statRange(),
    list = S.tx.filter(function (t) {
      var d = String(t.date || "").slice(0, 10);
      return d >= r.a && d <= r.b;
    }),
    by = {},
    tot = 0,
    inc = 0,
    sub = {};
  list.forEach(function (t) {
    var d = String(t.date).slice(0, 10);
    if (t.type === "income") inc += cvt(t.amt, t);
    else if (t.type === "expense") {
      var v = cvt(t.amt, t),
        k = statMode === "year" ? d.slice(0, 7) : d;
      by[t.cat] = (by[t.cat] || 0) + v;
      tot += v;
      sub[k] = (sub[k] || 0) + v;
    }
  });
  if (statMode === "month")
    Object.keys(S.budget).forEach(function (k) {
      if (!(k in by) && S.budget[k] > 0) by[k] = 0;
    });
  var keys = Object.keys(by).sort(function (a, b) {
    return by[b] - by[a];
  });
  var modes = [
    ["day", "日"],
    ["week", "周"],
    ["month", "月"],
    ["year", "年"],
  ];
  var h =
    '<div class="seg" style="margin-bottom:8px">' +
    modes
      .map(function (m) {
        return (
          '<button data-sm="' +
          m[0] +
          '" class="' +
          (statMode === m[0] ? "on" : "") +
          '">' +
          m[1] +
          "</button>"
        );
      })
      .join("") +
    '</div><div class="mnav"><button data-sn="-1" aria-label="上一个">‹</button><b>' +
    r.label +
    '</b><button data-sn="1" aria-label="下一个">›</button></div>';

  // 总开销
  var st = pd(r.a),
    en = pd(r.b),
    t0 = pd(today()),
    avg = "";
  if (statMode !== "day" && t0 >= st) {
    if (t0 < en) en = t0;
    var days = Math.round((en - st) / 864e5) + 1;
    avg = " · 日均 " + fmt(tot / days);
  }
  h +=
    '<div class="card"><h1>总开销</h1><div class="big exp" style="color:var(--exp)">' +
    fmt(tot) +
    '</div><div class="mute">收入 ' +
    fmt(inc) +
    " · 结余 " +
    fmt(inc - tot) +
    avg +
    "</div></div>";

  // 分类明细
  h += '<div class="card"><b>分类支出</b>';
  h += keys.length
    ? keys
        .map(function (k) {
          var bd = statMode === "month" ? S.budget[k] || 0 : 0,
            p = bd ? Math.min((by[k] / bd) * 100, 100) : tot ? (by[k] / tot) * 100 : 0,
            ov = bd && by[k] > bd;
          return (
            '<div class="item"><div class="row"><span class="sp">' +
            ci(k) +
            " " +
            esc(k) +
            '</span><span class="num' +
            (ov ? " exp" : "") +
            '">' +
            fmt(by[k]) +
            (bd ? " / " + fmt(bd) : "") +
            "</span>" +
            (bd
              ? ""
              : '<span class="mute" style="width:42px;text-align:right">' +
                p.toFixed(0) +
                "%</span>") +
            '</div><div class="bar"><i style="width:' +
            p +
            "%" +
            (ov ? ";background:var(--exp)" : "") +
            '"></i></div></div>'
          );
        })
        .join("")
    : '<div class="empty">这段时间还没有支出</div>';
  h += "</div>";

  // 每天 / 每月 明细
  if (statMode === "day") {
    var dl = list.slice().sort(function (a, b) {
      return (b.ts || 0) - (a.ts || 0);
    });
    if (dl.length)
      h +=
        '<div class="card" style="padding:0 14px">' + dl.map(txRow).join("") + "</div>";
  } else {
    var rows = [],
      mx = 1,
      title = statMode === "year" ? "每月支出" : "每日支出";
    if (statMode === "year") {
      for (var m = 1; m <= 12; m++) {
        var k2 = statYear + "-" + String(m).padStart(2, "0");
        rows.push([k2, m + "月", sub[k2] || 0]);
      }
    } else {
      var c = pd(r.a),
        e2 = pd(r.b);
      for (; c <= e2; c = new Date(c.getFullYear(), c.getMonth(), c.getDate() + 1)) {
        var k3 = ds(c);
        if (statMode === "month" && !sub[k3]) continue;
        rows.push([
          k3,
          (c.getMonth() + 1) + "月" + c.getDate() + "日 周" + WD[c.getDay()],
          sub[k3] || 0,
        ]);
      }
    }
    rows.forEach(function (x) {
      mx = Math.max(mx, x[2]);
    });
    if (rows.length)
      h +=
        '<div class="card"><b>' +
        title +
        "</b>" +
        rows
          .map(function (x) {
            return (
              '<div class="item" data-sd="' +
              x[0] +
              '" style="cursor:pointer"><div class="row"><span class="sp">' +
              x[1] +
              '</span><span class="num' +
              (x[2] ? "" : " mute") +
              '">' +
              fmt(x[2]) +
              '</span></div><div class="bar"><i style="width:' +
              (x[2] / mx) * 100 +
              '%"></i></div></div>'
            );
          })
          .join("") +
        '<div class="mute" style="margin-top:6px">点一行可查看那' +
        (statMode === "year" ? "个月" : "一天") +
        "的详情</div></div>";
  }

  // 近 6 个月（仅月视图）
  if (statMode === "month") {
    h += '<div class="card"><b>近 6 个月</b><div class="mo">';
    var arr = [],
      mx2 = 1;
    for (var i = 5; i >= 0; i--) {
      var d = new Date(mon.getFullYear(), mon.getMonth() - i, 1),
        s = sums(monthTx(mk(d)));
      arr.push([d.getMonth() + 1, s]);
      mx2 = Math.max(mx2, s.i, s.e);
    }
    arr.forEach(function (a) {
      h +=
        '<div><div style="display:flex;align-items:flex-end;gap:2px;flex:1;width:100%;justify-content:center"><span style="height:' +
        (a[1].i / mx2) * 100 +
        '%;background:#4fbf8b"></span><span style="height:' +
        (a[1].e / mx2) * 100 +
        '%;background:var(--exp)"></span></div>' +
        a[0] +
        "月</div>";
    });
    h +=
      '</div><div class="mute" style="margin-top:6px"><span class="inc">■</span> 收入　<span class="exp">■</span> 支出</div></div>';
  }
  return h;
}

function settings() {
  var h =
    '<div class="row" style="margin-bottom:14px"><canvas id="lg2" width="96" height="96" style="width:48px;height:48px;border-radius:11px"></canvas><div><b>账本</b><div class="mute">记账 · 转账 · 多币种</div></div></div><b>主货币</b><div class="mute">总览、账单、统计会换算成这个币种</div><div class="chips" style="margin:8px 0">' +
    CURS_MAIN.map(function (c) {
      return (
        '<button class="chip' +
        (c === S.base ? " on" : "") +
        '" data-base="' +
        c +
        '">' +
        c +
        "</button>"
      );
    }).join("") +
    '</div><div class="card"><b>汇率（1 外币 = 多少 MYR，可手动修改）</b>' +
    rateRows(["SGD", "CNY"]) +
    "<details" + (ratesMore ? " open" : "") +
    ' style="margin-top:12px"><summary class="mute" style="cursor:pointer">其他币种汇率（USD、EUR、JPY…）</summary>' +
    rateRows(CURS_MORE) +
    "</details></div>";
  [
    ["expense", "支出分类"],
    ["income", "收入分类"],
  ].forEach(function (x) {
    h +=
      '<div class="card"><b>' +
      x[1] +
      '</b><div class="mute">点分类可删除，旧记录不受影响</div><div class="chips" style="margin-top:8px">' +
      S.cats[x[0]]
        .map(function (c, i) {
          return (
            '<button class="chip" data-delcat="' +
            x[0] +
            ":" +
            i +
            '">' +
            ci(c) +
            " " +
            esc(c) +
            "</button>"
          );
        })
        .join("") +
      '<button class="chip on" data-addcat="' +
      x[0] +
      '">＋ 添加</button></div></div>';
  });
  return (
    h +
    more() +
    '<div class="card"><b>备份</b><div class="mute">数据只存在这个浏览器里，建议定期导出备份。</div><div class="row" style="margin-top:8px"><button class="chip" data-bk="out">导出</button><button class="chip" data-bk="in">导入</button><button class="chip" data-bk="csv">导出 CSV</button>' +
    (localStorage.getItem("ledger.bak")
      ? '<button class="chip" data-bk="rst">恢复被覆盖的数据</button>'
      : "") +
    "</div></div>"
  );
}
function backup(k) {
  if (k === "csv") {
    csv();
    return;
  }
  if (k === "rst") {
    try {
      // 把最近几份备份全部“合并”回来：只会找回缺的记录，不会删掉现有的
      var bs = LM.backups(),
        before = (S.tx || []).length;
      if (!bs.length) {
        toast("没有可恢复的备份");
        return;
      }
      LM.snapshot(S, true);
      var m = S;
      bs.forEach(function (b) {
        b._t = 0; // 让现有数据的设置优先，备份只补记录
        m = LM.merge(m, b);
      });
      var pn = S.pin;
      S = m;
      S.pin = pn;
      migrate();
      save();
      render();
      toast("已恢复，找回 " + Math.max(0, S.tx.length - before) + " 笔记录");
    } catch (e) {}
    return;
  }
  if (k === "out") {
    var m = openSheet(
      '<b>导出备份</b><div class="mute">复制下面全部文字，保存到备忘录或发给自己</div><textarea id="j" readonly></textarea>',
    );
    m.querySelector("#j").value = JSON.stringify(S);
    m.querySelector("#j").select();
  } else {
    var m2 = openSheet(
      '<b>导入备份</b><div class="mute">粘贴备份文字，会合并到现有数据里（不会删除你现有的记录）</div><textarea id="j"></textarea><button class="btn" id="go">导入</button>',
    );
    m2.querySelector("#go").onclick = function () {
      try {
        var d = JSON.parse(m2.querySelector("#j").value);
        if (!d.accounts || !d.tx) throw 0;
        LM.snapshot(S, true);
        d._t = 0; // 导入只补充记录，现有设置与记录不会被删掉
        var pn2 = S.pin;
        S = LM.merge(S, d);
        S.pin = pn2;
        migrate();
        save();
        m2.remove();
        render();
      } catch (e) {
        alert("备份内容无法识别");
      }
    };
  }
}
function accSheet2(id) {
  var isNew = id === "new",
    a = isNew ? { name: "", type: "bank", cur: "MYR", bal: 0 } : acc(id),
    type = a.type,
    cur = a.cur;
  var m = openSheet(
    "<b>" +
      (isNew ? "新账户" : "编辑账户") +
      "</b>" +
      (isNew
        ? ""
        : '<div class="row" style="margin:8px 0"><button class="chip" data-mv="-1">↑ 上移</button><button class="chip" data-mv="1">↓ 下移</button></div>') +
      (isNew
        ? '<label>快速选择</label><div class="chips" style="max-height:150px;overflow:auto">' +
          P.map(function (p, i) {
            return '<button class="chip" data-p="' + i + '">' + dot(p[0]) + esc(p[0]) + "</button>";
          }).join("") +
          "</div>"
        : "") +
      '<label>名称</label><input id="n" value="' +
      esc(a.name) +
      '" placeholder="例如：Maybank、TNG eWallet"><label>类型</label><div class="chips" id="ty">' +
      Object.keys(TYPES)
        .map(function (k) {
          return (
            '<button class="chip' +
            (k === type ? " on" : "") +
            '" data-k="' +
            k +
            '">' +
            TYPES[k][1] +
            " " +
            TYPES[k][0] +
            "</button>"
          );
        })
        .join("") +
      '</div><label>币种（常用 MYR / SGD / CNY，其他点「更多币种」）</label><div class="chips" id="cu">' +
      curChips(cur) +
      '</div><label>信用卡还款日（每月几号，选填）</label><input id="du" type="number" min="1" max="28" value="' +
      (a.due || "") +
      '"><label>初始余额（信用卡欠款填负数）</label><input id="b" type="number" inputmode="decimal" step="0.01" value="' +
      (+a.bal || 0) +
      '"><label style="display:flex;gap:8px;align-items:center;color:var(--ink)"><input type="checkbox" id="hd"' +
      (a.hide ? " checked" : "") +
      '> 隐藏这个账户（不在总览和记账选择里显示）</label><button class="btn" id="ok">保存</button>' +
      (isNew ? "" : '<button class="btn ghost" id="del">删除账户</button>'),
  );
  function mark(s, k, v) {
    m.querySelectorAll(s + " .chip").forEach(function (x) {
      x.classList.toggle("on", x.dataset[k] === v);
    });
  }
  m.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.p) {
      var p = P[b.dataset.p];
      m.querySelector("#n").value = p[0];
      type = p[1];
      cur = p[2];
      mark("#ty", "k", type);
      mark("#cu", "cu", cur);
    } else if (b.dataset.k) {
      type = b.dataset.k;
      mark("#ty", "k", type);
    } else if (b.dataset.more) {
      m.querySelectorAll("#cu .mx").forEach(function (x) {
        x.style.display = x.style.display === "none" ? "" : "none";
      });
    } else if (b.dataset.cu) {
      cur = b.dataset.cu;
      mark("#cu", "cu", cur);
    } else if (b.dataset.mv) {
      var ix = S.accounts.indexOf(a),
        jx = ix + +b.dataset.mv;
      if (jx >= 0 && jx < S.accounts.length) {
        S.accounts.splice(jx, 0, S.accounts.splice(ix, 1)[0]);
        save();
        render();
        toast("已移动");
      }
    } else if (b.id === "ok") {
      var n = m.querySelector("#n").value.trim();
      if (!n) {
        alert("请填写账户名称");
        return;
      }
      var bal = parseFloat(m.querySelector("#b").value) || 0;
      var du = Math.min(28, parseInt(m.querySelector("#du").value) || 0);
      if (isNew)
        S.accounts.push({
          id: uid(),
          name: n,
          type: type,
          cur: cur,
          bal: bal,
          due: du,
          hide: m.querySelector("#hd").checked ? 1 : undefined,
        });
      else {
        a.name = n;
        a.type = type;
        a.cur = cur;
        a.bal = bal;
        a.due = du;
        a.hide = m.querySelector("#hd").checked ? 1 : undefined;
      }
      save();
      m.remove();
      render();
    } else if (b.id === "del") {
      var used = S.tx.some(function (t) {
        return t.acc === id || t.to === id;
      });
      if (two(b, used ? "再点一次：账户和它的所有记录都会删除" : "再点一次确认删除")) {
        S.accounts = S.accounts.filter(function (x) {
          return x.id !== id;
        });
        S.tx = S.tx.filter(function (t) {
          return t.acc !== id && t.to !== id;
        });
        save();
        m.remove();
        render();
      }
    }
  });
}
function matchQ(t) {
  var a = acc(t.acc) || {},
    s = (t.cat || "") + (t.sub ? "/" + t.sub : "") + (t.note || "") + (a.name || "") + t.amt;
  return s.toLowerCase().indexOf(fQ.toLowerCase()) >= 0;
}
function nx(m) {
  return mk(new Date(+m.slice(0, 4), +m.slice(5), 1));
}
function runRec() {
  var td = today(),
    cur = td.slice(0, 7);
  S.rec.forEach(function (r) {
    var m = r.last ? nx(r.last) : cur;
    while (m <= cur) {
      var d = m + "-" + ("0" + r.day).slice(-2);
      if (d > td) break;
      S.tx.push({
        // 固定 id：两台设备同一天各自生成定期记账时，合并后不会变成两笔
        id: "rc_" + r.id + "_" + m,
        ts: Date.now(),
        type: "expense",
        amt: r.amt,
        acc: r.acc,
        cat: r.cat,
        note: r.name + "（定期）",
        date: d,
        by: r.by,
        byId: r.byId,
        aa: r.aa,
      });
      r.last = m;
      RC = 1;
      m = nx(m);
    }
  });
  if (RC) {
    RC = 0;
    save();
  }
}
function alerts() {
  var h = "",
    td = new Date(),
    by = {};
  monthTx(mk(td)).forEach(function (t) {
    if (t.type === "expense") by[t.cat] = (by[t.cat] || 0) + cvt(t.amt, t);
  });
  Object.keys(S.budget).forEach(function (k) {
    var b = S.budget[k],
      v = by[k] || 0;
    if (b > 0 && v >= b * 0.8)
      h +=
        '<div class="item row"><div class="ico">' +
        (v > b ? "🚨" : "⚠️") +
        '</div><div class="sp">' +
        esc(k) +
        "预算已用 " +
        Math.round((v / b) * 100) +
        '%</div><div class="num exp">' +
        fmt(v) +
        "</div></div>";
  });
  S.accounts.forEach(function (a) {
    if (a.type !== "credit" || !a.due) return;
    var b = balance(a);
    if (b >= 0) return;
    var dd = td.getDate(),
      n =
        a.due >= dd
          ? a.due - dd
          : new Date(td.getFullYear(), td.getMonth() + 1, 0).getDate() - dd + a.due;
    if (n <= 7)
      h +=
        '<div class="item row"><div class="ico">💳</div><div class="sp">' +
        esc(a.name) +
        " " +
        (n ? n + " 天后" : "今天") +
        '还款<div class="mute">欠 ' +
        fmt(-b, a.cur) +
        '</div></div><button class="chip on" data-act="pay" data-i="' +
        a.id +
        '">还款</button></div>';
  });
  return h ? '<div class="card"><b>提醒</b>' + h + "</div>" : "";
}
function more() {
  var h =
    avCard() +
    favCard() +
    '<div class="card"><b>月预算（' +
    S.base +
    '）</b><div class="mute">留空表示不设预算，超过 80% 会在总览提醒</div>' +
    S.cats.expense
      .map(function (c) {
        return (
          '<div class="row item"><span class="sp">' +
          ci(c) +
          " " +
          esc(c) +
          '</span><input type="number" inputmode="decimal" style="width:110px" data-bud="' +
          esc(c) +
          '" value="' +
          (S.budget[c] || "") +
          '"></div>'
        );
      })
      .join("") +
    "</div>";
  h +=
    '<div class="card"><div class="row"><b class="sp">定期账单</b><button class="chip on" data-act="addrec">＋ 添加</button></div><div class="mute">每月到日期自动记一笔支出</div>' +
    S.rec
      .map(function (r, i) {
        var a = acc(r.acc) || {};
        return (
          '<div class="item row">' +
          (brand(r.name) ? badge(brand(r.name)) : "") +
          '<div class="sp" style="margin-left:8px"><div class="ellip">' +
          esc(r.name) +
          '</div><div class="mute">每月 ' +
          r.day +
          " 日 · " +
          esc(a.name || "") +
          (r.aa ? " · AA" : "") +
          (r.by ? " · " + esc(r.by) + "付" : "") +
          '</div></div><span class="num">' +
          fmt(r.amt, a.cur) +
          '</span><button class="chip" data-act="recedit" data-i="' +
          i +
          '">编辑</button></div>'
        );
      })
      .join("") +
    "</div>";
  h +=
    '<div class="card"><div class="row"><b class="sp">储蓄目标</b><button class="chip on" data-act="addgoal">＋ 添加</button></div>' +
    S.goals
      .map(function (g, i) {
        var p = Math.min((g.saved / g.target) * 100, 100);
        return (
          '<div class="item"><div class="row"><span class="sp">' +
          (g.p ? "🔒 " : "") +
          esc(g.name) +
          '</span><span class="num">' +
          fmt(g.saved) +
          " / " +
          fmt(g.target) +
          '</span></div><div class="bar"><i style="width:' +
          p +
          '%"></i></div><div class="row" style="margin-top:6px"><button class="chip" data-act="gadd" data-i="' +
          i +
          '">存入</button><button class="chip" data-act="gout" data-i="' +
          i +
          '">取出</button><button class="chip" data-act="gedit" data-i="' +
          i +
          '">编辑</button></div></div>'
        );
      })
      .join("") +
    "</div>";
  if (cur === "mine") h += giftCard();
  h += lovely();
  if (cur !== "mine") return h;
  h += shareCard();
  h +=
    '<div class="card"><b>PIN 锁</b><div class="mute">' +
    (S.pin ? "已开启，切出 app 后会自动上锁" : "设置后每次打开都要输入") +
    '</div><div class="row" style="margin-top:8px"><button class="chip on" data-act="pinset">' +
    (S.pin ? "修改" : "设置") +
    " PIN</button>" +
    (S.pin ? '<button class="chip" data-act="pinoff">关闭</button>' : "") +
    "</div></div>";
  return h;
}
function recSheet() {
  var m = openSheet(
    '<b>定期账单</b><label>名称</label><input id="rn" placeholder="房租、Unifi、Netflix"><label>金额</label><input id="ra" type="number" inputmode="decimal" step="0.01"><label>扣款账户</label><select id="rc">' +
      S.accounts
        .map(function (a) {
          return '<option value="' + a.id + '">' + esc(a.name) + " (" + a.cur + ")</option>";
        })
        .join("") +
      '</select><label>分类</label><select id="rt">' +
      S.cats.expense
        .map(function (c) {
          return "<option>" + esc(c) + "</option>";
        })
        .join("") +
      '</select><label>每月几号</label><input id="rd" type="number" min="1" max="28" value="1">' +
      recJ() +
      '<button class="btn" id="ok">保存</button>',
  );
  m.querySelector("#ok").onclick = function () {
    var g = function (i) {
        return m.querySelector("#" + i).value;
      },
      n = g("rn").trim(),
      a = parseFloat(g("ra")),
      d = Math.min(28, Math.max(1, parseInt(g("rd")) || 1));
    if (!n || !(a > 0) || !S.accounts.length) {
      alert("请填写名称和金额");
      return;
    }
    var td = new Date(),
      r = { id: uid(), name: n, amt: a, acc: g("rc"), cat: g("rt"), day: d };
    var rp = m.querySelector("#rp");
    if (rp) {
      r.byId = rp.value;
      r.by = rp.options[rp.selectedIndex].dataset.n;
      if (m.querySelector("#ra2").checked) r.aa = 1;
    }
    if (d <= td.getDate()) r.last = mk(td);
    S.rec.push(r);
    save();
    m.remove();
    render();
  };
}
function act(a, i) {
  if (a === "addrec") recSheet();
  else if (a === "delrec") {
    S.rec.splice(+i, 1);
    save();
    render();
  } else if (a === "addgoal") {
    goalSheet();
    return;
  } else if (a === "addgoal0") {
    var n = (prompt("目标名称（如：旅行基金）") || "").trim(),
      t = parseFloat(prompt("目标金额（" + S.base + "）"));
    if (n && t > 0) {
      S.goals.push({ id: uid(), name: n, target: t, saved: 0 });
      save();
      render();
    }
  } else if (a === "gadd") {
    askNum("存入金额（" + S.base + "）", function (v) {
      S.goals[+i].saved += v;
      save();
      render();
    });
    return;
  } else if (a === "gadd0") {
    var v = parseFloat(prompt("存入金额（" + S.base + "）"));
    if (v > 0) {
      S.goals[+i].saved += v;
      save();
      render();
    }
  } else if (a === "gdel") {
    if (1) {
      S.goals.splice(+i, 1);
      save();
      render();
    }
  } else if (a === "pinset") {
    pinSheet();
  } else if (a === "pinoff") {
    S.pin = "";
    save();
    render();
  } else if (a === "view") {
    sw("other", i);
  } else if (a === "back") {
    sw("mine");
  } else if (a === "sw") {
    sw(i);
  } else if (a === "av") {
    if (cur === "mine") {
      S.av = i;
      save();
      render();
    }
  } else if (a === "fav") {
    var f = S.fav[+i];
    if (f && S.accounts.length)
      txSheet(null, {
        type: f.type,
        amt: String(f.amt),
        acc: acc(f.acc) ? f.acc : S.accounts[0].id,
        to: "",
        cat: f.cat,
        note: f.note || "",
        date: today(),
        fee: "",
      });
  } else if (a === "favdel") {
    mark();
    S.fav.splice(+i, 1);
    save();
    render();
  } else if (a === "settle") {
    S.settled = Date.now();
    save();
    render();
  } else if (a === "setup") {
    setupSync();
  } else if (a === "ask") {
    askBear();
  } else if (a === "reveal") {
    var rt = S.tx.find(function (x) {
      return x.id === i;
    });
    if (rt) {
      delete rt.gift;
      delete rt.gd;
      delete rt.p;
      save();
      render();
    }
  } else if (a === "gedit") {
    goalSheet(+i);
  } else if (a === "gout") {
    askNum("取出金额（" + S.base + "）", function (v) {
      S.goals[+i].saved = Math.max(0, S.goals[+i].saved - v);
      save();
      render();
    });
  } else if (a === "annedit") {
    annSheet(+i);
  } else if (a === "wedit") {
    wishSheet(+i);
  } else if (a === "recedit") {
    recSheet(+i);
  } else if (a === "addann") {
    annSheet();
  } else if (a === "delann") {
    S.ann.splice(+i, 1);
    save();
    render();
  } else if (a === "addwish") {
    wishSheet();
  } else if (a === "wdone") {
    S.wish[+i].done = !S.wish[+i].done;
    save();
    render();
  } else if (a === "delwish") {
    S.wish.splice(+i, 1);
    save();
    render();
  } else if (a === "share") {
    if (!DBR) return;
    var on = !lsGet();
    try {
      localStorage.setItem(SK, on ? "1" : "0");
    } catch (e) {}
    if (on)
      DBR.get()
        .then(function (sn) {
          if (sn.exists && sn.data().json) applyRemote(sn.data().json);
          else {
            dirty = false;
            sync();
          }
        })
        .catch(function () {});
    render();
  } else if (a === "pay") {
    var c = acc(i),
      f =
        S.accounts.find(function (x) {
          return x.type !== "credit" && x.cur === c.cur;
        }) || S.accounts[0];
    txSheet(null, {
      type: "transfer",
      amt: (-balance(c)).toFixed(2),
      acc: f.id,
      to: c.id,
      cat: "其他",
      note: "信用卡还款",
      date: today(),
      fee: "",
    });
  }
}
function rr(x, a, b, w, h, r) {
  x.beginPath();
  x.moveTo(a + r, b);
  x.arcTo(a + w, b, a + w, b + h, r);
  x.arcTo(a + w, b + h, a, b + h, r);
  x.arcTo(a, b + h, a, b, r);
  x.arcTo(a, b, a + w, b, r);
  x.closePath();
}
function drawIcon(c) {
  var k = typeof myav === "function" && S ? myav() : "m",
    im = (AVI && AVI[k]) || (AVI && AVI.m);
  if (im && im.complete && im.naturalWidth) {
    c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
    return;
  }
  bear(c, "f", 1);
  return;
  var x = c.getContext("2d"),
    s = c.width,
    u = s / 100,
    g = x.createLinearGradient(0, 0, s, s);
  g.addColorStop(0, "#13876f");
  g.addColorStop(1, "#0a4437");
  x.fillStyle = g;
  x.fillRect(0, 0, s, s);
  x.fillStyle = "#f6f3e8";
  rr(x, 24 * u, 18 * u, 52 * u, 64 * u, 6 * u);
  x.fill();
  x.fillStyle = "#0a4437";
  x.fillRect(24 * u, 18 * u, 9 * u, 64 * u);
  x.fillStyle = "#c9d8d2";
  [32, 44, 56].forEach(function (y) {
    x.fillRect(40 * u, y * u, 28 * u, 3.5 * u);
  });
  x.fillStyle = "#f2b632";
  x.beginPath();
  x.arc(68 * u, 70 * u, 16 * u, 0, 7);
  x.fill();
  x.fillStyle = "#0a4437";
  x.font = "bold " + 24 * u + "px sans-serif";
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.fillText("$", 68 * u, 71 * u);
}
var LK = {};
function icons() {
  var c = document.createElement("canvas");
  c.width = c.height = 180;
  drawIcon(c);
  var u = c.toDataURL("image/png");
  ["icon", "apple-touch-icon"].forEach(function (r) {
    var l = LK[r] || (LK[r] = document.createElement("link"));
    l.rel = r;
    l.href = u;
    document.head.appendChild(l);
  });
}
icons();
function lock() {
  if (!S.pin || document.getElementById("lk")) return;
  var d = document.createElement("div");
  d.id = "lk";
  d.style.cssText =
    "position:fixed;inset:0;z-index:99;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px";
  d.innerHTML =
    '<canvas id="lg" width="128" height="128" style="width:84px;height:84px;border-radius:19px"></canvas><b>账本已锁定</b><input id="lp" type="password" inputmode="numeric" maxlength="6" placeholder="输入 PIN" style="width:160px;text-align:center"><div class="mute" id="le"></div>';
  document.body.appendChild(d);
  drawIcon(d.querySelector("#lg"));
  var i = d.querySelector("#lp");
  i.focus();
  i.oninput = function () {
    if (i.value === S.pin) d.remove();
    else if (i.value.length >= S.pin.length) {
      d.querySelector("#le").textContent = "PIN 不对";
      i.value = "";
    }
  };
}
document.addEventListener("visibilitychange", function () {
  if (document.hidden) lock();
});
var CI = {
  餐饮: "🍜",
  交通: "🚌",
  油费: "⛽",
  过路费: "🛣️",
  购物: "🛍️",
  水电网络: "💡",
  房租: "🏠",
  娱乐: "🎬",
  医疗: "💊",
  学习: "📚",
  旅行: "✈️",
  其他: "📦",
  工资: "💰",
  奖金: "🎁",
  理财: "📈",
  红包: "🧧",
  兼职: "💼",
};
var EM = [
  "🍜",
  "🍔",
  "🍕",
  "🍣",
  "🍱",
  "🍛",
  "🥗",
  "🍰",
  "🧋",
  "☕",
  "🍺",
  "🍷",
  "🛒",
  "🥬",
  "🍎",
  "🚌",
  "🚗",
  "🚕",
  "🚇",
  "🚲",
  "🛵",
  "⛽",
  "🛣️",
  "🅿️",
  "✈️",
  "🚄",
  "🛳️",
  "🛍️",
  "👕",
  "👗",
  "👟",
  "💄",
  "👜",
  "💍",
  "🎁",
  "📦",
  "🏠",
  "🛋️",
  "💡",
  "💧",
  "🔥",
  "📱",
  "🌐",
  "🧹",
  "🛏️",
  "🔧",
  "🧺",
  "🎬",
  "🎮",
  "🎵",
  "🎤",
  "🎳",
  "⚽",
  "🏋️",
  "🎨",
  "📷",
  "🎢",
  "🎟️",
  "💊",
  "🏥",
  "🦷",
  "👓",
  "💆",
  "🧴",
  "📚",
  "🎓",
  "✏️",
  "💻",
  "👶",
  "🧸",
  "🐶",
  "🐱",
  "🌸",
  "💐",
  "🐾",
  "💰",
  "💼",
  "📈",
  "💳",
  "🏦",
  "🧾",
  "🧧",
  "🎉",
  "🏖️",
  "🧳",
  "⛱️",
  "📺",
  "🎧",
  "☁️",
  "🔒",
  "🧑‍🤝‍🧑",
  "💑",
  "🍼",
  "🚿",
  "🪙",
  "💸",
  "🏷️",
];
function ci(c) {
  var v = S.ci[c];
  if (v && v.indexOf("b:") === 0) {
    var b = BRD.find(function (x) {
      return x[0] === v.slice(2);
    });
    if (b) return badge(b);
  } else if (v) return v;
  if (CI[c]) return CI[c];
  var b2 = brand(c);
  return b2 ? badge(b2) : "🏷️";
}
function addCat(k) {
  var nm = (prompt("新分类名称") || "").trim();
  if (!nm) return "";
  if (S.cats[k].indexOf(nm) < 0) {
    S.cats[k].push(nm);
    S.ci[nm] = (prompt("图标（输入一个 emoji，可留空）") || "").trim() || "🏷️";
  }
  save();
  return nm;
}
function catSheet(k, i) {
  var nm = S.cats[k][i];
  var m = openSheet(
    "<b>" +
      ci(nm) +
      " " +
      esc(nm) +
      '</b><div class="row" style="margin:8px 0"><button class="chip" data-mv="-1">↑ 上移</button><button class="chip" data-mv="1">↓ 下移</button></div><label>子分类（点一下删除）</label><div class="chips">' +
      subChips(nm) +
      '<button class="chip on" data-sa="1">＋ 添加</button></div><label>选择图标</label>' +
      icoPick("") +
      '<button class="btn ghost" id="dl">删除这个分类</button>',
  );
  m.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.sa) {
      askText("子分类名称（如：早餐）", function (v) {
        (S.sub = S.sub || {})[nm] = (S.sub[nm] || []).concat([v]);
        save();
        m.remove();
        render();
        catSheet(k, i);
      });
    } else if (b.dataset.sd !== undefined) {
      S.sub[nm].splice(+b.dataset.sd, 1);
      save();
      m.remove();
      render();
      catSheet(k, i);
    } else if (b.dataset.e) {
      S.ci[nm] = b.dataset.e;
      save();
      m.remove();
      render();
    } else if (b.dataset.mv) {
      var L = S.cats[k],
        j = i + +b.dataset.mv;
      if (j >= 0 && j < L.length) {
        L.splice(j, 0, L.splice(i, 1)[0]);
        i = j;
        save();
        render();
        toast("已移动");
      }
    } else if (b.id === "dl") {
      if (b.dataset.s) {
        mark();
        S.cats[k].splice(i, 1);
        save();
        m.remove();
        render();
      } else {
        b.dataset.s = 1;
        b.textContent = "再点一次确认删除（旧记录会保留）";
      }
    }
  });
}
var BR = [
  ["touch,tng", "#005ABB", "TNG"],
  ["grab", "#00B14F", "Grab"],
  ["boost", "#E4002B", "B"],
  ["shopee", "#EE4D2D", "SP"],
  ["paylah", "#E31837", "PL"],
  ["maybank,mae", "#FFC72C", "MB", "#222"],
  ["cimb", "#EC1C24", "CIMB"],
  ["public bank", "#E2231A", "PB"],
  ["rhb", "#0066B3", "RHB"],
  ["hong leong,hlb", "#003A70", "HLB"],
  ["ambank", "#E31837", "Am"],
  ["bank islam", "#7A1F54", "BIMB"],
  ["bsn", "#F58220", "BSN"],
  ["gxbank", "#111111", "GX"],
  ["affin", "#0B2D71", "AFF"],
  ["alliance", "#00457C", "ABMB"],
  ["agro", "#00833E", "Agro"],
  ["rakyat", "#E37222", "BR"],
  ["muamalat", "#00694B", "BMMB"],
  ["hsbc", "#DB0011", "HSBC"],
  ["standard chartered", "#0473EA", "SC"],
  ["citi", "#056DAE", "citi"],
  ["ocbc", "#E2231A", "OCBC"],
  ["dbs,posb", "#E31837", "DBS"],
  ["uob", "#00205B", "UOB"],
  ["bigpay", "#00C48C", "BP"],
  ["setel", "#0A9D58", "Set"],
  ["revolut", "#0075EB", "R"],
  ["wise", "#9FE870", "Wise", "#163300"],
  ["tabung haji", "#006838", "TH"],
  ["asb,asnb", "#00548F", "ASB"],
  ["stashaway", "#3B2A8C", "SA"],
  ["支付宝,alipay", "#1677FF", "支"],
  ["微信,wechat", "#07C160", "微"],
  ["中国银行", "#B01C2E", "中"],
  ["工商", "#C7000B", "工"],
  ["建设", "#003D8F", "建"],
  ["招商", "#C8161D", "招"],
  ["农业", "#00844F", "农"],
  ["u mobile", "#F26522", "U"],
  ["hotlink", "#E4002B", "HL"],
  ["yoodo", "#FFE600", "Yo", "#222"],
  ["tune talk", "#E4002B", "TT"],
  ["redone", "#E31E24", "rO"],
  ["xox", "#00A0DF", "XOX"],
  ["buzzme", "#6C2BD9", "Bz"],
  ["speakout", "#F7941D", "SO"],
  ["singtel", "#E60012", "St"],
];
function brand(n) {
  n = (n || "").toLowerCase();
  return BR.find(function (b) {
    return b[0].split(",").some(function (k) {
      return n.indexOf(k) >= 0;
    });
  });
}
var BRD = [
  ["youtube", "#FF0000", "▶", "#fff", "YouTube"],
  ["netflix", "#E50914", "N", "#fff", "Netflix"],
  ["spotify", "#1DB954", "♪", "#000", "Spotify"],
  ["disney", "#113CCF", "D+", "#fff", "Disney+"],
  ["prime video", "#00A8E1", "P", "#fff", "Prime Video"],
  ["amazon", "#FF9900", "a", "#111", "Amazon"],
  ["apple", "#111111", "A", "#fff", "Apple"],
  ["icloud", "#3693F3", "☁", "#fff", "iCloud"],
  ["google", "#4285F4", "G", "#fff", "Google"],
  ["chatgpt", "#10A37F", "GPT", "#fff", "ChatGPT"],
  ["claude", "#D97757", "C", "#fff", "Claude"],
  ["tiktok", "#111111", "♪", "#fff", "TikTok"],
  ["lazada", "#0F146D", "Laz", "#fff", "Lazada"],
  ["foodpanda", "#D70F64", "fp", "#fff", "foodpanda"],
  ["astro", "#1B2A6B", "A", "#fff", "Astro"],
  ["maxis", "#0E9E4A", "max", "#fff", "Maxis"],
  ["celcomdigi,digi", "#F9C70C", "CD", "#111", "CelcomDigi"],
  ["unifi", "#F36F21", "U", "#fff", "Unifi"],
  ["tnb", "#E31E24", "TNB", "#fff", "TNB 电费"],
  ["steam", "#1B2838", "S", "#fff", "Steam"],
  ["playstation", "#003791", "PS", "#fff", "PlayStation"],
  ["nintendo", "#E60012", "N", "#fff", "Nintendo"],
  ["facebook,meta", "#1877F2", "f", "#fff", "Facebook"],
  ["instagram", "#C13584", "IG", "#fff", "Instagram"],
  ["whatsapp", "#25D366", "W", "#fff", "WhatsApp"],
  ["canva", "#00C4CC", "C", "#fff", "Canva"],
  ["notion", "#111111", "N", "#fff", "Notion"],
  ["microsoft", "#00A4EF", "M", "#fff", "Microsoft"],
];
BR = BR.concat(BRD);
function badge(b) {
  return (
    '<span class="bd" style="background:' +
    b[1] +
    ";color:" +
    (b[3] || "#fff") +
    '">' +
    esc(b[2]) +
    "</span>"
  );
}
function txi(t) {
  var b = t.note && brand(t.note);
  return b ? badge(b) : ci(t.cat);
}
function pb(v, html, sel, fs) {
  return (
    '<button class="chip' +
    (v === sel ? " on" : "") +
    '" style="font-size:' +
    fs +
    'px;padding:4px 9px" data-e="' +
    esc(v) +
    '">' +
    html +
    "</button>"
  );
}
function icoPick(sel) {
  return (
    '<div class="chips" style="max-height:190px;overflow:auto">' +
    EM.map(function (x) {
      return pb(x, x, sel, 20);
    }).join("") +
    '</div><label>品牌图标</label><div class="chips" style="max-height:130px;overflow:auto">' +
    BRD.map(function (b) {
      return pb("b:" + b[0], badge(b) + " " + esc(b[4]), sel, 13);
    }).join("") +
    "</div>"
  );
}
function aico(a) {
  var b = brand(a.name);
  return b
    ? '<div class="ico" style="background:' +
        b[1] +
        ";color:" +
        (b[3] || "#fff") +
        ";font-size:" +
        (b[2].length > 3 ? 10 : 13) +
        'px;font-weight:700;letter-spacing:-.3px">' +
        b[2] +
        "</div>"
    : '<div class="ico">' + TYPES[a.type][1] + "</div>";
}
function dot(n) {
  var b = brand(n);
  return b
    ? '<i style="display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:5px;background:' +
        b[1] +
        '"></i>'
    : "";
}
function newCat(k, cb) {
  var e = "🏷️",
    m = openSheet(
      "<b>" +
        (k === "income" ? "新增收入分类" : "新增支出分类") +
        '</b><label>名称</label><input id="cn" maxlength="12" placeholder="例如：Mamak、宠物、孝敬父母"><label>图标</label>' +
        icoPick(e) +
        '<button class="btn" id="ok">添加</button>',
    );
  m.addEventListener("click", function (ev) {
    var b = ev.target.closest("button");
    if (!b) return;
    if (b.dataset.e) {
      e = b.dataset.e;
      m.querySelectorAll("[data-e]").forEach(function (x) {
        x.classList.toggle("on", x === b);
      });
    } else if (b.id === "ok") {
      var nm = m.querySelector("#cn").value.trim();
      if (!nm) return;
      if (S.cats[k].indexOf(nm) < 0) S.cats[k].push(nm);
      S.ci[nm] = e;
      save();
      m.remove();
      cb(nm);
    }
  });
  m.querySelector("#cn").focus();
}
var DBR = null,
  stm = null,
  dirty = false,
  shState = "",
  SK = "ledger.shared",
  RO = false,
  MINE = null,
  others = {},
  names = {},
  viewId = "",
  LC = null,
  cur = "mine",
  JOINT = null,
  JD = null,
  djt = false,
  jtm = null,
  jEmpty = false,
  myName = "我";
function lsGet() {
  try {
    return localStorage.getItem(SK) !== "0";
  } catch (e) {
    return true;
  }
}
function ser(o) {
  var c = JSON.parse(JSON.stringify(o || S));
  delete c.pin;
  if (c.tx)
    c.tx.forEach(function (t) {
      delete t.img;
    });
  ["tx", "goals", "wish", "ann"].forEach(function (k) {
    if (c[k])
      c[k] = c[k].filter(function (i) {
        return !i.p;
      });
  });
  return JSON.stringify(c);
}
// 取“我的账本”（不管当前正在看哪一本）
function getMine() {
  return cur === "mine" ? S : MINE;
}
// 把合并后的结果装回“我的账本”并存到本机
function adoptMine(m) {
  if (cur === "mine") {
    var pn = S.pin;
    S = m;
    S.pin = pn;
    migrate();
    LM.rebase("mine", S);
    try {
      localStorage.setItem(KEY, JSON.stringify(S));
    } catch (e) {
      toast("手机存储空间不足，请先导出备份");
    }
    render();
  } else {
    var sv = S;
    S = m;
    S.pin = MINE.pin;
    migrate();
    MINE = S;
    S = sv;
    LM.rebase("mine", MINE);
    try {
      localStorage.setItem(KEY, JSON.stringify(MINE));
    } catch (e) {}
  }
}
// 同步（先读云端 → 合并 → 再写回）。只合并不覆盖；读不到云端就不写，等重试
function sync(o, tries) {
  if (!DBR || !lsGet()) return;
  tries = tries || 0;
  dirty = true;
  clearTimeout(stm);
  stm = setTimeout(
    function () {
      var mine = getMine() || o;
      if (!mine) return;
      if (PRV) PRV.set({ json: JSON.stringify(privOf(mine)), t: Date.now() }).catch(function () {});
      DBR.get()
        .then(function (sn) {
          var cur0 = getMine(),
            merged = cur0,
            remote = null;
          if (sn.exists && sn.data().json) {
            remote = JSON.parse(sn.data().json);
            merged = LM.merge(cur0, remote);
            if (!LM.same(merged, cur0)) {
              LM.snapshot(cur0, true);
              adoptMine(merged);
              merged = getMine();
            }
          }
          if (remote && LM.same(JSON.parse(ser(merged)), remote)) return;
          return DBR.set({ json: ser(merged), t: Date.now() });
        })
        .then(function () {
          dirty = false;
        })
        .catch(function () {
          // 失败不能当作已同步：退避重试，全部失败也不会丢数据（本机已保存）
          if (tries < 6) {
            sync(o, tries + 1);
          } else {
            dirty = false;
            toast("同步失败，数据已保存在本机，网络恢复后再记一笔会自动重试");
          }
        });
    },
    tries ? Math.min(30000, 2000 * Math.pow(2, tries - 1)) : 600,
  );
}
// 收到云端数据：合并进本机（不再整份覆盖）
function applyRemote(d) {
  var r;
  try {
    r = JSON.parse(d);
  } catch (e) {
    return;
  }
  var cur0 = getMine();
  if (!cur0) return;
  var merged = LM.merge(cur0, r);
  if (!LM.same(merged, cur0)) {
    LM.snapshot(cur0, true);
    adoptMine(merged);
  }
  if (!LM.same(JSON.parse(ser(getMine())), r)) sync();
}
async function initShare() {
  try {
    var c = await claude.use("db"),
      u = await claude.use("user");
    if (!c || !u) {
      shState = "off";
      return;
    }
    var me = await u.id();
    myId = me;
    DBR = c.doc("ledgers/" + me);
    PRV = c.doc("data/users/" + me + "/private");
    PRV.get()
      .then(function (sn) {
        if (sn.exists && sn.data().json && cur === "mine") {
          var pr = JSON.parse(sn.data().json);
          ["tx", "goals", "wish", "ann"].forEach(function (k) {
            (pr[k] || []).forEach(function (it) {
              S[k] = S[k] || [];
              if (
                !S[k].some(function (x) {
                  return x.id === it.id;
                })
              )
                S[k].push(it);
            });
          });
          render();
        }
      })
      .catch(function () {});
    LC = c.collection("ledgers");
    JD = c.doc("joint/main");
    JD.onSnapshot(function (sn) {
      if (!sn.exists) {
        jEmpty = true;
        return;
      }
      var j = sn.data().json;
      if (!j) return;
      var o;
      try {
        o = JSON.parse(j);
      } catch (e) {
        return;
      }
      var loc = cur === "joint" ? S : JOINT;
      var merged = loc ? LM.merge(loc, o) : LM.ids(o);
      if (loc && LM.same(merged, loc)) {
        if (!LM.same(merged, o)) syncJ();
        return;
      }
      if (loc) LM.snapshot(loc, true);
      if (cur === "joint") {
        var p = S.pin;
        S = merged;
        S.pin = p;
        migrate();
        LM.rebase("joint", S);
        render();
      } else {
        JOINT = merged;
        LM.rebase("joint", JOINT);
      }
      if (!LM.same(merged, o)) syncJ();
    });
    LC.onSnapshot(function (sn) {
      others = {};
      var ids = [];
      sn.docs.forEach(function (d) {
        if (d.id !== me && d.data().json) {
          others[d.id] = d.data().json;
          ids.push(d.id);
        }
      });
      u.profiles(ids.concat([me]))
        .then(function (ps) {
          myName = (ps[me] && ps[me].name) || "我";
          ids.forEach(function (i) {
            names[i] = (ps[i] && ps[i].name) || "对方";
          });
          if (tab === "set" && !RO) render();
        })
        .catch(function () {});
      if (RO && others[viewId]) {
        S = JSON.parse(others[viewId]);
        S.pin = MINE.pin;
        migrate();
        render();
      } else if (tab === "set" && !RO) render();
    });
    shState = "ok";
    DBR.onSnapshot(
      function (sn) {
        if (!lsGet()) return;
        if (!sn.exists) {
          sync();
          return;
        }
        var j = sn.data().json;
        if (j) applyRemote(j);
      },
      function () {
        shState = "off";
      },
    );
    if (needPush && lsGet()) sync();
    if (tab === "set") render();
  } catch (e) {
    shState = "off";
  }
}
function shareCardOld() {
  var on = lsGet(),
    t =
      shState === "off"
        ? "还没有设置同步，点下面的「同步设置」"
        : shState === "ok"
          ? on
            ? "已开启：你们的记录会自动同步"
            : "未开启"
          : "连接中…";
  return (
    '<div class="card"><b>共享账本</b><div class="mute" style="margin:4px 0 8px">' +
    t +
    '</div><div class="mute">开启后以共享账本为准：云端已有数据时会覆盖本机数据；云端还没有时会上传本机数据。双方都要开启。同时修改时，后保存的会覆盖先保存的。PIN 锁不会共享。</div>' +
    (window.SYNC
      ? '<button class="chip on" style="margin:8px 8px 0 0" data-act="setup">⚙ 同步设置</button>'
      : "") +
    (shState === "ok"
      ? '<button class="chip on" style="margin-top:8px" data-act="share">' +
        (on ? "关闭共享" : "开启共享") +
        "</button>"
      : "") +
    "</div>"
  );
}
function shareCard() {
  var on = lsGet(),
    t =
      shState === "off"
        ? "还没有设置同步，点下面的「同步设置」"
        : shState === "ok"
          ? on
            ? "已开启：我的账本已同步到云端，对方可以查看"
            : "未开启"
          : "连接中…",
    ks = Object.keys(others);
  return (
    '<div class="card"><b>互相查看账本</b><div class="mute" style="margin:4px 0 8px">' +
    t +
    '</div><div class="mute">各记各的账，互不合并。开启后你的账本会存到云端（也是备份），对方可以只读查看；你也能查看对方的。关闭后对方看到的是旧数据。PIN 锁不会同步。</div>' +
    (window.SYNC
      ? '<button class="chip on" style="margin:8px 8px 0 0" data-act="setup">⚙ 同步设置</button>'
      : "") +
    (shState === "ok"
      ? '<button class="chip on" style="margin-top:8px" data-act="share">' +
        (on ? "关闭同步" : "开启同步") +
        "</button>"
      : "") +
    (ks.length
      ? '<div style="margin-top:12px"><b>可查看的账本</b>' +
        ks
          .map(function (i) {
            return (
              '<div class="item row"><span class="sp">👤 ' +
              esc(names[i] || "对方") +
              '</span><button class="chip on" data-act="view" data-i="' +
              i +
              '">查看</button></div>'
            );
          })
          .join("") +
        "</div>"
      : on
        ? '<div class="mute" style="margin-top:10px">对方开启同步后，会出现在这里</div>'
        : "") +
    "</div>"
  );
}
function syncJ(tries) {
  if (!JD) return;
  tries = tries || 0;
  djt = true;
  clearTimeout(jtm);
  jtm = setTimeout(
    function () {
      var loc = cur === "joint" ? S : JOINT;
      if (!loc) {
        djt = false;
        return;
      }
      JD.get()
        .then(function (sn) {
          var merged = loc,
            remote = null;
          if (sn.exists && sn.data().json) {
            remote = JSON.parse(sn.data().json);
            merged = LM.merge(loc, remote);
            if (!LM.same(merged, loc)) {
              LM.snapshot(loc, true);
              if (cur === "joint") {
                var p = S.pin;
                S = merged;
                S.pin = p;
                migrate();
                LM.rebase("joint", S);
                render();
              } else {
                JOINT = merged;
                LM.rebase("joint", JOINT);
              }
            }
          }
          var c = JSON.parse(JSON.stringify(merged));
          delete c.pin;
          if (remote && LM.same(c, remote)) return;
          return JD.set({ json: JSON.stringify(c), t: Date.now() });
        })
        .then(function () {
          djt = false;
        })
        .catch(function () {
          if (tries < 6) syncJ(tries + 1);
          else {
            djt = false;
            toast("共同账本同步失败，数据已保存在本机");
          }
        });
    },
    tries ? Math.min(30000, 2000 * Math.pow(2, tries - 1)) : 600,
  );
}
function sw(to, id) {
  if (to === cur && to !== "other") return;
  var o = to === "other" ? id || Object.keys(others)[0] : "",
    fresh = false;
  if (to === "other" && !others[o]) return;
  if (to === "joint" && !JOINT && !jEmpty) return;
  if (cur === "mine") MINE = S;
  else if (cur === "joint") JOINT = S;
  cur = to;
  RO = to === "other";
  viewId = o;
  if (to === "mine") S = MINE;
  else if (to === "joint") {
    if (!JOINT) {
      JOINT = {
        accounts: [{ id: uid(), name: "共同现金", type: "cash", cur: "MYR", bal: 0 }],
        tx: [],
      };
      fresh = true;
    }
    S = JOINT;
  } else S = JSON.parse(others[o]);
  if (to !== "mine") S.pin = MINE.pin;
  migrate();
  if (to === "joint") LM.ensure("joint", S);
  if (to === "joint") runRec();
  if (fresh) syncJ();
  tab = "home";
  render();
}
function switcher() {
  if (shState !== "ok") return "";
  var o = Object.keys(others)[0],
    it = [
      ["mine", "我的"],
      ["joint", "共同"],
    ];
  if (o) it.push(["other", names[o] || "对方"]);
  return (
    '<div class="seg" style="margin-bottom:12px">' +
    it
      .map(function (x) {
        return (
          '<button data-act="sw" data-i="' +
          x[0] +
          '" class="' +
          (cur === x[0] ? "on" : "") +
          '">' +
          (x[0] === "mine"
            ? im(myav(), 18)
            : x[0] === "joint"
              ? im(myav(), 18) + im(pav(), 18)
              : im(pav(), 18)) +
          " " +
          esc(x[1]) +
          "</button>"
        );
      })
      .join("") +
    "</div>" +
    (cur !== "mine"
      ? '<button class="chip" data-act="sw" data-i="mine" style="margin-bottom:8px">‹ 返回我的账本</button>'
      : "") +
    (cur === "other"
      ? '<div class="mute" style="margin:-4px 0 8px">只读：这是对方自己的账本</div>'
      : cur === "joint"
        ? '<div class="mute" style="margin:-4px 0 8px">共同账本：你们两人都能记，都看得到</div>'
        : "")
  );
}
var AVC = {};
var AVIMG = { f: "img/avatar-f.jpg", m: "img/avatar-m.jpg" };
var AVI = { f: new Image(), m: new Image() };
AVI.f.src = AVIMG.f;
AVI.m.src = AVIMG.m;
AVI.f.onload = AVI.m.onload = function () {
  icons();
};
function bear(c, g, full) {
  var x = c.getContext("2d"),
    s = c.width,
    u = s / 100;
  x.clearRect(0, 0, s, s);
  x.fillStyle = g === "m" ? "#d9ecff" : "#ffe1e8";
  if (full) x.fillRect(0, 0, s, s);
  else {
    rr(x, 0, 0, s, s, 22 * u);
    x.fill();
  }
  function o(a, b, r, f) {
    x.fillStyle = f;
    x.beginPath();
    x.arc(a * u, b * u, r * u, 0, 7);
    x.fill();
  }
  function t(p, f) {
    x.fillStyle = f;
    x.beginPath();
    x.moveTo(p[0] * u, p[1] * u);
    x.lineTo(p[2] * u, p[3] * u);
    x.lineTo(p[4] * u, p[5] * u);
    x.closePath();
    x.fill();
  }
  o(24, 38, 13, "#f08aa3");
  o(76, 38, 13, "#f08aa3");
  o(24, 38, 7, "#ffc3d0");
  o(76, 38, 7, "#ffc3d0");
  o(50, 58, 35, "#f7a1b5");
  x.fillStyle = "#e5405e";
  x.beginPath();
  x.moveTo(29 * u, 38 * u);
  x.quadraticCurveTo(50 * u, -2 * u, 71 * u, 38 * u);
  x.quadraticCurveTo(50 * u, 46 * u, 29 * u, 38 * u);
  x.fill();
  [
    [42, 28],
    [53, 22],
    [60, 31],
    [49, 36],
    [37, 35],
  ].forEach(function (p) {
    o(p[0], p[1], 1.8, "#ffe58a");
  });
  t([50, 11, 38, 3, 36, 12], "#5bbf6a");
  t([50, 11, 62, 3, 64, 12], "#5bbf6a");
  o(50, 72, 13, "#ffe6ec");
  o(38, 61, 3.6, "#4a2a33");
  o(62, 61, 3.6, "#4a2a33");
  o(39.2, 59.8, 1.2, "#fff");
  o(63.2, 59.8, 1.2, "#fff");
  o(29, 71, 5, "rgba(255,105,140,.45)");
  o(71, 71, 5, "rgba(255,105,140,.45)");
  o(50, 67, 3.6, "#7a3b4b");
  x.strokeStyle = "#7a3b4b";
  x.lineWidth = 1.6 * u;
  x.lineCap = "round";
  x.beginPath();
  x.arc(45.5 * u, 69 * u, 4.5 * u, 0.15, Math.PI - 0.35);
  x.stroke();
  x.beginPath();
  x.arc(54.5 * u, 69 * u, 4.5 * u, 0.35, Math.PI - 0.15);
  x.stroke();
  if (g === "m") {
    t([50, 93, 38, 86, 38, 100], "#4d9bff");
    t([50, 93, 62, 86, 62, 100], "#4d9bff");
    o(50, 93, 3.2, "#2f7de0");
  } else {
    t([22, 28, 10, 21, 10, 35], "#ffd54a");
    t([22, 28, 34, 21, 34, 35], "#ffd54a");
    o(22, 28, 3.4, "#ff9f1c");
  }
}
function av(g, s) {
  if (AVIMG[g]) return AVIMG[g];
  var k = g + s;
  if (!AVC[k]) {
    var c = document.createElement("canvas");
    c.width = c.height = s * 3;
    bear(c, g);
    AVC[k] = c.toDataURL();
  }
  return AVC[k];
}
function im(g, s) {
  return (
    '<img alt="" src="' +
    av(g, s) +
    '" style="width:' +
    s +
    "px;height:" +
    s +
    "px;border-radius:" +
    Math.round(s * 0.28) +
    'px;vertical-align:middle">'
  );
}
function myav() {
  var m = cur === "mine" ? S : MINE;
  return (m && m.av) || "m";
}
function pav() {
  var o = Object.keys(others)[0],
    a = "";
  try {
    if (o) a = JSON.parse(others[o]).av;
  } catch (e) {}
  return a || (myav() === "m" ? "f" : "m");
}
function hav() {
  return cur === "joint"
    ? im(myav(), 44) + '<span style="margin-left:-14px">' + im(pav(), 44) + "</span>"
    : im(cur === "other" ? S.av || pav() : myav(), 44);
}
function avCard() {
  if (cur !== "mine") return "";
  return (
    '<div class="card"><b>我的头像</b><div class="row" style="margin-top:8px;gap:14px">' +
    ["f", "m"]
      .map(function (g) {
        return (
          '<button data-act="av" data-i="' +
          g +
          '" aria-label="' +
          (g === "f" ? "女生" : "男生") +
          '" style="border:3px solid ' +
          ((S.av || "m") === g ? "var(--acc)" : "transparent") +
          ';background:none;border-radius:20px;padding:2px;cursor:pointer">' +
          im(g, 64) +
          "</button>"
        );
      })
      .join("") +
    '<div class="mute">草莓小熊<br>女生 / 男生</div></div></div>'
  );
}
var camOK = false;
(async function () {
  try {
    var sm = typeof claude !== "undefined" ? await claude.use("sample") : null;
    if (sm) {
      camOK = true;
      render();
      hashGo();
    }
  } catch (e) {}
})();
async function scan(f) {
  var m = openSheet('<div class="empty">🍓 正在读取截图…</div>'),
    sh = m.querySelector(".sheet");
  function bad(t) {
    sh.innerHTML = '<div class="empty">' + t + '</div><button class="btn" id="x">关闭</button>';
    sh.querySelector("#x").onclick = function () {
      m.remove();
    };
  }
  try {
    var sm = await claude.use("sample");
    if (!sm) {
      bad("这里不能读截图，请从 Claude 里打开");
      return;
    }
    var q =
      '这是一张付款、转账或收据截图（例如 TNG eWallet、银行 App）。只输出 JSON：{"amount":数字,"currency":"MYR、SGD 或 CNY","merchant":"商家或收款人","date":"YYYY-MM-DD，看不到就填空字符串","type":"expense 或 income","category":"从这些分类里选最接近的一个：' +
      S.cats.expense.concat(S.cats.income).join("、") +
      '"}。金额取这笔交易实际金额，不要带货币符号。';
    var r = await sm.json(q, { images: f, cache: false, modelTier: "quick" });
    var amt = Math.abs(parseFloat(r.amount));
    if (!(amt > 0)) {
      bad("没看到金额，请换一张截图或手动记账");
      return;
    }
    var ty = r.type === "income" ? "income" : "expense",
      L = S.cats[ty],
      cat = L.indexOf(r.category) >= 0 ? r.category : L.indexOf("其他") >= 0 ? "其他" : L[0];
    var tg = function (a) {
        return /touch|tng/i.test(a.name);
      },
      cs = S.accounts.filter(function (a) {
        return a.cur === r.currency;
      }),
      ac = cs.find(tg) || cs[0] || S.accounts.find(tg) || S.accounts[0];
    var d = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(r.date || "") ? r.date : today();
    m.remove();
    txSheet(null, {
      type: ty,
      amt: String(amt),
      acc: ac.id,
      to: "",
      cat: cat,
      note: r.merchant || "",
      date: d,
      fee: "",
    });
  } catch (e) {
    bad("读取失败，请再试一次");
  }
}
var myId = "";
function aaF(on, ty, py) {
  return cur === "joint" && ty === "expense" && py && py !== "joint"
    ? '<label style="display:flex;gap:8px;align-items:center;color:var(--ink)"><input type="checkbox" id="aa" style="width:auto"' +
        (on ? " checked" : "") +
        "> AA 平分（对方欠我一半）</label>"
    : "";
}
function aaCard() {
  if (cur !== "joint") return "";
  var st = S.settled || 0,
    net = 0,
    who = "";
  S.tx.forEach(function (t) {
    if (t.aa && t.ts > st) {
      var v = cvt(t.amt, t) / 2;
      if (t.byId === myId) net += v;
      else {
        net -= v;
        who = t.by || who;
      }
    }
  });
  var o = Object.keys(others)[0],
    nm = names[o] || who || "对方",
    z = Math.abs(net) < 0.005;
  return (
    '<div class="card"><b>AA 结算</b><div class="num ' +
    (net >= 0 ? "inc" : "exp") +
    '" style="margin:6px 0;font-size:18px">' +
    (z
      ? "已结清 🎉"
      : net > 0
        ? esc(nm) + " 欠你 " + fmt(net)
        : "你欠 " + esc(nm) + " " + fmt(-net)) +
    "</div>" +
    (z ? "" : '<button class="chip on" data-act="settle">已结清</button>') +
    "</div>"
  );
}
function recap() {
  var n = new Date(),
    a = sums(monthTx(mk(n))).e,
    b = sums(monthTx(mk(new Date(n.getFullYear(), n.getMonth() - 1, 1)))).e,
    by = {};
  monthTx(mk(n)).forEach(function (t) {
    if (t.type === "expense") by[t.cat] = (by[t.cat] || 0) + cvt(t.amt, t);
  });
  var top = Object.keys(by).sort(function (x, y) {
    return by[y] - by[x];
  })[0];
  if (!a) return "";
  return (
    '<div class="card"><b>本月小结</b><div class="mute" style="margin-top:4px">支出 ' +
    fmt(a) +
    (b ? "，比上月" + (a >= b ? "多" : "少") + Math.round((Math.abs(a - b) / b) * 100) + "%" : "") +
    (top ? "，花得最多的是 " + ci(top) + esc(top) : "") +
    "，日均 " +
    fmt(a / n.getDate()) +
    "</div></div>"
  );
}
function favs() {
  var f = S.fav || [];
  if (!f.length || RO) return "";
  return (
    '<div class="chips" style="margin:6px 0 4px">' +
    f
      .map(function (x, i) {
        return (
          '<button class="chip on" data-act="fav" data-i="' +
          i +
          '">⭐ ' +
          esc(x.name) +
          " " +
          fmt(x.amt, (acc(x.acc) || {}).cur) +
          "</button>"
        );
      })
      .join("") +
    "</div>"
  );
}
function favCard() {
  if (cur === "other") return "";
  return (
    '<div class="card"><b>⭐ 常用记录</b><div class="mute">记账时点「⭐ 存为常用」添加，总览一点就能带出。点下面的可删除</div><div class="chips" style="margin-top:8px">' +
    (S.fav || [])
      .map(function (f, i) {
        return (
          '<button class="chip" data-act="favdel" data-i="' + i + '">' + esc(f.name) + " ✕</button>"
        );
      })
      .join("") +
    "</div></div>"
  );
}
async function csv() {
  try {
    var dl = await claude.use("downloads");
    if (!dl) return;
    var rows = [["日期", "类型", "账户", "分类", "金额", "币种", "备注", "记录人"]];
    S.tx
      .slice()
      .sort(function (a, b) {
        return a.date.localeCompare(b.date);
      })
      .forEach(function (t) {
        var a = acc(t.acc) || {};
        rows.push([
          t.date,
          { expense: "支出", income: "收入", transfer: "转账" }[t.type],
          a.name || "",
          t.cat || (t.type === "transfer" ? "→ " + ((acc(t.to) || {}).name || "") : ""),
          t.amt,
          a.cur || "",
          t.note || "",
          t.by || "",
        ]);
      });
    var s =
      "\ufeff" +
      rows
        .map(function (r) {
          return r
            .map(function (v) {
              return '"' + String(v).replace(/"/g, '""') + '"';
            })
            .join(",");
        })
        .join("\n");
    await dl.save({ filename: "ledger.csv", data: s });
  } catch (e) {}
}
function hashGo() {
  if (location.hash === "#scan" && camOK && cur !== "other" && !document.getElementById("scanp"))
    showScan();
}
function showScan() {
  var m = openSheet(
    '<div style="text-align:center;padding:10px 0"><div style="font-size:44px">📷</div><b>选择付款截图</b><div class="mute" style="margin:6px 0 14px">选刚刚的 TNG 截图，会自动读出金额</div><button class="btn" id="pk">选择截图</button></div>',
  );
  m.id = "scanp";
  m.querySelector("#pk").onclick = function () {
    m.remove();
    document.getElementById("shot").click();
  };
  try {
    history.replaceState(null, "", location.href.split("#")[0]);
  } catch (e) {}
}
function pF(on) {
  return cur === "mine"
    ? '<label style="display:flex;gap:8px;align-items:center;color:var(--ink)"><input type="checkbox" id="pv" style="width:auto"' +
        (on ? " checked" : "") +
        "> 🔒 只有我看得到（对方看不到）</label>"
    : "";
}
function askNum(t, cb) {
  var m = openSheet(
    "<b>" +
      t +
      '</b><input id="an" type="number" inputmode="decimal" step="0.01" style="margin-top:10px"><button class="btn" id="ok">确定</button>',
  );
  m.querySelector("#an").focus();
  m.querySelector("#ok").onclick = function () {
    var v = parseFloat(m.querySelector("#an").value);
    if (v > 0) {
      m.remove();
      cb(v);
    }
  };
}
function goalSheet() {
  var m = openSheet(
    '<b>新储蓄目标</b><label>名称</label><input id="gn" placeholder="旅行基金、买相机"><label>目标金额（' +
      S.base +
      '）</label><input id="gt" type="number" inputmode="decimal">' +
      pF(0) +
      '<button class="btn" id="ok">添加</button>',
  );
  m.querySelector("#ok").onclick = function () {
    var n = m.querySelector("#gn").value.trim(),
      t = parseFloat(m.querySelector("#gt").value),
      q = m.querySelector("#pv");
    if (n && t > 0) {
      S.goals.push({ id: uid(), name: n, target: t, saved: 0, p: q && q.checked ? 1 : undefined });
      save();
      m.remove();
      render();
    }
  };
}
function annSheet() {
  var m = openSheet(
    '<b>新纪念日</b><label>名称</label><input id="an2" placeholder="在一起、生日、第一次约会"><label>日期</label><input id="ad" type="date" value="' +
      today() +
      '"><label>类型</label><select id="at"><option value="y">每年纪念（倒数天数）</option><option value="s">在一起起算（已经几天）</option></select>' +
      pF(0) +
      '<button class="btn" id="ok">添加</button>',
  );
  m.querySelector("#ok").onclick = function () {
    var n = m.querySelector("#an2").value.trim(),
      d = m.querySelector("#ad").value,
      q = m.querySelector("#pv");
    if (n && d) {
      (S.ann = S.ann || []).push({
        id: uid(),
        name: n,
        date: d,
        since: m.querySelector("#at").value === "s" ? 1 : undefined,
        p: q && q.checked ? 1 : undefined,
      });
      save();
      m.remove();
      render();
    }
  };
}
function wishSheet() {
  var m = openSheet(
    '<b>想买的东西</b><label>名称</label><input id="wn" placeholder="相机、包包、机票"><label>价格（' +
      S.base +
      '，选填）</label><input id="wp" type="number" inputmode="decimal">' +
      pF(0) +
      '<button class="btn" id="ok">添加</button>',
  );
  m.querySelector("#ok").onclick = function () {
    var n = m.querySelector("#wn").value.trim(),
      p = parseFloat(m.querySelector("#wp").value) || 0,
      q = m.querySelector("#pv");
    if (n) {
      (S.wish = S.wish || []).push({
        id: uid(),
        name: n,
        price: p,
        p: q && q.checked ? 1 : undefined,
      });
      save();
      m.remove();
      render();
    }
  };
}
function wishTotal() {
  var t = 0;
  (S.wish || []).forEach(function (w) {
    if (!w.done) t += w.price || 0;
  });
  return t ? '<div class="mute" style="margin-top:8px">还没买的合计 ' + fmt(t) + "</div>" : "";
}
function lovely() {
  if (cur === "other") return "";
  var h =
    '<div class="card"><div class="row"><b class="sp">💗 纪念日</b><button class="chip on" data-act="addann">＋ 添加</button></div>' +
    (S.ann || [])
      .map(function (a, i) {
        return (
          '<div class="item row"><span class="sp">' +
          (a.p ? "🔒 " : "") +
          esc(a.name) +
          '<div class="mute">' +
          a.date +
          (a.since ? " 起算" : " 每年") +
          '</div></span><button class="chip" data-act="annedit" data-i="' +
          i +
          '">编辑</button></div>'
        );
      })
      .join("") +
    "</div>";
  h +=
    '<div class="card"><div class="row"><b class="sp">🛒 想买清单</b><button class="chip on" data-act="addwish">＋ 添加</button></div>' +
    (S.wish || [])
      .map(function (w, i) {
        return (
          '<div class="item row"><button class="chip' +
          (w.done ? " on" : "") +
          '" data-act="wdone" data-i="' +
          i +
          '">' +
          (w.done ? "✓" : "○") +
          '</button><span class="sp" style="' +
          (w.done ? "text-decoration:line-through;opacity:.6" : "") +
          '">' +
          (w.p ? "🔒 " : "") +
          esc(w.name) +
          '</span><span class="num">' +
          (w.price ? fmt(w.price) : "") +
          '</span><button class="chip" data-act="wedit" data-i="' +
          i +
          '">编辑</button></div>'
        );
      })
      .join("") +
    wishTotal() +
    "</div>";
  return h;
}
function annCard() {
  var a = S.ann || [];
  if (!a.length) return "";
  var td = new Date(),
    t0 = new Date(td.getFullYear(), td.getMonth(), td.getDate());
  return (
    '<div class="card"><b>💗 纪念日</b>' +
    a
      .map(function (x) {
        var d = new Date(x.date + "T00:00:00"),
          txt;
        if (x.since) {
          txt = "已经 " + Math.max(0, Math.floor((t0 - d) / 864e5)) + " 天";
        } else {
          var n = new Date(t0.getFullYear(), d.getMonth(), d.getDate());
          if (n < t0) n = new Date(t0.getFullYear() + 1, d.getMonth(), d.getDate());
          var k = Math.round((n - t0) / 864e5);
          txt = k ? k + " 天后" : "就是今天 🎉";
        }
        return (
          '<div class="item row"><span class="sp">' +
          (x.p ? "🔒 " : "") +
          esc(x.name) +
          '</span><span class="num inc">' +
          txt +
          "</span></div>"
        );
      })
      .join("") +
    "</div>"
  );
}
var needPush = false;
function autoReveal() {
  var ch = false,
    td = today();
  S.tx.forEach(function (t) {
    if (t.gift && t.gd && t.gd <= td) {
      delete t.gift;
      delete t.gd;
      delete t.p;
      ch = true;
    }
  });
  if (ch) {
    needPush = true;
    save();
  }
}
function gF(t) {
  return cur === "mine"
    ? '<label style="display:flex;gap:8px;align-items:center;color:var(--ink)"><input type="checkbox" id="gf" style="width:auto"' +
        (t.gift ? " checked" : "") +
        '> 🎁 惊喜礼物（揭晓前对方看不到）</label><div class="mute" style="margin-top:4px">自动揭晓日（选填，不填就手动揭晓）</div><input id="gd" type="date" value="' +
        (t.gd || "") +
        '">'
    : "";
}
function giftCard() {
  var g = S.tx.filter(function (t) {
    return t.gift;
  });
  return (
    '<div class="card"><b>🎁 惊喜礼物</b><div class="mute">记账时勾「惊喜礼物」，揭晓前对方看不到这笔，揭晓后才显示</div>' +
    g
      .map(function (t) {
        return (
          '<div class="item row"><div class="sp"><div class="ellip">' +
          esc(t.note || t.cat) +
          '</div><div class="mute">' +
          (t.gd ? "自动揭晓 " + t.gd : "手动揭晓") +
          '</div></div><span class="num">' +
          fmt(t.amt, (acc(t.acc) || {}).cur) +
          '</span><button class="chip on" data-act="reveal" data-i="' +
          t.id +
          '">揭晓</button></div>'
        );
      })
      .join("") +
    "</div>"
  );
}
function moodBubble() {
  var td = new Date(),
    by = {},
    e = "🐻",
    m = "今天也要好好记账哦",
    bad = null,
    warn = null;
  monthTx(mk(td)).forEach(function (t) {
    if (t.type === "expense") by[t.cat] = (by[t.cat] || 0) + cvt(t.amt, t);
  });
  Object.keys(S.budget || {}).forEach(function (k) {
    var b = S.budget[k],
      v = by[k] || 0;
    if (b > 0) {
      if (v > b && !bad) bad = k;
      else if (v >= b * 0.8 && v <= b && !warn) warn = k;
    }
  });
  var done = (S.goals || []).filter(function (g) {
    return g.target > 0 && g.saved >= g.target;
  });
  if (bad) {
    e = "😢";
    m = bad + "超支了，小熊哭哭…";
  } else if (warn) {
    e = "😟";
    m = warn + "快用完预算了，省着点";
  } else if (done.length) {
    e = "🎉";
    m = "「" + done[0].name + "」存够了！小熊转圈圈";
  } else {
    var a = sums(monthTx(mk(td))).e,
      b2 = sums(monthTx(mk(new Date(td.getFullYear(), td.getMonth() - 1, 1)))).e;
    if (a && b2 && a < b2 * (td.getDate() / 30)) {
      e = "😊";
      m = "这个月花得比上个月省，小熊很开心";
    }
  }
  return (
    '<div style="margin-top:12px;background:rgba(255,255,255,.22);border-radius:16px;padding:8px 12px;font-size:14px">' +
    e +
    " " +
    esc(m) +
    "</div>"
  );
}
var RC = 0,
  chat = [];
function recJ() {
  if (cur !== "joint") return "";
  var o = Object.keys(others)[0],
    ps = [[myId, myName]];
  if (o) ps.push([o, names[o] || "对方"]);
  return (
    '<label>谁付款</label><select id="rp">' +
    ps
      .map(function (p) {
        return '<option value="' + p[0] + '" data-n="' + esc(p[1]) + '">' + esc(p[1]) + "</option>";
      })
      .join("") +
    '</select><label style="display:flex;gap:8px;align-items:center;color:var(--ink)"><input type="checkbox" id="ra2" style="width:auto"> AA 平分（另一人欠一半）</label>'
  );
}
function todayCard() {
  if (RO && 0) return "";
  var td = new Date(),
    ym = mk(td),
    d = td.getDate(),
    dim = new Date(td.getFullYear(), td.getMonth() + 1, 0).getDate(),
    left = dim - d + 1,
    B = 0;
  Object.keys(S.budget || {}).forEach(function (k) {
    B += S.budget[k] || 0;
  });
  var spent = 0,
    tdy = 0,
    disc = 0,
    pend = 0,
    net = 0;
  monthTx(ym).forEach(function (t) {
    if (t.type === "expense" || (t.type === "transfer" && t.fee)) {
      var v = cvt(t.type === "expense" ? t.amt : t.fee, t);
      spent += v;
      if (t.date === today()) tdy += v;
      if ((t.note || "").indexOf("（定期）") < 0) disc += v;
    }
  });
  (S.rec || []).forEach(function (r) {
    if (r.day > d && r.last !== ym) pend += cvt(r.amt, { acc: r.acc });
  });
  S.accounts.forEach(function (a) {
    net += conv(balance(a), a.cur, S.base);
  });
  var avg = disc / d,
    fc = net - avg * (dim - d) - pend,
    h = '<div class="card"><b>🐻 今天还能花</b>';
  if (B > 0) {
    var al = (B - (spent - tdy)) / left - tdy;
    h +=
      '<div class="big" style="color:' +
      (al < 0 ? "var(--exp)" : "var(--acc)") +
      ';font-size:30px;margin:4px 0">' +
      fmt(al) +
      '</div><div class="mute">月预算 ' +
      fmt(B) +
      "，已花 " +
      fmt(spent) +
      "，还剩 " +
      left +
      " 天（含今天）</div>";
  } else
    h +=
      '<div class="mute" style="margin:6px 0">到「更多」设月预算，这里就会显示每天的安全额度</div>';
  if (spent > 0)
    h +=
      '<div class="item"><div class="mute">📈 月底预测</div><div class="num ' +
      (fc < 0 ? "exp" : "") +
      '">预计剩 ' +
      fmt(fc) +
      '</div><div class="mute">按目前日常花费每天约 ' +
      fmt(avg) +
      "，加上还没扣的定期账单 " +
      fmt(pend) +
      "</div></div>";
  return h + "</div>";
}
function askCard() {
  if (!camOK || cur === "other") return "";
  return '<div class="card row" data-act="ask" style="cursor:pointer"><div class="ico">🐻</div><div class="sp"><b>问问小熊</b><div class="mute">问你的账本任何问题，例如「这个月为什么花这么多？」</div></div><span class="mute">›</span></div>';
}
function ctxText() {
  var tx = S.tx
    .slice()
    .sort(function (a, b) {
      return b.date.localeCompare(a.date);
    })
    .slice(0, 250)
    .map(function (t) {
      var a = acc(t.acc) || {};
      return [
        t.date,
        t.type === "expense" ? "支出" : t.type === "income" ? "收入" : "转账",
        t.cat || "",
        Math.round(cvt(t.amt, t) * 100) / 100,
        a.name || "",
        t.note || "",
        t.by || "",
      ].join("|");
    })
    .join("\n");
  return (
    "主货币 " +
    S.base +
    "。今天 " +
    today() +
    "。\n账户：" +
    S.accounts
      .map(function (a) {
        return a.name + " " + fmt(balance(a), a.cur);
      })
      .join("；") +
    "\n月预算：" +
    JSON.stringify(S.budget || {}) +
    "\n储蓄目标：" +
    (S.goals || [])
      .map(function (g) {
        return g.name + " " + g.saved + "/" + g.target;
      })
      .join("；") +
    "\n定期账单：" +
    (S.rec || [])
      .map(function (r) {
        return r.name + " 每月" + r.day + "日 " + r.amt;
      })
      .join("；") +
    "\n记录（日期|类型|分类|金额(主货币)|账户|备注|记录人）：\n" +
    tx
  );
}
function askBear() {
  chat = [];
  var m = openSheet(
      '<b>🐻 问问小熊</b><div id="ch" style="max-height:45vh;overflow:auto;margin:10px 0"></div><div class="chips" id="sg"></div><div class="row" style="margin-top:10px"><input id="q2" placeholder="问问你的账本…"><button class="btn" id="go" style="width:auto;margin:0;padding:10px 16px">发送</button></div>',
    ),
    ch = m.querySelector("#ch"),
    inp = m.querySelector("#q2");
  function show() {
    ch.innerHTML = chat
      .map(function (x) {
        return (
          '<div style="margin:6px 0;padding:8px 12px;border-radius:14px;max-width:88%;white-space:pre-wrap;' +
          (x.role === "user"
            ? "background:var(--accbg);margin-left:auto"
            : "background:var(--bg)") +
          '">' +
          esc(x.show || x.content) +
          "</div>"
        );
      })
      .join("");
    ch.scrollTop = ch.scrollHeight;
  }
  m.querySelector("#sg").innerHTML = [
    "这个月为什么花这么多？",
    "哪里可以省钱？",
    "有没有每月重复扣款的订阅？",
    "帮我做一个本月总结",
  ]
    .map(function (s) {
      return '<button class="chip" data-s="' + esc(s) + '">' + esc(s) + "</button>";
    })
    .join("");
  async function send(q) {
    if (!q) return;
    var first = !chat.length;
    chat.push({
      role: "user",
      content: first
        ? "你是记账 app 里的草莓小熊助手。用简短、友好的中文回答，只根据下面的账本数据回答，没有的数据就说不知道，不要编造。金额用主货币。\n\n" +
          ctxText() +
          "\n\n问题：" +
          q
        : q,
      show: q,
    });
    show();
    ch.insertAdjacentHTML("beforeend", '<div class="mute">小熊在想…</div>');
    try {
      var sm = await claude.use("sample"),
        fn = typeof sm === "function" ? sm : sm.sample,
        r = await fn(
          chat.map(function (x) {
            return { role: x.role, content: x.content };
          }),
          { cache: false },
        );
      chat.push({ role: "assistant", content: r.text });
    } catch (e) {
      chat.push({ role: "assistant", content: "小熊现在答不出来，请稍后再试" });
    }
    show();
  }
  m.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.s) send(b.dataset.s);
    else if (b.id === "go") {
      var v = inp.value.trim();
      inp.value = "";
      send(v);
    }
  });
  inp.onkeydown = function (e) {
    if (e.key === "Enter") {
      var v = inp.value.trim();
      inp.value = "";
      send(v);
    }
  };
}
function mirror(rec, del) {
  if (!MINE) return;
  var id = "j" + rec.id;
  MINE.tx = (MINE.tx || []).filter(function (x) {
    return x.id !== id;
  });
  if (!del && rec.pacc && (rec.type === "expense" || rec.type === "income")) {
    MINE.tx.push({
      id: id,
      ts: rec.ts,
      type: rec.type,
      amt: rec.amt,
      acc: rec.pacc,
      cat: rec.cat,
      note: (rec.note ? rec.note + " " : "") + "（共同）",
      date: rec.date,
    });
  }
  LM.track("mine", MINE);
  try {
    localStorage.setItem(KEY, JSON.stringify(MINE));
  } catch (e) {}
  sync(MINE);
}
function peers() {
  if (cur !== "joint" || !MINE) return "";
  function blk(t, st) {
    var sv = S;
    S = st;
    var r = st.accounts
      .map(function (a) {
        return accRow(a, "");
      })
      .join("");
    S = sv;
    return '<div class="card"><b>' + t + "（只读）</b>" + r + "</div>";
  }
  var h = blk("我的账户", MINE),
    o = Object.keys(others)[0];
  if (o) {
    try {
      var ps = JSON.parse(others[o]);
      ps.rates = ps.rates || S.rates;
      ps.base = ps.base || "MYR";
      ps.tx = ps.tx || [];
      ps.accounts = (ps.accounts || []).map(function (a) {
        a.cur = a.cur || "MYR";
        return a;
      });
      h += blk((names[o] || "对方") + "的账户", ps);
    } catch (e) {}
  }
  return h;
}
var backTo = "";
function two(b, t) {
  if (b.dataset.s) {
    mark();
    return true;
  }
  b.dataset.s = 1;
  b.textContent = t || "再点一次确认删除";
  return false;
}
function toast(t) {
  var d = document.createElement("div");
  d.textContent = t;
  d.style.cssText =
    "position:fixed;left:50%;bottom:110px;transform:translateX(-50%);background:#4a2a33;color:#fff;padding:10px 16px;border-radius:14px;z-index:200;max-width:80%;text-align:center";
  document.body.appendChild(d);
  setTimeout(function () {
    d.remove();
  }, 2400);
}
try {
  window.alert = function (t) {
    toast(String(t));
  };
} catch (e) {}
function pinSheet() {
  var m = openSheet(
    '<b>设置 PIN 锁</b><div class="mute">4 到 6 位数字</div><input id="pn" type="password" inputmode="numeric" maxlength="6" style="margin-top:10px"><button class="btn" id="ok">保存</button>',
  );
  m.querySelector("#ok").onclick = function () {
    var p = m.querySelector("#pn").value;
    if (/^[0-9]{4,6}$/.test(p)) {
      S.pin = p;
      save();
      m.remove();
      render();
    } else toast("PIN 需要是 4 到 6 位数字");
  };
}
var UN = null;
function mark() {
  UN = { cur: cur, j: JSON.stringify(S), fresh: true };
}
function showUndo() {
  var d = document.createElement("div");
  d.style.cssText =
    "position:fixed;left:50%;bottom:110px;transform:translateX(-50%);background:#4a2a33;color:#fff;padding:10px 14px;border-radius:14px;z-index:200;display:flex;gap:14px;align-items:center";
  d.innerHTML =
    '<span>已删除</span><button style="background:none;border:0;color:#ffb3c6;font:inherit;font-weight:700;cursor:pointer">撤销</button>';
  d.querySelector("button").onclick = function () {
    undo();
    d.remove();
  };
  document.body.appendChild(d);
  setTimeout(function () {
    d.remove();
  }, 6000);
}
function undo() {
  if (!UN || UN.cur !== cur) return;
  var p = S.pin;
  S = JSON.parse(UN.j);
  S.pin = p;
  migrate();
  if (cur === "joint")
    S.tx.forEach(function (x) {
      if (x.pacc) mirror(x);
    });
  UN = null;
  save();
  render();
}
function squash(f, cb) {
  var r = new FileReader();
  r.onload = function () {
    var im = new Image();
    im.onload = function () {
      var k = Math.min(1, 560 / Math.max(im.width, im.height)),
        c = document.createElement("canvas");
      c.width = im.width * k;
      c.height = im.height * k;
      c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
      cb(c.toDataURL("image/jpeg", 0.6));
    };
    im.src = r.result;
  };
  r.readAsDataURL(f);
}
function form(title, fs, v, save1, del) {
  var h = "<b>" + title + "</b>";
  fs.forEach(function (f) {
    if (f.t === "chk")
      h +=
        '<label style="display:flex;gap:8px;align-items:center;color:var(--ink);margin:10px 0 0"><input type="checkbox" id="f_' +
        f.k +
        '" style="width:auto"' +
        (v[f.k] ? " checked" : "") +
        "> " +
        f.c +
        "</label>";
    else
      h +=
        "<label>" +
        f.l +
        "</label>" +
        (f.t === "sel"
          ? '<select id="f_' +
            f.k +
            '">' +
            f.o
              .map(function (o) {
                return (
                  '<option value="' +
                  esc(o[0]) +
                  '"' +
                  (String(v[f.k]) === String(o[0]) ? " selected" : "") +
                  ">" +
                  esc(o[1]) +
                  "</option>"
                );
              })
              .join("") +
            "</select>"
          : '<input id="f_' +
            f.k +
            '" type="' +
            (f.t || "text") +
            '"' +
            (f.t === "number" ? ' inputmode="decimal" step="0.01"' : "") +
            ' value="' +
            esc(v[f.k] == null ? "" : v[f.k]) +
            '" placeholder="' +
            esc(f.p || "") +
            '">');
  });
  h +=
    '<button class="btn" id="ok">保存</button>' +
    (del ? '<button class="btn ghost" id="dl">删除</button>' : "");
  var m = openSheet(h);
  m.querySelector("#ok").onclick = function () {
    var o = {};
    fs.forEach(function (f) {
      var e = m.querySelector("#f_" + f.k);
      o[f.k] = f.t === "chk" ? e.checked : e.value;
    });
    if (save1(o) !== false) {
      m.remove();
      render();
    }
  };
  if (del)
    m.querySelector("#dl").onclick = function () {
      if (two(this, "再点一次确认删除")) {
        del();
        m.remove();
        render();
      }
    };
}
function goalSheet(i) {
  var g = i == null ? {} : S.goals[i];
  form(
    i == null ? "新储蓄目标" : "编辑储蓄目标",
    [
      { k: "name", l: "名称", p: "旅行基金、买相机" },
      { k: "target", l: "目标金额（" + S.base + "）", t: "number" },
      { k: "saved", l: "已存金额", t: "number" },
    ].concat(cur === "mine" ? [{ k: "p", t: "chk", c: "🔒 只有我看得到" }] : []),
    g,
    function (o) {
      var t = parseFloat(o.target);
      if (!o.name.trim() || !(t > 0)) {
        toast("请填写名称和目标金额");
        return false;
      }
      var r = {
        id: g.id || uid(),
        name: o.name.trim(),
        target: t,
        saved: parseFloat(o.saved) || 0,
        p: o.p ? 1 : undefined,
      };
      if (i == null) S.goals.push(r);
      else S.goals[i] = r;
      save();
    },
    i == null
      ? null
      : function () {
          S.goals.splice(i, 1);
          save();
        },
  );
}
function annSheet(i) {
  var g = i == null ? {} : S.ann[i];
  form(
    i == null ? "新纪念日" : "编辑纪念日",
    [
      { k: "name", l: "名称", p: "在一起、生日、第一次约会" },
      { k: "date", l: "日期", t: "date" },
      {
        k: "type",
        l: "类型",
        t: "sel",
        o: [
          ["y", "每年纪念（倒数天数）"],
          ["s", "在一起起算（已经几天）"],
        ],
      },
    ].concat(cur === "mine" ? [{ k: "p", t: "chk", c: "🔒 只有我看得到" }] : []),
    { name: g.name, date: g.date || today(), type: g.since ? "s" : "y", p: g.p },
    function (o) {
      if (!o.name.trim() || !o.date) {
        toast("请填写名称和日期");
        return false;
      }
      var r = {
        id: g.id || uid(),
        name: o.name.trim(),
        date: o.date,
        since: o.type === "s" ? 1 : undefined,
        p: o.p ? 1 : undefined,
      };
      S.ann = S.ann || [];
      if (i == null) S.ann.push(r);
      else S.ann[i] = r;
      save();
    },
    i == null
      ? null
      : function () {
          S.ann.splice(i, 1);
          save();
        },
  );
}
function wishSheet(i) {
  var g = i == null ? {} : S.wish[i];
  form(
    i == null ? "想买的东西" : "编辑想买的东西",
    [
      { k: "name", l: "名称", p: "相机、包包、机票" },
      { k: "price", l: "价格（" + S.base + "，选填）", t: "number" },
    ].concat(cur === "mine" ? [{ k: "p", t: "chk", c: "🔒 只有我看得到" }] : []),
    g,
    function (o) {
      if (!o.name.trim()) {
        toast("请填写名称");
        return false;
      }
      var r = {
        id: g.id || uid(),
        name: o.name.trim(),
        price: parseFloat(o.price) || 0,
        done: g.done,
        p: o.p ? 1 : undefined,
      };
      S.wish = S.wish || [];
      if (i == null) S.wish.push(r);
      else S.wish[i] = r;
      save();
    },
    i == null
      ? null
      : function () {
          S.wish.splice(i, 1);
          save();
        },
  );
}
function recSheet(i) {
  var g = i == null ? { day: 1, acc: (S.accounts[0] || {}).id, cat: S.cats.expense[0] } : S.rec[i],
    o2 = Object.keys(others)[0],
    ps = [[myId, myName]];
  if (o2) ps.push([o2, names[o2] || "对方"]);
  var fs = [
    { k: "name", l: "名称", p: "房租、Unifi、Netflix" },
    { k: "amt", l: "金额", t: "number" },
    {
      k: "acc",
      l: "扣款账户",
      t: "sel",
      o: S.accounts.map(function (a) {
        return [a.id, a.name + " (" + a.cur + ")"];
      }),
    },
    {
      k: "cat",
      l: "分类",
      t: "sel",
      o: S.cats.expense.map(function (c) {
        return [c, c];
      }),
    },
    { k: "day", l: "每月几号", t: "number" },
  ];
  if (cur === "joint")
    fs.push(
      { k: "byId", l: "谁付款", t: "sel", o: ps },
      { k: "aa", t: "chk", c: "AA 平分（另一人欠一半）" },
    );
  form(
    i == null ? "新定期账单" : "编辑定期账单",
    fs,
    g,
    function (o) {
      var a = parseFloat(o.amt),
        d = Math.min(28, Math.max(1, parseInt(o.day) || 1));
      if (!o.name.trim() || !(a > 0) || !S.accounts.length) {
        toast("请填写名称和金额");
        return false;
      }
      var r = {
        id: g.id || uid(),
        name: o.name.trim(),
        amt: a,
        acc: o.acc,
        cat: o.cat,
        day: d,
        last: g.last,
      };
      if (i == null && d <= new Date().getDate()) r.last = mk(new Date());
      if (cur === "joint") {
        r.byId = o.byId;
        r.by = (ps.find(function (p) {
          return p[0] === o.byId;
        }) || [])[1];
        if (o.aa) r.aa = 1;
      }
      if (i == null) S.rec.push(r);
      else S.rec[i] = r;
      save();
    },
    i == null
      ? null
      : function () {
          S.rec.splice(i, 1);
          save();
        },
  );
}
function subChips(n) {
  return ((S.sub || {})[n] || [])
    .map(function (x, j) {
      return '<button class="chip" data-sd="' + j + '">' + esc(x) + " ✕</button>";
    })
    .join("");
}
function askText(t, cb) {
  var m = openSheet(
    "<b>" +
      t +
      '</b><input id="at2" style="margin-top:10px" maxlength="12"><button class="btn" id="ok">确定</button>',
  );
  m.querySelector("#at2").focus();
  m.querySelector("#ok").onclick = function () {
    var v = m.querySelector("#at2").value.trim();
    if (v) {
      m.remove();
      cb(v);
    }
  };
}
var PRV = null;
function privOf(o) {
  var r = {};
  ["tx", "goals", "wish", "ann"].forEach(function (k) {
    var a = (o[k] || [])
      .filter(function (i) {
        return i.p;
      })
      .map(function (i) {
        var c = JSON.parse(JSON.stringify(i));
        delete c.img;
        return c;
      });
    if (a.length) r[k] = a;
  });
  return r;
}
function openSheet(html) {
  var m = document.createElement("div");
  m.className = "mask";
  m.innerHTML =
    '<div class="sheet"><button class="chip" data-close="1" style="margin-bottom:10px">‹ 返回</button>' +
    html +
    "</div>";
  m.addEventListener("click", function (e) {
    if (e.target === m || e.target.closest("[data-close]")) m.remove();
  });
  document.body.appendChild(m);
  return m;
}

function txSheet(edit, pre) {
  var t = edit ||
    pre || {
      type: "expense",
      amt: "",
      acc: S.accounts[0] && S.accounts[0].id,
      to: (S.accounts[1] || {}).id,
      cat: "餐饮",
      note: "",
      date: today(),
      fee: "",
    };
  if (!S.accounts.length) {
    alert("请先添加一个账户");
    return;
  }
  var st = { type: t.type, cat: t.cat };
  var m = openSheet("");
  var sh = m.querySelector(".sheet");
  function draw() {
    var opts = function (sel) {
      return S.accounts
        .filter(function (a) {
          return !a.hide || a.id === sel;
        })
        .map(function (a) {
          return (
            '<option value="' +
            a.id +
            '"' +
            (a.id === sel ? " selected" : "") +
            ">" +
            TYPES[a.type][1] +
            " " +
            esc(a.name) +
            "</option>"
          );
        })
        .join("");
    };
    var cats = S.cats[st.type === "income" ? "income" : "expense"];
    if (cats.indexOf(st.cat) < 0) st.cat = cats[0];
    sh.innerHTML =
      '<button class="chip" data-close="1" style="margin-bottom:10px">‹ 返回</button><div class="seg" id="sg">' +
      [
        ["expense", "支出"],
        ["income", "收入"],
        ["transfer", "转账"],
      ]
        .map(function (x) {
          return (
            '<button data-t="' +
            x[0] +
            '" class="' +
            (st.type === x[0] ? "on" : "") +
            '">' +
            x[1] +
            "</button>"
          );
        })
        .join("") +
      "</div>" +
      '<input class="amt" id="amt" type="number" inputmode="decimal" step="0.01" placeholder="0.00" value="' +
      esc(t.amt) +
      '"><div class="mute" style="text-align:center">' +
      ((acc(t.acc) || {}).cur || "") +
      "</div>" +
      myrF() +
      (st.type === "transfer"
        ? '<label>转出账户</label><select id="acc">' +
          opts(t.acc) +
          '</select><label>转入账户</label><select id="to">' +
          opts(t.to) +
          '</select><label>手续费（可选）</label><input id="fee" type="number" inputmode="decimal" step="0.01" value="' +
          esc(t.fee) +
          '">' +
          toF()
        : payF() +
          '<label>分类</label><div class="chips">' +
          cats
            .map(function (c) {
              return (
                '<button class="chip' +
                (c === st.cat ? " on" : "") +
                '" data-c="' +
                esc(c) +
                '">' +
                ci(c) +
                " " +
                esc(c) +
                "</button>"
              );
            })
            .join("") +
          '<button class="chip" data-c="__new">＋ 自定义</button></div>' +
          subF()) +
      aaF(t.aa, st.type, t.pay) +
      pF(t.p) +
      gF(t) +
      '<label>日期</label><input id="dt" type="date" value="' +
      t.date +
      '"><label>备注</label><input id="nt" value="' +
      esc(t.note) +
      '" placeholder="可不填">' +
      imgF() +
      '<button class="btn" id="ok">' +
      (edit ? "保存修改" : "保存") +
      "</button>" +
      (edit
        ? '<button class="btn ghost" id="del">删除这笔</button>'
        : '<button class="btn ghost" style="color:var(--acc)" id="fv">⭐ 存为常用</button>');
  }
  function payF() {
    var ao = function (s) {
      return S.accounts
        .filter(function (a) {
          return !a.hide || a.id === s;
        })
        .map(function (a) {
          return (
            '<option value="' +
            a.id +
            '"' +
            (a.id === s ? " selected" : "") +
            ">" +
            TYPES[a.type][1] +
            " " +
            esc(a.name) +
            "</option>"
          );
        })
        .join("");
    };
    if (cur !== "joint") return '<label>账户</label><select id="acc">' + ao(t.acc) + "</select>";
    var p = t.pay || "joint",
      h =
        '<label>谁付的</label><div class="seg" id="pyg">' +
        [
          ["joint", "共同账户"],
          ["me", "我付"],
          ["other", "对方付"],
        ]
          .map(function (x) {
            return (
              '<button data-py="' +
              x[0] +
              '" class="' +
              (p === x[0] ? "on" : "") +
              '">' +
              x[1] +
              "</button>"
            );
          })
          .join("") +
        "</div>";
    if (p === "joint") return h + '<label>账户</label><select id="acc">' + ao(t.acc) + "</select>";
    if (p === "me")
      h +=
        '<label>用我的哪个账户（会同步记到「我的」）</label><select id="pacc"><option value="">不同步</option>' +
        (MINE.accounts || [])
          .map(function (a) {
            return (
              '<option value="' +
              a.id +
              '"' +
              (a.id === t.pacc ? " selected" : "") +
              ">" +
              esc(a.name) +
              " (" +
              a.cur +
              ")</option>"
            );
          })
          .join("") +
        "</select>";
    return (
      h +
      '<label>币种（选了我的账户则用该账户币种）</label><select id="pcu">' +
      CURS.map(function (c) {
        return (
          "<option" + ((t.pcu || t.cur || S.base) === c ? " selected" : "") + ">" + c + "</option>"
        );
      }).join("") +
      "</select>"
    );
  }
  function imgF() {
    if (cur !== "mine") return "";
    return (
      "<label>收据照片（只存在这台手机，不同步）</label>" +
      (t.img
        ? '<img alt="" src="' +
          t.img +
          '" style="width:100%;border-radius:12px"><button class="chip" id="rmimg" style="margin:6px 0">移除照片</button>'
        : "") +
      '<input type="file" accept="image/*" id="rimg">'
    );
  }
  function subF() {
    var L = (S.sub || {})[st.cat] || [];
    if (st.type === "transfer" || !L.length) return "";
    return (
      '<label>细分</label><div class="chips">' +
      L.map(function (x) {
        return (
          '<button class="chip' +
          (t.sub === x ? " on" : "") +
          '" data-sub="' +
          esc(x) +
          '">' +
          esc(x) +
          "</button>"
        );
      }).join("") +
      "</div>"
    );
  }
  function myrF() {
    var a = acc(t.acc);
    if (st.type === "transfer" || !a || a.cur === "MYR" || !S.rates[a.cur]) return "";
    var am = parseFloat(t.amt),
      r = S.rates[a.cur];
    return (
      '<div class="card" style="margin:8px 0;background:var(--accbg);box-shadow:none"><div class="mute">汇率 1 ' +
      a.cur + " = " + r + ' MYR</div><label style="margin-top:8px">折合 MYR（可手动改成实际扣款金额，不填则按汇率）</label><input id="myr" type="number" inputmode="decimal" step="0.01" placeholder="' +
      (am > 0 ? (am * r).toFixed(2) : "") + '" value="' + esc(t.myr || "") +
      '"><div class="mute" id="fxr" style="margin-top:4px">' +
      fxText(a.cur, am, parseFloat(t.myr)) + "</div></div>"
    );
  }
  function toF() {
    var a = acc(t.acc),
      b = acc(t.to);
    if (!a || !b || a.cur === b.cur) return "";
    var est = parseFloat(t.amt) > 0 ? conv(parseFloat(t.amt), a.cur, b.cur).toFixed(2) : "";
    return (
      "<label>到账金额（" +
      b.cur +
      '，不填则按汇率换算）</label><input id="ta" type="number" inputmode="decimal" step="0.01" placeholder="' +
      est +
      '" value="' +
      esc(t.toAmt || "") +
      '">'
    );
  }
  function keep() {
    var g = function (i) {
      var e = sh.querySelector("#" + i);
      return e ? e.value : "";
    };
    t.amt = g("amt");
    t.acc = g("acc") || t.acc;
    t.to = g("to") || t.to;
    t.fee = g("fee");
    t.toAmt = g("ta");
    t.myr = g("myr");
    var aq = sh.querySelector("#aa");
    if (aq) t.aa = aq.checked;
    var pq = sh.querySelector("#pv");
    if (pq) t.p = pq.checked;
    var gq = sh.querySelector("#gf");
    if (gq) {
      t.gift = gq.checked;
      t.gd = sh.querySelector("#gd").value;
    }
    var pa = sh.querySelector("#pacc");
    if (pa) t.pacc = pa.value;
    var pc = sh.querySelector("#pcu");
    if (pc) t.pcu = pc.value;
    t.date = g("dt") || t.date;
    t.note = g("nt");
  }
  draw();
  sh.addEventListener("input", function (e) {
    var id = e.target.id;
    if (id !== "amt" && id !== "myr") return;
    var sel = sh.querySelector("#acc"),
      ao = acc(sel ? sel.value : t.acc),
      mi = sh.querySelector("#myr"),
      info = sh.querySelector("#fxr");
    if (!ao || !mi) return;
    var am = parseFloat(sh.querySelector("#amt").value);
    mi.placeholder = am > 0 ? (am * (S.rates[ao.cur] || 0)).toFixed(2) : "";
    if (info) info.textContent = fxText(ao.cur, am, parseFloat(mi.value));
  });
  sh.addEventListener("change", function (e) {
    if (e.target.id === "rimg" && e.target.files[0]) {
      keep();
      squash(e.target.files[0], function (u) {
        t.img = u;
        draw();
      });
      return;
    }
    if (e.target.id === "acc" || e.target.id === "to") {
      keep();
      draw();
    }
  });
  sh.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.py) {
      keep();
      t.pay = b.dataset.py;
      if (t.pay !== "joint" && t.aa === undefined) t.aa = true;
      draw();
    } else if (b.dataset.sub !== undefined) {
      keep();
      t.sub = t.sub === b.dataset.sub ? undefined : b.dataset.sub;
      draw();
    } else if (b.id === "rmimg") {
      keep();
      t.img = undefined;
      draw();
    } else if (b.dataset.t) {
      keep();
      st.type = b.dataset.t;
      draw();
    } else if (b.dataset.c) {
      keep();
      if (b.dataset.c === "__new") {
        newCat(st.type === "income" ? "income" : "expense", function (nm) {
          st.cat = nm;
          draw();
        });
      } else {
        st.cat = b.dataset.c;
        t.sub = undefined;
      }
      draw();
    } else if (b.id === "del") {
      if (two(b, "再点一次确认删除")) {
        S.tx = S.tx.filter(function (x) {
          return x.id !== edit.id;
        });
        if (cur === "joint") mirror(edit, true);
        save();
        m.remove();
        render();
      }
    } else if (b.id === "fv") {
      keep();
      var fa2 = parseFloat(t.amt);
      if (st.type !== "transfer" && fa2 > 0) {
        (S.fav = S.fav || []).push({
          name: t.note || st.cat,
          type: st.type,
          amt: fa2,
          acc: t.acc,
          cat: st.cat,
          note: t.note,
        });
        save();
        b.textContent = "已存 ✓";
      } else b.textContent = "请先填金额（转账不能存）";
    } else if (b.id === "ok") {
      keep();
      var amt = parseFloat(t.amt);
      if (!(amt > 0)) {
        alert("请输入大于 0 的金额");
        return;
      }
      if (st.type === "transfer" && t.acc === t.to) {
        alert("转出和转入账户不能相同");
        return;
      }
      if (
        !edit &&
        !b.dataset.dup &&
        S.tx.some(function (x) {
          return x.date === t.date && x.amt === amt && x.acc === t.acc && x.type === st.type;
        })
      ) {
        b.dataset.dup = 1;
        b.textContent = "已有相同金额的记录，再点一次确认保存";
        return;
      }
      var rec = {
        id: edit ? edit.id : uid(),
        ts: edit ? edit.ts : Date.now(),
        by: cur === "joint" ? (edit && edit.by) || myName : undefined,
        byId: cur === "joint" ? (edit && edit.byId) || myId : undefined,
        aa: cur === "joint" && st.type === "expense" && t.aa ? 1 : undefined,
        p: cur === "mine" && (t.p || t.gift) ? 1 : undefined,
        gift: cur === "mine" && t.gift ? 1 : undefined,
        gd: cur === "mine" && t.gift && t.gd ? t.gd : undefined,
        img: cur === "mine" ? t.img : undefined,
        sub:
          st.type !== "transfer" && ((S.sub || {})[st.cat] || []).indexOf(t.sub) >= 0
            ? t.sub
            : undefined,
        type: st.type,
        amt: amt,
        acc: t.acc,
        date: t.date,
        note: t.note,
      };
      var fa0 = acc(t.acc),
        mv = parseFloat(t.myr);
      if (st.type !== "transfer" && fa0 && fa0.cur !== "MYR" && mv > 0) rec.myr = mv;
      if (cur === "joint" && st.type !== "transfer") {
        var py = t.pay || "joint";
        rec.pay = py;
        if (py === "joint") {
          rec.aa = undefined;
        } else {
          var ob = Object.keys(others)[0],
            pa2 = (MINE.accounts || []).find(function (a) {
              return a.id === t.pacc;
            });
          rec.acc = "";
          rec.byId = py === "me" ? myId : ob || "other";
          rec.by = py === "me" ? myName : names[ob] || "对方";
          rec.aa = st.type === "expense" && t.aa ? 1 : undefined;
          rec.pacc = py === "me" && pa2 ? pa2.id : undefined;
          rec.cur = py === "me" && pa2 ? pa2.cur : t.pcu || S.base;
        }
      }
      if (st.type === "transfer") {
        rec.to = t.to;
        rec.fee = parseFloat(t.fee) || 0;
        var fa = acc(t.acc),
          fb = acc(t.to);
        rec.toAmt = parseFloat(t.toAmt) || (fa && fb ? +conv(amt, fa.cur, fb.cur).toFixed(2) : amt);
      } else rec.cat = st.cat;
      if (edit)
        S.tx = S.tx.map(function (x) {
          return x.id === edit.id ? rec : x;
        });
      else S.tx.push(rec);
      if (cur === "joint") mirror(rec);
      save();
      m.remove();
      render();
    }
  });
}

function accSheet(id) {
  var a = id === "new" ? { name: "", type: "bank", bal: 0 } : acc(id);
  var m = openSheet(
    "<b>" +
      (id === "new" ? "新账户" : "编辑账户") +
      '</b><label>名称</label><input id="n" value="' +
      esc(a.name) +
      '" placeholder="例如：招商银行、支付宝"><label>类型</label><div class="chips">' +
      Object.keys(TYPES)
        .map(function (k) {
          return (
            '<button class="chip' +
            (k === a.type ? " on" : "") +
            '" data-k="' +
            k +
            '">' +
            TYPES[k][1] +
            " " +
            TYPES[k][0] +
            "</button>"
          );
        })
        .join("") +
      '</div><label>初始余额（信用卡欠款填负数）</label><input id="b" type="number" inputmode="decimal" step="0.01" value="' +
      (+a.bal || 0) +
      '"><button class="btn" id="ok">保存</button>' +
      (id !== "new" ? '<button class="btn ghost" id="del">删除账户</button>' : ""),
  );
  var type = a.type;
  m.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.k) {
      type = b.dataset.k;
      m.querySelectorAll("[data-k]").forEach(function (x) {
        x.classList.toggle("on", x === b);
      });
    } else if (b.id === "ok") {
      var n = m.querySelector("#n").value.trim();
      if (!n) {
        alert("请填写账户名称");
        return;
      }
      var bal = parseFloat(m.querySelector("#b").value) || 0;
      if (id === "new") S.accounts.push({ id: uid(), name: n, type: type, bal: bal });
      else {
        a.name = n;
        a.type = type;
        a.bal = bal;
      }
      save();
      m.remove();
      render();
    } else if (b.id === "del") {
      var used = S.tx.some(function (t) {
        return t.acc === id || t.to === id;
      });
      if (two(b, used ? "再点一次：账户和它的所有记录都会删除" : "再点一次确认删除")) {
        S.accounts = S.accounts.filter(function (x) {
          return x.id !== id;
        });
        S.tx = S.tx.filter(function (t) {
          return t.acc !== id && t.to !== id;
        });
        save();
        m.remove();
        render();
      }
    }
  });
}

document.addEventListener("click", function (e) {
  var el = e.target.closest(
    "[data-tab],[data-go],[data-tx],[data-acc],[data-m],[data-sm],[data-sn],[data-sd],[data-base],[data-addcat],[data-delcat],[data-bk],[data-act]",
  );
  if (e.target.id === "cam") {
    document.getElementById("shot").click();
    return;
  }
  if (e.target.id === "fab") {
    txSheet();
    return;
  }
  if (!el || el.closest(".mask")) return;
  if (
    RO &&
    !(
      el.dataset.tab ||
      el.dataset.go ||
      el.dataset.m ||
      el.dataset.sm ||
      el.dataset.sn ||
      el.dataset.sd ||
      el.dataset.act === "back" ||
      el.dataset.act === "sw"
    )
  )
    return;
  if (el.dataset.tab) {
    backTo = "";
    tab = el.dataset.tab;
    render();
  } else if (el.dataset.sm) {
    statMode = el.dataset.sm;
    render();
  } else if (el.dataset.sn) {
    statNav(+el.dataset.sn);
    render();
  } else if (el.dataset.sd) {
    var sd = el.dataset.sd;
    if (sd.length === 10) {
      statMode = "day";
      statDay = sd;
    } else {
      statMode = "month";
      mon = new Date(+sd.slice(0, 4), +sd.slice(5, 7) - 1, 1);
    }
    render();
  } else if (el.dataset.go) {
    backTo = tab;
    tab = el.dataset.go;
    render();
  } else if (el.dataset.tx) {
    var t = S.tx.find(function (x) {
      return x.id === el.dataset.tx;
    });
    if (t) txSheet(JSON.parse(JSON.stringify(t)));
  } else if (el.dataset.acc) {
    accSheet2(el.dataset.acc);
  } else if (el.dataset.base) {
    S.base = el.dataset.base;
    save();
    render();
  } else if (el.dataset.addcat) {
    newCat(el.dataset.addcat, render);
  } else if (el.dataset.delcat) {
    var q = el.dataset.delcat.split(":");
    catSheet(q[0], +q[1]);
    return;
    if (confirm("删除分类“" + S.cats[q[0]][q[1]] + "”？旧记录会保留。")) {
      S.cats[q[0]].splice(+q[1], 1);
      save();
      render();
    }
  } else if (el.dataset.bk) {
    backup(el.dataset.bk);
  } else if (el.dataset.act) {
    act(el.dataset.act, el.dataset.i);
  } else if (el.dataset.m) {
    mon = new Date(mon.getFullYear(), mon.getMonth() + +el.dataset.m, 1);
    render();
  }
});
document.addEventListener("change", function (e) {
  if (e.target.id === "shot" && e.target.files[0]) {
    scan(e.target.files[0]);
    e.target.value = "";
    return;
  }
  if (e.target.id === "fa") {
    fAcc = e.target.value;
    render();
  }
  if (e.target.dataset.bud) {
    var bv = parseFloat(e.target.value);
    if (bv > 0) S.budget[e.target.dataset.bud] = bv;
    else delete S.budget[e.target.dataset.bud];
    save();
  }
  if (e.target.dataset.rate) {
    var v = parseFloat(e.target.value);
    if (v > 0) {
      if (e.target.closest("details")) ratesMore = true;
      S.rates[e.target.dataset.rate] = v;
      save();
      render();
    }
  }
});
document.addEventListener("input", function (e) {
  if (e.target.id === "q") {
    fQ = e.target.value;
    var p = e.target.selectionStart;
    render();
    var q = document.getElementById("q");
    q.focus();
    q.setSelectionRange(p, p);
  }
});
runRec();
autoReveal();
render();
lock();
initShare();
window.addEventListener("hashchange", hashGo);
hashGo();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(function () {});