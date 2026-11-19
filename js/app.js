var KEY = "ledger.v1";
// 新增的常用分类（名称、图标由 CI 提供、默认细分）。老用户第一次打开时会一次性补进去
var NEWCATS = [
  ["外卖", ["GrabFood", "foodpanda", "ShopeeFood", "其他"]],
  ["咖啡饮料", ["Starbucks", "ZUS Coffee", "Tealive", "Chagee", "Gong Cha", "Luckin", "咖啡", "奶茶"]],
  ["超市杂货", ["AEON", "Lotus's", "Giant", "99 Speedmart", "Mydin", "Jaya Grocer", "NSK", "Econsave", "7-Eleven", "KK Mart", "菜市场", "水果"]],
  ["日用品", ["纸巾", "洗衣液", "洗发水", "牙膏", "清洁用品", "Mr DIY", "Watsons", "Guardian"]],
  ["订阅会员", ["Netflix", "Spotify", "YouTube Premium", "Disney+", "iCloud", "Google One", "ChatGPT", "Claude", "Apple Music", "Canva", "Microsoft 365"]],
  ["衣服鞋包", ["Uniqlo", "H&M", "Zara", "Padini", "Nike", "Adidas", "鞋子", "包包"]],
  ["手机数码", ["Apple", "Samsung", "Xiaomi", "Huawei", "充电线", "耳机", "手机壳", "维修"]],
  ["美容美发", ["理发", "美甲", "护肤", "化妆品", "Sephora"]],
  ["运动健身", ["健身房", "Anytime Fitness", "羽毛球", "游泳", "Decathlon"]],
  ["宠物", ["猫粮", "狗粮", "兽医", "猫砂", "玩具"]],
  ["汽车", ["保养", "洗车", "罚单", "Road Tax", "保险", "轮胎"]],
  ["保险", ["AIA", "Great Eastern", "Prudential", "Allianz", "Takaful", "医疗卡"]],
  ["礼物红包", ["红包", "生日礼物", "请客", "孝敬父母", "婚礼红包"]],
  ["孩子", ["学费", "玩具", "尿布", "奶粉", "衣服"]],
  ["家居维修", ["家具", "家电", "维修", "IKEA", "装修"]],
  ["税费罚款", ["所得税", "门牌税", "罚单", "驾照", "手续费"]],
  ["慈善捐款", ["捐款", "庙宇", "教堂", "天课"]],
];
// 给原有分类补上常用细分（只补缺的，不会删你自己加的）
var SUBADD = {
  餐饮: ["聚餐", "甜点", "水果"],
  交通: ["Touch 'n Go", "LRT/MRT", "巴士", "Maxim", "InDrive", "KTM"],
  购物: ["Shopee", "Lazada", "TikTok Shop", "Mr DIY"],
  娱乐: ["TGV", "GSC", "Steam", "PlayStation", "KTV", "演唱会"],
  医疗: ["诊所", "药房", "牙医", "体检", "眼镜"],
  水电网络: ["TNB 电费", "Air Selangor 水费", "Unifi 宽带", "Time 宽带", "Maxis 宽带", "Astro", "煤气", "Indah Water"],
  话费充值: ["StarHub", "中国移动"],
  学习: ["学费", "书本", "网课", "文具", "补习"],
  房租: ["房租", "管理费", "押金"],
  油费: ["Petronas", "Shell", "Petron", "Caltex", "BHP", "Setel"],
};
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
  "话费充值",
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
  // 一次性补上「话费充值」分类（用现金 / TNG 等给 U Mobile 之类充值），删掉后不会再自动加回来
  S.mig = S.mig || {};
  if (!S.mig.topup) {
    S.mig.topup = 1;
    var ex = S.cats.expense;
    if (ex.indexOf("话费充值") < 0) {
      var oi = ex.indexOf("其他");
      if (oi >= 0) ex.splice(oi, 0, "话费充值");
      else ex.push("话费充值");
    }
    if (!S.ci["话费充值"]) S.ci["话费充值"] = "📶";
    if (!S.sub["话费充值"])
      S.sub["话费充值"] = [
        "U Mobile", "Hotlink", "CelcomDigi", "Unifi Mobile", "Yoodo", "Tune Talk",
        "redONE", "XOX", "Buzzme", "Speakout", "Singtel", "其他",
      ];
  }
  if (!S.mig.cats2) {
    S.mig.cats2 = 1;
    var ex2 = S.cats.expense;
    NEWCATS.forEach(function (n) {
      if (ex2.indexOf(n[0]) < 0) {
        var oi2 = ex2.indexOf("其他");
        if (oi2 >= 0) ex2.splice(oi2, 0, n[0]);
        else ex2.push(n[0]);
      }
      if (!S.sub[n[0]]) S.sub[n[0]] = n[1].slice();
    });
    Object.keys(SUBADD).forEach(function (k) {
      var L = (S.sub[k] = S.sub[k] || []);
      SUBADD[k].forEach(function (x) {
        if (L.indexOf(x) < 0) L.push(x);
      });
    });
  }
  S.cars = S.cars || [];
  S.pl = S.pl || [];
  S.shop = S.shop || [];
  S.loans = S.loans || [];
  S.fav = S.fav || [];
  // 第一次用快速记账时放 3 个示例模板（可在「快速记账 → 管理模板」里改 / 删）
  if (!S.mig.qk && cur !== "joint" && cur !== "other") {
    S.mig.qk = 1;
    if (!S.fav.length)
      S.fav.push(
        { name: "U Mobile 充值", type: "expense", amt: 30, acc: "", cat: "话费充值", sub: "U Mobile" },
        { name: "早餐", type: "expense", amt: 8, acc: "", cat: "餐饮" },
        { name: "Grab", type: "expense", amt: 15, acc: "", cat: "交通" },
      );
  }
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
  return (n * (S.rates[f] || 1)) / (S.rates[t] || 1);
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
  fQ = "",
  fF = "all",
  selMode = false,
  sel = {},
  trendCat = "",
  qManage = false,
  perMon = new Date(),
  shopW = false;
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
  if (!isFinite(n)) n = 0;
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
    if (t.sp && t.sp.pays)
      t.sp.pays.forEach(function (p) {
        if (p.acc !== a.id) return;
        var ta = acc(t.acc);
        b += ta && ta.cur && a.cur && ta.cur !== a.cur ? conv(p.amt, ta.cur, a.cur) : p.amt;
      });
    if (t.type === "income" && t.acc === a.id) b += t.amt;
    if (t.type === "expense" && t.acc === a.id) b -= t.amt;
    if (t.type === "transfer") {
      if (t.acc === a.id) b -= t.amt + (t.fee || 0);
      if (t.to === a.id) b += t.toAmt != null ? t.toAmt : t.amt;
    }
  });
  (S.loans || []).forEach(function (l) {
    var lc = loanCur(l);
    if (l.acc === a.id) b += l.dir === "borrow" ? l.amt : -l.amt;
    (l.pays || []).forEach(function (p) {
      if ((p.acc || l.acc) !== a.id) return;
      var v = a.cur && lc && a.cur !== lc ? conv(p.amt, lc, a.cur) : p.amt;
      b += l.dir === "borrow" ? -v : v;
    });
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
// ---------- 汽车：油耗 / 保养提醒 ----------
// S.cars = [{ id, name, plate, odo, items: [{ name, km, months, lastKm, lastDate }] }]
// 加油记录 = 「油费」分类的支出 + t.car / t.odo(里程 km) / t.lit(升数)；按每次加满油计算
function carFills(id) {
  return S.tx
    .filter(function (t) {
      return t.car === id && t.type === "expense" && t.odo > 0;
    })
    .sort(function (a, b) {
      return a.odo - b.odo;
    });
}
function carStats(c) {
  var f = carFills(c.id),
    dist = 0, lit = 0, cost = 0, last = null, pc = 0, pl = 0;
  f.forEach(function (t, i) {
    if (t.lit > 0) {
      pc += cvt(t.amt, t);
      pl += t.lit;
    }
    if (i > 0 && t.lit > 0 && t.odo > f[i - 1].odo) {
      var d = t.odo - f[i - 1].odo, v = cvt(t.amt, t);
      dist += d;
      lit += t.lit;
      cost += v;
      last = { km: d, l100: (t.lit / d) * 100, perKm: v / d };
    }
  });
  return { n: f.length, dist: dist, avg: dist ? (lit / dist) * 100 : null, perKm: dist ? cost / dist : null, last: last, price: pl ? pc / pl : null };
}
function fuelNow(cid, odo, lit, amt, selfId, cu) {
  var out = [];
  if (lit > 0 && amt > 0) out.push("油价 " + fmt(amt / lit, cu) + "/L");
  var prev = carFills(cid)
    .filter(function (x) {
      return x.id !== selfId && x.odo < odo;
    })
    .pop();
  if (prev && odo > prev.odo) {
    var d = odo - prev.odo;
    out.push("距上次 " + d + " km");
    if (lit > 0) out.push("油耗 " + ((lit / d) * 100).toFixed(2) + " L/100km");
    if (amt > 0) out.push("每公里 " + fmt(amt / d, cu));
  }
  return out.length ? out.join(" · ") + "（按每次加满计算）" : "";
}
function svcStatus(c, it) {
  var out = [];
  if (it.km > 0) {
    var rem = (+it.lastKm || 0) + +it.km - (+c.odo || 0);
    out.push({ rem: rem, over: rem < 0, warn: rem <= 500, txt: rem >= 0 ? "还有 " + Math.round(rem) + " km" : "已超过 " + Math.round(-rem) + " km" });
  }
  if (it.months > 0 && it.lastDate) {
    var d0 = pd(it.lastDate),
      due = new Date(d0.getFullYear(), d0.getMonth() + +it.months, d0.getDate()),
      days = Math.round((due - pd(today())) / 864e5);
    out.push({ rem: days, over: days < 0, warn: days <= 30, txt: days >= 0 ? "还有 " + days + " 天（" + ds(due) + "）" : "已超过 " + -days + " 天" });
  }
  return out;
}
function carNew(cb) {
  var m = openSheet(
    '<b>🚗 添加车辆</b><label>名称</label><input id="cn" placeholder="例如：Myvi">' +
      '<label>车牌（选填）</label><input id="cp"><label>目前里程（km）</label><input id="co" type="number" inputmode="numeric"><button class="btn" id="ok">保存</button>',
  );
  m.querySelector("#ok").onclick = function () {
    var name = m.querySelector("#cn").value.trim();
    if (!name) return toast("请填车的名称");
    var odo = parseFloat(m.querySelector("#co").value) || 0,
      id = uid(),
      d = today();
    mark();
    S.cars.push({
      id: id, name: name, plate: m.querySelector("#cp").value.trim(), odo: odo,
      items: [
        { name: "换机油", km: 10000, months: 6, lastKm: odo, lastDate: d },
        { name: "路税 Road Tax", months: 12, lastDate: d },
        { name: "车险", months: 12, lastDate: d },
        { name: "车检 / 年检", months: 12, lastDate: d },
      ],
    });
    save();
    m.remove();
    render();
    if (cb) cb(id);
    else carSheet(id);
  };
}
function itemSheet(cid, idx, done) {
  var c = S.cars.find(function (x) { return x.id === cid; }),
    it = idx >= 0 ? c.items[idx] : { name: "", lastDate: today(), lastKm: c.odo || "" },
    m = openSheet(
      "<b>" + (idx >= 0 ? "修改" : "添加") + '保养项目</b><label>名称</label><input id="in" value="' + esc(it.name) +
        '" placeholder="例如：换机油、轮胎、电池"><label>每多少 km（不按里程就留空）</label><input id="ik" type="number" inputmode="numeric" value="' + esc(it.km || "") +
        '"><label>每多少个月（不按时间就留空）</label><input id="im" type="number" inputmode="numeric" value="' + esc(it.months || "") +
        '"><label>上次做的日期</label><input id="id" type="date" value="' + esc(it.lastDate || "") +
        '"><label>上次做的里程（km）</label><input id="il" type="number" inputmode="numeric" value="' + esc(it.lastKm || "") + '"><button class="btn" id="ok">保存</button>',
    );
  m.querySelector("#ok").onclick = function () {
    var o = {
      name: m.querySelector("#in").value.trim(),
      km: parseFloat(m.querySelector("#ik").value) || undefined,
      months: parseFloat(m.querySelector("#im").value) || undefined,
      lastDate: m.querySelector("#id").value || undefined,
      lastKm: parseFloat(m.querySelector("#il").value) || undefined,
    };
    if (!o.name) return toast("请填项目名称");
    mark();
    if (idx >= 0) c.items[idx] = o;
    else c.items.push(o);
    save();
    m.remove();
    render();
    if (done) done();
  };
}
function svcDoneSheet(cid, idx, done) {
  var c = S.cars.find(function (x) { return x.id === cid; }),
    it = c.items[idx],
    m = openSheet(
      "<b>✅ " + esc(it.name) + ' 已完成</b><label>日期</label><input id="dd" type="date" value="' + today() +
        '"><label>当时里程（km）</label><input id="do" type="number" inputmode="numeric" value="' + esc(c.odo || "") +
        '"><label>花了多少（选填，会同时记一笔「汽车」支出）</label><input id="dc" type="number" inputmode="decimal" step="0.01"><label>用哪个账户付</label><select id="da">' +
        S.accounts
          .filter(function (a) { return !a.hide; })
          .map(function (a) { return '<option value="' + a.id + '">' + esc(a.name) + " (" + a.cur + ")</option>"; })
          .join("") +
        '</select><button class="btn" id="ok">确定</button>',
    );
  m.querySelector("#da").value = defAcc();
  m.querySelector("#ok").onclick = function () {
    var date = m.querySelector("#dd").value || today(),
      odo = parseFloat(m.querySelector("#do").value) || 0,
      cost = parseFloat(m.querySelector("#dc").value);
    mark();
    it.lastDate = date;
    if (odo) {
      it.lastKm = odo;
      if (odo > (+c.odo || 0)) c.odo = odo;
    }
    if (cost > 0)
      S.tx.push({
        id: uid(), ts: Date.now(), type: "expense", amt: cost, acc: m.querySelector("#da").value, date: date,
        note: it.name + " · " + c.name, cat: S.cats.expense.indexOf("汽车") >= 0 ? "汽车" : "其他",
        sub: S.cats.expense.indexOf("汽车") >= 0 ? "保养" : undefined, car: c.id,
      });
    save();
    m.remove();
    render();
    if (done) done();
  };
}
function carSheet(id) {
  var m = openSheet(""),
    sh = m.querySelector(".sheet");
  function C() {
    return S.cars.find(function (x) { return x.id === id; });
  }
  function draw() {
    var c = C();
    if (!c) {
      m.remove();
      return;
    }
    var s = carStats(c),
      f = carFills(c.id).slice(-5).reverse();
    sh.innerHTML =
      '<button class="chip" data-close="1" style="margin-bottom:10px">‹ 返回</button><b>🚗 ' + esc(c.name) + (c.plate ? " · " + esc(c.plate) : "") +
      '</b><label>目前里程（km）</label><input id="codo" type="number" inputmode="numeric" value="' + esc(c.odo || "") +
      '"><div class="card" style="margin:12px 0;box-shadow:none;background:var(--accbg)">' +
      (s.avg != null
        ? '<div class="num" style="font-size:22px">' + s.avg.toFixed(2) + ' L/100km</div><div class="mute">平均每公里 ' + fmt(s.perKm) +
          (s.price ? " · 平均油价 " + fmt(s.price) + "/L" : "") + " · 共加油 " + s.n + " 次" +
          (s.last ? "<br>最近一次：" + s.last.l100.toFixed(2) + " L/100km，每公里 " + fmt(s.last.perKm) : "") + "</div>"
        : '<div class="mute">在「油费」分类记账时填上「里程」和「升数」，记两次以上就会算出油耗和每公里花费（按每次加满油计算）。</div>') +
      "</div><b>保养与到期提醒</b>" +
      (c.items || [])
        .map(function (it, i) {
          return (
            '<div class="item"><div class="row"><div class="sp"><b>' + esc(it.name) + '</b><div class="mute">' +
            [it.km ? "每 " + it.km + " km" : "", it.months ? "每 " + it.months + " 个月" : ""].filter(Boolean).join(" / ") +
            (it.lastDate ? " · 上次 " + esc(it.lastDate) : "") + (it.lastKm ? " · " + it.lastKm + " km" : "") + "</div>" +
            svcStatus(c, it)
              .map(function (x) {
                return '<div class="' + (x.over ? "exp" : x.warn ? "" : "mute") + '" style="font-size:13px">' + (x.over ? "🚨 " : x.warn ? "⚠️ " : "") + x.txt + "</div>";
              })
              .join("") +
            '</div><button class="chip on" data-cdone="' + i + '">完成</button><button class="chip" data-cedit="' + i + '">改</button></div></div>'
          );
        })
        .join("") +
      '<button class="chip" id="cadd" style="margin-top:8px">＋ 添加保养项目</button>' +
      (f.length
        ? '<div class="mute" style="margin-top:14px">最近加油</div>' +
          f
            .map(function (t) {
              return '<div class="mute">' + esc(t.date) + " · " + t.odo + " km" + (t.lit ? " · " + t.lit + " L" : "") + " · " + fmt(t.amt, (acc(t.acc) || {}).cur) + "</div>";
            })
            .join("")
        : "") +
      '<button class="btn ghost" id="crm">删除这辆车</button>';
  }
  draw();
  sh.addEventListener("change", function (e) {
    if (e.target.id !== "codo") return;
    C().odo = parseFloat(e.target.value) || 0;
    save();
    render();
    draw();
  });
  sh.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    var c = C(),
      d = b.dataset;
    if (d.cdone !== undefined) svcDoneSheet(id, +d.cdone, draw);
    else if (d.cedit !== undefined)
      itemSheet(id, +d.cedit, draw);
    else if (b.id === "cadd") itemSheet(id, -1, draw);
    else if (b.id === "crm") {
      if (!confirm("删除「" + c.name + "」？以前的加油记录会保留，只是不再关联这辆车")) return;
      mark();
      S.cars = S.cars.filter(function (x) { return x.id !== id; });
      save();
      m.remove();
      render();
    }
  });
}
function carCard() {
  if (cur !== "mine") return "";
  var h = '<div class="card"><b>🚗 车辆与油耗</b>';
  if (!S.cars.length) h += '<div class="mute">记录加油的里程和升数，自动算油耗和每公里花费；保养、路税、车险到期会提醒你。</div>';
  S.cars.forEach(function (c) {
    var s = carStats(c),
      w = [];
    (c.items || []).forEach(function (it) {
      svcStatus(c, it).forEach(function (x) {
        if (x.warn) w.push((x.over ? "🚨 " : "⚠️ ") + it.name + " " + x.txt);
      });
    });
    h +=
      '<div class="item row" data-car="' + c.id + '" style="cursor:pointer"><div class="ico">🚗</div><div class="sp"><b>' + esc(c.name) +
      (c.plate ? " · " + esc(c.plate) : "") + '</b><div class="mute">' + (c.odo ? c.odo + " km" : "未填里程") +
      (s.avg != null ? " · " + s.avg.toFixed(2) + " L/100km · " + fmt(s.perKm) + "/km" : "") + "</div>" +
      (w.length ? '<div class="exp" style="font-size:13px">' + esc(w[0]) + (w.length > 1 ? " 等 " + w.length + " 项" : "") + "</div>" : "") +
      "</div><span class=\"mute\">›</span></div>";
  });
  return h + '<button class="btn" id="carnew" style="margin-top:12px">＋ 添加车辆</button></div>';
}
// ---------- AA 分账（我先垫付，朋友之后还）----------
// t.sp = { n: 几个人, mine: 我的那份(可不填=平均), who: 谁欠我, pays: [{amt, acc, date}] }
function spMineOf(am, sp) {
  var m = parseFloat(sp.mine);
  return m >= 0 ? m : (parseFloat(am) || 0) / Math.max(2, parseInt(sp.n) || 2);
}
function spBack(t) {
  var v = 0;
  ((t.sp && t.sp.pays) || []).forEach(function (p) {
    v += +p.amt || 0;
  });
  return v;
}
function spOwed(t) {
  return t.sp ? Math.max(0, t.amt - spMineOf(t.amt, t.sp)) : 0;
}
// 扣掉朋友已经还我的钱之后，这一笔真正算我的支出
function spNet(t) {
  return Math.max(0, t.amt - spBack(t));
}
function spInfo(am, mine, back, cu) {
  if (!(am > 0)) return "";
  return (
    "朋友共欠 " + fmt(Math.max(0, am - mine), cu) +
    (back ? "，已收 " + fmt(back, cu) + "，还欠 " + fmt(Math.max(0, am - mine - back), cu) : "") +
    "。我的支出现在是 " + fmt(Math.max(0, am - back), cu) + "，朋友还清后会变成 " + fmt(mine, cu)
  );
}
function spPaySheet(t, left, cb) {
  var cu = (acc(t.acc) || {}).cur || "MYR",
    m = openSheet(
      "<b>💸 收到朋友还款</b><label>金额（" + cu + '）</label><input id="pa" type="number" inputmode="decimal" step="0.01" value="' +
        (left > 0 ? left.toFixed(2) : "") + '"><label>收进哪个账户</label><select id="pc">' +
        S.accounts
          .filter(function (a) { return !a.hide; })
          .map(function (a) { return '<option value="' + a.id + '"' + (a.id === t.acc ? " selected" : "") + ">" + esc(a.name) + " (" + a.cur + ")</option>"; })
          .join("") +
        '</select><label>日期</label><input id="pd" type="date" value="' + today() + '"><button class="btn" id="ok">确定</button>',
    );
  m.querySelector("#ok").onclick = function () {
    var v = parseFloat(m.querySelector("#pa").value),
      p = { amt: +v.toFixed(2), acc: m.querySelector("#pc").value, date: m.querySelector("#pd").value || today() };
    if (!(v > 0)) return toast("请填还款金额");
    m.remove();
    cb(p);
  };
}
function cvt(x, t) {
  var f = t.sp && x === t.amt && t.amt > 0 ? spNet(t) / t.amt : 1;
  // 手动填了实际 MYR 金额的外币记录，直接用它
  if (t.myr > 0 && x === t.amt && t.type !== "transfer") return conv(+t.myr, "MYR", S.base) * f;
  var a = acc(t.acc);
  return conv(x, a ? a.cur : t.cur || "MYR", S.base) * f;
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
  else if (tab === "chat") h = chatPage();
  else if (tab === "period") h = periodPage();
  else if (tab === "loans") h = loansPage();
  else if (tab === "subs") h = subsPage();
  else if (tab === "shop") h = shopPage();
  else h = settings();
  if (0)
    h =
      '<div class="card row" style="background:var(--accbg)"><div class="sp"><b>正在查看 ' +
      esc(names[viewId] || "对方") +
      ' 的账本</b><div class="mute">只读，不能修改</div></div><button class="chip on" data-act="back">返回我的</button></div>' +
      h;
  document.getElementById("fab").style.display = RO || tab === "chat" ? "none" : "";
  document.getElementById("cam").style.display = camOK && !RO && tab !== "chat" ? "" : "none";
  var ci0 = tab === "chat" && document.getElementById("cin"),
    cv = ci0 ? ci0.value : "",
    cf = ci0 && document.activeElement === ci0;
  h =
    (backTo && tab !== "home"
      ? '<button class="chip" data-tab="' + backTo + '" style="margin-bottom:8px">‹ 返回</button>'
      : "") +
    (tab === "chat" ? "" : switcher()) +
    h;
  document.getElementById("app").innerHTML = h;
  var c2 = document.getElementById("lg2");
  if (c2) drawIcon(c2);
  var tabs = [
    ["home", "总览", "🍓"],
    ["bills", "账单", "📒"],
    ["accts", "账户", "👛"],
    ["stats", "统计", "🍰"],
  ];
  if (chatOn()) tabs.push(["chat", "聊天", "💬"]);
  tabs.push(["set", "更多", "🧸"]);
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
        (t[0] === "chat" ? chatBadgeHtml() : "") +
        "</b>" +
        t[1] +
        "</button>"
      );
    })
    .join("");
  if (tab === "chat") {
    chatBind();
    var cn = document.getElementById("cin");
    if (cn && cv) cn.value = cv;
    if (cn && cf) cn.focus();
  }
  chatSub(tab === "chat" ? 2500 : 6000);
  updateBadge();
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
  if (t.sp) {
    var sb = spBack(t),
      sw = spOwed(t) - sb;
    sub += " · 👥 垫付 " + fmt(t.amt, a.cur) + (sb ? "，已收 " + fmt(sb, a.cur) : "") + (sw > 0.005 ? "，待收 " + fmt(sw, a.cur) : " ✓");
  }
  if (t.q) sub += ' · <b class="exp">❓ ' + esc((t.q.who || "") + (t.q.text ? "：" + t.q.text : " 有疑问")) + "</b>";
  if (t.odo || t.lit) sub += " · ⛽ " + (t.lit ? t.lit + " L" : "") + (t.lit && t.odo ? " · " : "") + (t.odo ? t.odo + " km" : "");
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
      fmt(t.myr > 0 ? t.myr * (t.sp && t.amt ? spNet(t) / t.amt : 1) : (t.sp ? spNet(t) : t.amt) * S.rates[a.cur], "MYR") +
      "</div>";
  return (
    '<div class="item row" data-tx="' +
    t.id +
    '" style="cursor:pointer">' +
    (selMode && tab === "bills" ? '<span style="font-size:18px">' + (sel[t.id] ? "☑️" : "⬜") + "</span>" : "") +
    '<div class="ico">' +
    (t.type === "transfer" ? "⇄" : txi(t)) +
    '</div><div class="sp"><div class="ellip">' +
    title +
    '</div><div class="mute ellip">' +
    sub +
    '</div></div><div class="num ' +
    cls +
    '">' +
    sign +
    fmt(t.sp ? spNet(t) : t.amt, a.cur).replace("-", "") +
    fx +
    "</div></div>"
  );
}

function periodCard() {
  var td = new Date(),
    ws = weekStart(td),
    we = new Date(ws.getFullYear(), ws.getMonth(), ws.getDate() + 6),
    y = td.getFullYear(),
    mm = mk(td),
    ps = [
      ["day", "今天", expIn(today(), today())],
      ["week", "本周", expIn(ds(ws), ds(we))],
      ["month", "本月", expIn(mm + "-01", mm + "-31")],
      ["year", "今年", expIn(y + "-01-01", y + "-12-31")],
    ];
  return (
    '<div class="card"><div class="mute" style="margin-bottom:6px">支出一览 · 点一下看详情</div><div class="row" style="gap:4px;align-items:flex-start">' +
    ps
      .map(function (p) {
        return (
          '<div class="sp" data-hm="' + p[0] + '" style="cursor:pointer;text-align:center"><div class="mute">' + p[1] +
          '</div><div class="num exp" style="font-size:13px">' + fmt(p[2]) + "</div></div>"
        );
      })
      .join("") +
    "</div></div>"
  );
}
function defAcc() {
  if (S.trip) {
    var ta = S.accounts.find(function (x) {
      return x.cur === S.trip.cur && !x.hide;
    });
    if (ta) return ta.id;
  }
  return S.accounts[0] && S.accounts[0].id;
}
// ---------- 快速记账 ----------
function plusMenu() {
  if (RO) return;
  var m = openSheet(
    '<b>记一笔</b><div class="row" style="margin-top:12px;gap:10px"><button class="btn" id="pq" style="margin-top:0">⚡ 快速记账</button><button class="btn" id="pf" style="margin-top:0;background:var(--accbg);color:var(--acc);box-shadow:none">✍️ 完整记账</button></div>',
  );
  m.querySelector("#pq").onclick = function () {
    m.remove();
    quickSheet();
  };
  m.querySelector("#pf").onclick = function () {
    m.remove();
    txSheet();
  };
}
function quickAdd(f) {
  var a = acc(f.acc) ? f.acc : defAcc(),
    pre = { type: f.type, amt: f.amt > 0 ? String(f.amt) : "", acc: a, to: "", cat: f.cat, sub: f.sub, note: f.note || "", date: f.date || today(), fee: "" };
  if (!(f.amt > 0) || cur === "joint") {
    txSheet(null, pre);
    return;
  }
  mark();
  S.tx.push({
    id: uid(), ts: Date.now(), type: f.type, amt: +f.amt, acc: a, date: f.date || today(), note: f.note || "", cat: f.cat,
    sub: ((S.sub || {})[f.cat] || []).indexOf(f.sub) >= 0 ? f.sub : undefined,
    trip: S.trip ? S.trip.name : undefined,
  });
  save();
  render();
  showUndo("已记：" + (f.name || f.cat) + " " + fmt(f.amt, (acc(a) || {}).cur));
}
function quickSheet() {
  var m = openSheet(""),
    sh = m.querySelector(".sheet");
  function draw() {
    var f = S.fav || [],
      last = S.tx
        .filter(function (t) {
          return t.type !== "transfer";
        })
        .sort(function (a, b) {
          return (b.ts || 0) - (a.ts || 0);
        })[0];
    sh.innerHTML =
      '<button class="chip" data-close="1" style="margin-bottom:10px">‹ 返回</button><b>⚡ 快速记账</b><div class="mute" style="margin:4px 0 10px">' +
      (qManage ? "点模板可修改或删除" : "点一下就记好（记在今天，用模板里的账户和金额）") +
      '</div><div class="row" style="gap:8px"><input id="qq" placeholder="一句话记账：星巴克 15" autocomplete="off"><button class="btn" id="qgo" style="margin:0;width:auto;padding:10px 16px">记</button></div>' +
      '<div class="mute" id="qp" style="margin:6px 0 10px;min-height:20px">例如：午餐 12　grab rm 20　昨天 晚餐 30 tng　+3000 工资</div><div class="chips" style="gap:8px">' +
      f
        .map(function (x, i) {
          return (
            '<button class="chip' + (qManage ? "" : " on") + '" data-qi="' + i + '" style="padding:10px 14px;font-size:14px;text-align:left">' +
            ci(x.cat) + " " + esc(x.name) + '<br><span class="num">' +
            (x.amt > 0 ? fmt(x.amt, (acc(x.acc) || {}).cur) : "输入金额") + "</span></button>"
          );
        })
        .join("") +
      '<button class="chip" data-qn="1" style="padding:10px 14px;border-style:dashed">＋ 新模板</button></div>' +
      (last
        ? '<button class="btn" data-ql="1" style="background:var(--accbg);color:var(--acc);box-shadow:none">🔁 复制上一笔：' +
          esc(last.note || last.cat) + " " + fmt(last.amt, (acc(last.acc) || {}).cur) + "</button>"
        : "") +
      '<button class="btn ghost" data-qm="1" style="color:var(--mute)">' + (qManage ? "完成管理" : "管理模板") +
      '</button><button class="btn ghost" data-qf="1" style="color:var(--acc)">✍️ 改用完整记账</button>';
  }
  draw();
  function doQuick() {
    var r = parseQuick(sh.querySelector("#qq").value);
    if (!r.ok) return toast("请带上金额，例如：星巴克 15");
    m.remove();
    quickAdd({ name: r.note || r.cat, type: r.type, amt: r.amt, acc: r.acc, cat: r.cat, sub: r.sub, note: r.note, date: r.date });
  }
  sh.addEventListener("input", function (e) {
    if (e.target.id !== "qq") return;
    var r = parseQuick(e.target.value);
    sh.querySelector("#qp").textContent = !e.target.value.trim() ? "例如：午餐 12　grab rm 20　昨天 晚餐 30 tng　+3000 工资" : r.ok ? "→ " + quickPreview(r) : "还没认出金额（要带数字，例如：星巴克 15）";
  });
  sh.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.id === "qq") {
      e.preventDefault();
      doQuick();
    }
  });
  sh.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    var d = b.dataset;
    if (b.id === "qgo") {
      doQuick();
      return;
    }
    if (d.qi !== undefined) {
      var i = +d.qi;
      m.remove();
      if (qManage) tplSheet(i);
      else quickAdd(S.fav[i]);
    } else if (d.qn) {
      m.remove();
      tplSheet(-1);
    } else if (d.ql) {
      var l = S.tx
        .filter(function (t) {
          return t.type !== "transfer";
        })
        .sort(function (a, b) {
          return (b.ts || 0) - (a.ts || 0);
        })[0];
      m.remove();
      if (l) quickAdd({ name: l.note || l.cat, type: l.type, amt: l.amt, acc: l.acc, cat: l.cat, sub: l.sub, note: l.note });
    } else if (d.qm) {
      qManage = !qManage;
      draw();
    } else if (d.qf) {
      m.remove();
      txSheet();
    }
  });
}
function tplSheet(i) {
  var f = i >= 0 ? S.fav[i] : { name: "", type: "expense", amt: "", acc: defAcc(), cat: S.cats.expense[0], sub: "", note: "" };
  var m = openSheet(
    "<b>" + (i >= 0 ? "修改模板" : "新快速模板") + '</b><label>名称</label><input id="tn" value="' + esc(f.name) +
      '" placeholder="例如：U Mobile 充值"><label>类型</label><select id="tt"><option value="expense">支出</option><option value="income">收入</option></select><label>金额（留空 = 每次自己输入）</label><input id="ta" type="number" inputmode="decimal" step="0.01" value="' +
      (f.amt || "") + '"><label>账户</label><select id="tac">' +
      S.accounts
        .filter(function (a) {
          return !a.hide;
        })
        .map(function (a) {
          return '<option value="' + a.id + '">' + esc(a.name) + " (" + a.cur + ")</option>";
        })
        .join("") +
      '</select><label>分类</label><select id="tcg"></select><label>细分（选填）</label><select id="ts"></select><button class="btn" id="ok">保存</button>' +
      (i >= 0 ? '<button class="btn ghost" id="del">删除模板</button>' : ""),
  );
  var q = function (x) {
    return m.querySelector(x);
  };
  function cats(keepCat) {
    var ty = q("#tt").value;
    q("#tcg").innerHTML = S.cats[ty]
      .map(function (c) {
        return '<option value="' + esc(c) + '">' + esc(c) + "</option>";
      })
      .join("");
    if (keepCat) q("#tcg").value = keepCat;
    subs(f.sub);
  }
  function subs(keep) {
    var ss = (S.sub || {})[q("#tcg").value] || [];
    q("#ts").innerHTML =
      '<option value="">不选</option>' +
      ss
        .map(function (x) {
          return '<option value="' + esc(x) + '">' + esc(x) + "</option>";
        })
        .join("");
    if (keep) q("#ts").value = keep;
  }
  q("#tt").value = f.type;
  q("#tac").value = acc(f.acc) ? f.acc : defAcc();
  cats(f.cat);
  q("#tt").onchange = function () {
    cats();
  };
  q("#tcg").onchange = function () {
    subs();
  };
  q("#ok").onclick = function () {
    var o = {
      name: q("#tn").value.trim() || q("#tcg").value,
      type: q("#tt").value,
      amt: parseFloat(q("#ta").value) > 0 ? parseFloat(q("#ta").value) : undefined,
      acc: q("#tac").value,
      cat: q("#tcg").value,
      sub: q("#ts").value || undefined,
      note: f.note || "",
    };
    mark();
    if (i >= 0) S.fav[i] = Object.assign(S.fav[i], o);
    else S.fav.push(o);
    save();
    m.remove();
    render();
    quickSheet();
  };
  var dd = q("#del");
  if (dd)
    dd.onclick = function () {
      mark();
      S.fav.splice(i, 1);
      save();
      m.remove();
      render();
      quickSheet();
    };
}
// ---------- 旅行模式 ----------
function tripTotal(name) {
  var v = 0;
  S.tx.forEach(function (t) {
    if (t.trip === name && t.type === "expense") v += cvt(t.amt, t);
  });
  return v;
}
function tripCard() {
  if (cur === "other") return "";
  var h = '<div class="card"><b>✈️ 旅行模式</b>';
  if (S.trip)
    h +=
      '<div class="mute">旅行中：<b>' + esc(S.trip.name) + "</b>。记账默认用 " + S.trip.cur +
      ' 账户，并自动标记这一趟</div><div class="num" style="font-size:22px;margin:8px 0">已花 ' + fmt(tripTotal(S.trip.name)) +
      '</div><button class="btn ghost" id="tripend">结束旅行</button>';
  else
    h +=
      '<div class="mute">开启后记账默认用外币账户，并把这一趟花的钱单独统计</div><label>名称</label><input id="trn" placeholder="例如：新加坡 11 月"><label>当地币种</label><select id="trc">' +
      CURS.map(function (c) {
        return "<option>" + c + "</option>";
      }).join("") +
      '</select><button class="btn" id="tripgo">开始旅行</button>';
  var tr = {};
  S.tx.forEach(function (t) {
    if (t.trip && (!S.trip || t.trip !== S.trip.name)) {
      var o = (tr[t.trip] = tr[t.trip] || { n: 0, last: "" });
      o.n++;
      if (t.date > o.last) o.last = t.date;
    }
  });
  var names = Object.keys(tr).sort(function (a, b) {
    return tr[b].last.localeCompare(tr[a].last);
  });
  if (names.length)
    h +=
      '<div class="mute" style="margin-top:12px">以前的旅行</div>' +
      names
        .map(function (n) {
          return (
            '<div class="item row"><span class="sp">' + esc(n) + '<div class="mute">' + tr[n].n + " 笔 · " + tr[n].last +
            '</div></span><span class="num">' + fmt(tripTotal(n)) + "</span></div>"
          );
        })
        .join("");
  return h + "</div>";
}
// ---------- 导入银行 / TNG CSV ----------
function p2(n) {
  return String(n).padStart(2, "0");
}
function parseCSV(t) {
  var rows = [], r = [], f = "", q = false;
  t = t.replace(/^\uFEFF/, "");
  for (var i = 0; i < t.length; i++) {
    var c = t[i];
    if (q) {
      if (c === '"') {
        if (t[i + 1] === '"') {
          f += '"';
          i++;
        } else q = false;
      } else f += c;
    } else if (c === '"') q = true;
    else if (c === ",") {
      r.push(f);
      f = "";
    } else if (c === "\n") {
      r.push(f);
      rows.push(r);
      r = [];
      f = "";
    } else if (c !== "\r") f += c;
  }
  if (f || r.length) {
    r.push(f);
    rows.push(r);
  }
  return rows.filter(function (x) {
    return x.some(function (y) {
      return y.trim();
    });
  });
}
function pdate(s) {
  s = String(s).trim();
  var m, y, mo, d;
  if ((m = s.match(/(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/))) {
    y = +m[1]; mo = +m[2]; d = +m[3];
  } else if ((m = s.match(/(\d{1,2})[-\/. ](\d{1,2})[-\/. ](\d{4})/))) {
    d = +m[1]; mo = +m[2]; y = +m[3];
  } else if ((m = s.match(/(\d{1,2})[-\/ ]([A-Za-z]{3})[a-z]*[-\/ ,]*(\d{2,4})/))) {
    var ix = "janfebmaraprmayjunjulaugsepoctnovdec".indexOf(m[2].toLowerCase());
    if (ix < 0 || ix % 3) return null;
    d = +m[1]; mo = ix / 3 + 1; y = m[3].length === 2 ? 2000 + +m[3] : +m[3];
  } else return null;
  var t = new Date(y, mo - 1, d);
  if (t.getFullYear() !== y || t.getMonth() !== mo - 1 || t.getDate() !== d) return null;
  return y + "-" + p2(mo) + "-" + p2(d);
}
function pnum(s) {
  s = String(s == null ? "" : s);
  var neg = /\(.*\)|\bDR\b|^\s*-/i.test(s),
    v = parseFloat(s.replace(/[^\d.]/g, ""));
  if (isNaN(v)) return null;
  return neg ? -v : v;
}
var CATRULES = [
  [/foodpanda|grabfood|shopeefood/i, "外卖"],
  [/starbucks|\bzus\b|tealive|chagee|gong ?cha|luckin|kenangan/i, "咖啡饮料"],
  [/aeon|lotus|tesco|giant|99 ?speedmart|mydin|jaya grocer|\bnsk\b|econsave|7-?eleven|kk ?mart|pasar/i, "超市杂货"],
  [/netflix|spotify|youtube ?premium|disney|icloud|google ?one|chatgpt|openai|anthropic|apple\.com|canva|microsoft ?365/i, "订阅会员"],
  [/\baia\b|great eastern|prudential|allianz|takaful|insurance|insurans/i, "保险"],
  [/uniqlo|h&m|zara|padini|nike|adidas/i, "衣服鞋包"],
  [/samsung|xiaomi|huawei|apple store/i, "手机数码"],
  [/salon|barber|sephora|spa\b/i, "美容美发"],
  [/anytime fitness|celebrity fit|decathlon|\bgym\b/i, "运动健身"],
  [/\bpet\b|veterinar|\bvet\b/i, "宠物"],
  [/car ?wash|road ?tax|tyre|tire|workshop|saman|jpj/i, "汽车"],
  [/lhdn|hasil|cukai|pdrm/i, "税费罚款"],
  [/ikea|furniture|hardware|repair/i, "家居维修"],
  [/petronas|shell|petron|caltex|bhp|setel/i, "油费"],
  [/\btoll\b|smartag|lebuhraya|plus ?malaysia/i, "过路费"],
  [/grab(?!food)|gojek|\blrt\b|\bmrt\b|rapid ?kl|\bktm\b|parking|touch ?n ?go go|mycar/i, "交通"],
  [/u ?mobile|umobile|hotlink|maxis|celcom|\bdigi\b|celcomdigi|yoodo|tune ?talk|redone|\bxox\b|buzzme|speakout|reload|top ?-?up|prepaid/i, "话费充值"],
  [/\btnb\b|tenaga|syabas|air selangor|indah water|unifi|time dotcom|streamyx|astro|wifi/i, "水电网络"],
  [/netflix|spotify|disney|youtube|\btgv\b|\bgsc\b|cinema|steam|playstation/i, "娱乐"],
  [/clinic|klinik|pharmacy|guardian|watsons|hospital|caring/i, "医疗"],
  [/shopee|lazada|zalora|uniqlo|mr\.? ?diy|mydin|aeon|tesco|lotus|99 ?speedmart|ikea|giant|econsave|jaya grocer|7-?eleven|kk ?mart|amazon|taobao|temu/i, "购物"],
  [/mcd|mcdonald|kfc|starbucks|\bzus\b|tealive|foodpanda|grabfood|restoran|restaurant|cafe|kopitiam|nasi|mamak|pizza|sushi|bakery|burger|coffee|domino|subway|warung|chagee|luckin/i, "餐饮"],
  [/\brent\b|sewa/i, "房租"],
];
function guessCat(text, type) {
  var list = S.cats[type] || [],
    last = list[list.length - 1] || "其他";
  if (type === "income") return /salary|gaji|payroll|bonus/i.test(text) && list.indexOf("工资") >= 0 ? "工资" : last;
  for (var i = 0; i < CATRULES.length; i++) if (CATRULES[i][0].test(text) && list.indexOf(CATRULES[i][1]) >= 0) return CATRULES[i][1];
  return list.indexOf("其他") >= 0 ? "其他" : last;
}
function csvToTx(text, mode) {
  var rows = parseCSV(text), hi = -1, low = [];
  for (var i = 0; i < Math.min(rows.length, 20) && hi < 0; i++) {
    low = rows[i].map(function (x) {
      return x.trim().toLowerCase();
    });
    if (
      low.some(function (x) { return /date|日期|时间|time/.test(x); }) &&
      low.some(function (x) { return /amount|金额|^amt|debit|credit|withdraw|deposit|支出|收入/.test(x); })
    )
      hi = i;
  }
  if (hi < 0) return { items: [], err: "认不出表头：文件里需要有「日期」和「金额」两列" };
  function fi(re) {
    return low.findIndex(function (x) {
      return re.test(x) && !/balance|余额/.test(x);
    });
  }
  var H = {
    d: fi(/date|日期|时间|time/),
    a: fi(/amount|金额|^amt/),
    db: fi(/debit|withdraw|支出|借方/),
    cr: fi(/credit|deposit|收入|贷方/),
    n: -1,
  };
  ["description", "details", "detail", "merchant", "reference", "narrat", "remark", "说明", "备注", "摘要", "商家", "对方", "交易"].some(function (k) {
    H.n = fi(new RegExp(k));
    return H.n >= 0;
  });
  var items = [];
  rows.slice(hi + 1).forEach(function (r) {
    var d = pdate(r[H.d] || "");
    if (!d) return;
    var v = H.a >= 0 ? pnum(r[H.a]) : null, type;
    if (v !== null && v !== 0) type = mode === "exp" || v < 0 ? "expense" : "income";
    else {
      var db = H.db >= 0 ? pnum(r[H.db]) : null,
        cr = H.cr >= 0 ? pnum(r[H.cr]) : null;
      if (db) { v = db; type = "expense"; }
      else if (cr) { v = cr; type = "income"; }
      else return;
    }
    var note = String(r[H.n] || "").trim().replace(/\s+/g, " ").slice(0, 40),
      cat = guessCat(r.join(" "), type),
      sub;
    if (cat === "话费充值")
      sub = ((S.sub || {})["话费充值"] || []).find(function (x) {
        return r.join(" ").replace(/\s/g, "").toLowerCase().indexOf(x.replace(/\s/g, "").toLowerCase()) >= 0;
      });
    items.push({ type: type, amt: +Math.abs(v).toFixed(2), date: d, note: note, cat: cat, sub: sub });
  });
  return { items: items, err: items.length ? "" : "没有读到可导入的记录" };
}
function importSheet() {
  if (cur !== "mine") {
    toast("请先切换到「我的账本」再导入");
    return;
  }
  var m = openSheet(
    '<b>导入银行 / TNG 账单（CSV）</b><div class="mute" style="margin:4px 0">支持 Maybank、TNG eWallet 等导出的 CSV：自动认日期、金额、分类，导入前可预览</div><label>导入到哪个账户</label><select id="ia">' +
      S.accounts
        .filter(function (a) { return !a.hide; })
        .map(function (a) { return '<option value="' + a.id + '">' + esc(a.name) + " (" + a.cur + ")</option>"; })
        .join("") +
      '</select><label>金额正负</label><select id="im"><option value="auto">负数 = 支出，正数 = 收入</option><option value="exp">全部当支出</option></select><label>选择 CSV 文件</label><input id="if" type="file" accept=".csv,text/csv,text/plain"><label style="display:flex;gap:8px;align-items:center;color:var(--ink)"><input type="checkbox" id="isk" checked style="width:auto"> 跳过疑似重复（同一天、同金额、同账户）</label><div id="ip" class="mute" style="margin-top:10px"></div><button class="btn" id="ig" style="display:none">导入</button>',
  );
  var q = function (x) { return m.querySelector(x); }, text = "", todo = [];
  function parse() {
    if (!text) return;
    var r = csvToTx(text, q("#im").value), a = q("#ia").value, seen = {}, dup = 0;
    S.tx.forEach(function (t) { seen[t.date + "|" + t.type + "|" + (+t.amt).toFixed(2) + "|" + t.acc] = 1; });
    todo = r.items.filter(function (x) {
      var k = x.date + "|" + x.type + "|" + x.amt.toFixed(2) + "|" + a;
      if (q("#isk").checked && seen[k]) { dup++; return false; }
      return true;
    });
    q("#ip").innerHTML = r.err
      ? esc(r.err)
      : "找到 " + r.items.length + " 笔，" + (dup ? dup + " 笔疑似重复已跳过，" : "") + "将导入 <b>" + todo.length + "</b> 笔<br>" +
        todo.slice(0, 5).map(function (x) {
          return esc(x.date + " " + (x.note || "-") + " " + (x.type === "income" ? "+" : "-") + x.amt + " → " + x.cat);
        }).join("<br>") + (todo.length > 5 ? "<br>…" : "");
    q("#ig").style.display = todo.length ? "" : "none";
    q("#ig").textContent = "导入 " + todo.length + " 笔";
  }
  q("#if").onchange = function () {
    var f = this.files[0];
    if (!f) return;
    var rd = new FileReader();
    rd.onload = function () { text = String(rd.result); parse(); };
    rd.readAsText(f);
  };
  q("#im").onchange = q("#ia").onchange = q("#isk").onchange = parse;
  q("#ig").onclick = function () {
    var a = q("#ia").value, n = todo.length;
    mark();
    todo.forEach(function (x, i) {
      S.tx.push({ id: uid(), ts: Date.now() + i, type: x.type, amt: x.amt, acc: a, date: x.date, note: x.note, cat: x.cat, sub: x.sub });
    });
    save();
    m.remove();
    render();
    showUndo("已导入 " + n + " 笔");
  };
}
// ---------- PIN（哈希保存） ----------
async function pinHash(p) {
  var b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("ledger-pin-v1:" + p));
  return "h1:" + Array.prototype.map.call(new Uint8Array(b), function (x) { return ("0" + x.toString(16)).slice(-2); }).join("");
}
// ---------- 照片导出 / 导入 ----------
function imgAll() {
  return idb().then(function (d) {
    if (!d) return null;
    return new Promise(function (ok) {
      var o = {};
      try {
        var q = d.transaction("img", "readonly").objectStore("img").openCursor();
        q.onsuccess = function () {
          var c = q.result;
          if (c) { o[c.key] = c.value; c["continue"](); } else ok(o);
        };
        q.onerror = function () { ok(null); };
      } catch (e) { ok(null); }
    });
  });
}
// ---------- 💗 经期记录 ----------
// S.pl = [{ id, start, end? }]   S.pset = { on, cycle, len, days, share }
// 预测只是按记录估算：下次开始 = 上次开始 + 平均周期；排卵日约在下次开始前 14 天；易孕期 = 排卵日前 5 天到后 1 天
function addDays(str, n) {
  var d = pd(str);
  return ds(new Date(d.getFullYear(), d.getMonth(), d.getDate() + n));
}
function dayDiff(a, b) {
  return Math.round((pd(b) - pd(a)) / 864e5);
}
function perMD(str) {
  var d = pd(str);
  return d.getMonth() + 1 + "月" + d.getDate() + "日";
}
function perCalc(pl, ps, td) {
  ps = ps || {};
  td = td || today();
  var logs = (pl || [])
      .filter(function (x) { return x && x.start; })
      .sort(function (a, b) { return a.start < b.start ? -1 : a.start > b.start ? 1 : 0; }),
    gaps = [],
    lens = [];
  for (var i = 1; i < logs.length; i++) {
    var g = dayDiff(logs[i - 1].start, logs[i].start);
    if (g >= 15 && g <= 60) gaps.push(g);
  }
  logs.forEach(function (x) {
    if (x.end) {
      var l = dayDiff(x.start, x.end) + 1;
      if (l >= 1 && l <= 14) lens.push(l);
    }
  });
  function avg(a, d) {
    a = a.slice(-6);
    return a.length ? Math.round(a.reduce(function (t, v) { return t + v; }, 0) / a.length) : d;
  }
  var cyc = avg(gaps, +ps.cycle || 28),
    len = avg(lens, +ps.len || 5),
    last = logs[logs.length - 1] || null,
    out = { logs: logs, cycle: cyc, len: len, last: last, auto: gaps.length > 0, starts: [], kind: "none" };
  if (!last) return out;
  var s = addDays(last.start, cyc);
  for (var k = 0; k < 6; k++) {
    out.starts.push(s);
    s = addDays(s, cyc);
  }
  out.next = out.starts[0];
  var inEnd = last.end || addDays(last.start, len + 1);
  if (td >= last.start && td <= inEnd) {
    out.kind = "in";
    out.day = dayDiff(last.start, td) + 1;
  } else if (td < out.next) {
    out.kind = "before";
    out.days = dayDiff(td, out.next);
  } else if (td === out.next) {
    out.kind = "today";
    out.days = 0;
  } else {
    out.kind = "late";
    out.days = dayDiff(out.next, td);
  }
  return out;
}
function perDay(C, d, td) {
  var r = {};
  C.logs.forEach(function (x) {
    var e = x.end || addDays(x.start, C.len - 1);
    if (!x.end && x === C.last && td > e && dayDiff(x.start, td) <= C.len + 1) e = td;
    if (d >= x.start && d <= e) r.act = 1;
  });
  C.starts.forEach(function (s) {
    var o = addDays(s, -14);
    if (d >= s && d <= addDays(s, C.len - 1)) r.pred = 1;
    if (d === o) r.ovu = 1;
    else if (d >= addDays(o, -5) && d <= addDays(o, 1)) r.fer = 1;
    if (d >= addDays(s, -5) && d < s) r.pms = 1;
  });
  return r;
}
// 当前状态一句话 + 小提示；show = 值得在首页提醒
function perNow(P, ps, partner, name) {
  ps = ps || {};
  var C = perCalc(P, ps),
    w = partner ? (name || "她") + " 的" : "",
    dd = +ps.days || 2,
    o = { C: C, show: false, text: "", tip: "" };
  if (C.kind === "none") {
    o.text = w + "经期：还没有记录";
    o.tip = partner ? "" : "点这里开始记录";
  } else if (C.kind === "in") {
    o.text = w + "经期第 " + C.day + " 天";
    o.tip = partner ? "给她准备暖宝宝和热饮，多体谅，别让她碰凉的" : "多喝热水，注意休息，别吃太凉的";
    o.show = true;
  } else if (C.kind === "today") {
    o.text = w + "经期预计今天开始";
    o.tip = partner ? "帮她备好暖宝宝和热饮" : "记得备好用品";
    o.show = true;
  } else if (C.kind === "late") {
    o.text = w + "经期已推迟 " + C.days + " 天";
    o.tip = partner ? "别催她，关心一下就好" : "如果延迟很久或担心，可以咨询医生";
    o.show = C.days <= 21;
  } else {
    o.text = (partner ? w + "下次经期还有 " : "距离下次经期还有 ") + C.days + " 天（" + perMD(C.next) + "）";
    o.tip = C.days <= 5 ? (partner ? "快到了，她的情绪可能起伏，多一点耐心和温柔" : "快到经期了，可能情绪起伏或小腹不适，提前备好用品") : "";
    o.show = C.days <= dd;
  }
  var sk = C.kind === "in" ? "in" : C.kind === "today" ? "today" : C.kind === "late" ? "late" : "before";
  if (partner && o.tip && ps.msg && ps.msg[sk]) o.tip = ps.msg[sk];
  return o;
}
function perHomeCard() {
  if (RO || cur !== "mine" || !(S.pset && S.pset.on)) return "";
  var n = perNow(S.pl, S.pset, false);
  return (
    '<div class="card row" data-go="period" style="cursor:pointer"><div class="ico">💗</div><div class="sp"><b>' + esc(n.text) + "</b>" +
    (n.tip ? '<div class="mute">' + esc(n.tip) + "</div>" : "") + '</div><span class="mute">›</span></div>'
  );
}
function perSetCard() {
  if (cur !== "mine" || RO) return "";
  var ps = S.pset || {};
  return (
    '<div class="card"><b>💗 经期记录</b><div class="mute" style="margin:4px 0 8px">记录经期、预测下一次、提前提醒。数据默认只存在这台手机，不会上传。</div>' +
    '<label style="display:flex;gap:8px;align-items:center;color:var(--ink)"><input type="checkbox" id="pon2" style="width:auto"' + (ps.on ? " checked" : "") +
    "> 启用经期记录</label>" + (ps.on ? '<button class="btn" data-go="period" style="margin-top:10px">打开经期日历</button>' : "") + "</div>"
  );
}
// 对方（女朋友）选择共享后，从同步空间里读到她的预测，首页提醒
var PCACHE = {};
function periodOf(id) {
  var str = others && others[id];
  if (!str) return null;
  if (PCACHE[id] && PCACHE[id].s === str) return PCACHE[id].v;
  var v = null;
  try {
    var o = JSON.parse(str);
    if (o.pset && o.pset.on && o.pset.share) v = { pl: o.pl || [], pset: o.pset };
  } catch (e) {}
  PCACHE[id] = { s: str, v: v };
  return v;
}
function perAlerts() {
  var h = "";
  if (RO) return h;
  Object.keys(others || {}).forEach(function (id) {
    var p = periodOf(id);
    if (!p) return;
    var n = perNow(p.pl, p.pset, true, names[id]);
    if (n.show)
      h +=
        '<div class="item row"><div class="ico">💗</div><div class="sp">' + esc(n.text) + '<div class="mute">' + esc(n.tip) +
        '</div></div><button class="chip" data-pics="' + esc(id) + '">加入日历</button></div>';
  });
  return h;
}
function perToast() {
  if (RO || cur !== "mine" || !(S.pset && S.pset.on)) return;
  var n = perNow(S.pl, S.pset, false),
    t = today();
  try {
    if (!n.show || localStorage.getItem("ledger.pertoast") === t) return;
    localStorage.setItem("ledger.pertoast", t);
  } catch (e) {}
  if (n.show) toast("💗 " + n.text);
}
function icsEsc(t) {
  return String(t == null ? "" : t).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}
function icsBuild(P, ps, partner, name) {
  var C = perCalc(P, ps),
    dd = Math.max(1, +ps.days || 2),
    stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, ""),
    L = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Ledger//Period//ZH", "CALSCALE:GREGORIAN", "METHOD:PUBLISH"],
    title = partner ? "💗 " + (name || "她") + " 的经期预计开始" : "💗 经期预计开始",
    tip = partner ? (ps.msg && ps.msg.before) || "多体谅，备好暖宝宝和热饮" : "记得备好用品，注意保暖";
  function d8(x) {
    return x.replace(/-/g, "");
  }
  C.starts.forEach(function (s) {
    L.push(
      "BEGIN:VEVENT", "UID:period-" + s + (partner ? "-p" : "") + "@ledger", "DTSTAMP:" + stamp,
      "DTSTART;VALUE=DATE:" + d8(s), "DTEND;VALUE=DATE:" + d8(addDays(s, C.len)), "SUMMARY:" + icsEsc(title),
      "DESCRIPTION:" + icsEsc(tip + "（按记录估算，仅供参考）"),
      "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + icsEsc(title) + "，" + dd + " 天后", "TRIGGER:-PT" + (dd * 24 - 9) + "H", "END:VALARM",
      "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + icsEsc(title) + "，就在今天", "TRIGGER:PT9H", "END:VALARM",
      "END:VEVENT",
    );
  });
  L.push("END:VCALENDAR");
  return L.join("\r\n") + "\r\n";
}
async function perExport(P, ps, partner, name) {
  if (!perCalc(P, ps).starts.length) return toast("先记录一次经期，才能预测");
  try {
    var dl2 = await claude.use("downloads");
    await dl2.save({ filename: partner ? "her-period.ics" : "period.ics", data: new Blob([icsBuild(P, ps, partner, name)], { type: "text/calendar" }) });
    toast("已导出：打开文件选「添加到日历」，手机日历就会按时提醒");
  } catch (e) {
    toast("导出失败");
  }
}
function perAdd(d) {
  mark();
  S.pl.push({ id: uid(), start: d });
  save();
  render();
  showUndo("已记录：" + perMD(d) + " 经期开始");
}
function perDaySheet(d) {
  var td = today(),
    C = perCalc(S.pl, S.pset, td),
    hit = C.logs.find(function (x) { return d >= x.start && d <= (x.end || addDays(x.start, C.len - 1)); }),
    open = !hit && C.logs.slice().reverse().find(function (x) { return !x.end && x.start < d && dayDiff(x.start, d) <= 14; }),
    r = perDay(C, d, td),
    tags = [];
  if (r.act) tags.push("经期");
  if (r.pred) tags.push("预测经期");
  if (r.ovu) tags.push("预测排卵日");
  if (r.fer) tags.push("易孕期（估算）");
  if (r.pms) tags.push("经前期（PMS）");
  var m = openSheet(
    "<b>" + perMD(d) + '</b><div class="mute" style="margin:4px 0 10px">' + (tags.join(" · ") || "普通日子") + "</div>" +
      (d > td
        ? '<div class="mute">未来的日子不能记录</div>'
        : (hit ? '<button class="btn" id="e1">这天经期结束了</button><button class="btn ghost" id="e2">删除这条记录</button>' : "") +
          (open ? '<button class="btn" id="e3">这天经期结束了</button>' : "") +
          (hit ? "" : '<button class="btn" id="e4">🩸 这天经期开始</button>')),
  );
  function done(msg, fn) {
    mark();
    fn();
    save();
    m.remove();
    render();
    showUndo(msg);
  }
  var q = function (x) { return m.querySelector(x); };
  if (q("#e1")) q("#e1").onclick = function () { done("已设为结束", function () { hit.end = d < hit.start ? hit.start : d; }); };
  if (q("#e2")) q("#e2").onclick = function () { done("已删除", function () { S.pl = S.pl.filter(function (x) { return x.id !== hit.id; }); }); };
  if (q("#e3")) q("#e3").onclick = function () { done("已设为结束", function () { open.end = d; }); };
  if (q("#e4")) q("#e4").onclick = function () { m.remove(); perAdd(d); };
}
function perLogSheet(id) {
  var x = S.pl.find(function (y) { return y.id === id; });
  if (!x) return;
  var m = openSheet(
    '<b>修改记录</b><label>开始日期</label><input id="ls" type="date" value="' + x.start + '"><label>结束日期（还没结束就留空）</label><input id="le" type="date" value="' +
      (x.end || "") + '"><button class="btn" id="ok">保存</button><button class="btn ghost" id="del">删除这条记录</button>',
  );
  m.querySelector("#ok").onclick = function () {
    var s0 = m.querySelector("#ls").value,
      e0 = m.querySelector("#le").value;
    if (!s0) return toast("请选开始日期");
    if (e0 && e0 < s0) return toast("结束日期不能早于开始日期");
    mark();
    x.start = s0;
    x.end = e0 || undefined;
    save();
    m.remove();
    render();
  };
  m.querySelector("#del").onclick = function () {
    mark();
    S.pl = S.pl.filter(function (y) { return y.id !== id; });
    save();
    m.remove();
    render();
    showUndo("已删除");
  };
}
function periodPage() {
  var ps = S.pset || {},
    td = today(),
    N = perNow(S.pl, ps, false),
    C = N.C,
    h = '<div class="card"><h1>💗 经期</h1><div class="big" style="font-size:26px">' + esc(N.text) + "</div>" + (N.tip ? '<div class="mute">' + esc(N.tip) + "</div>" : "");
  if (C.last)
    h += '<div class="mute" style="margin-top:6px">平均周期 ' + C.cycle + " 天" + (C.auto ? "（按记录算出）" : "（默认值，记几次后自动算）") + " · 经期约 " + C.len + " 天</div>";
  h +=
    C.kind === "in" && !C.last.end
      ? '<button class="btn" id="pend">✅ 今天结束了</button>'
      : C.kind === "in"
      ? ""
      : '<button class="btn" id="pnow">🩸 今天来了（记录开始）</button>';
  h += "</div>";
  // 日历
  var y = perMon.getFullYear(),
    mo = perMon.getMonth(),
    first = new Date(y, mo, 1),
    nd = new Date(y, mo + 1, 0).getDate(),
    cells = "";
  for (var b = 0; b < (first.getDay() + 6) % 7; b++) cells += "<span></span>";
  for (var d = 1; d <= nd; d++) {
    var key = y + "-" + String(mo + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0"),
      r = perDay(C, key, td),
      st = "background:none;color:var(--ink)";
    if (r.act) st = "background:var(--acc);color:#fff";
    else if (r.pred) st = "background:var(--accbg);color:var(--acc);border:1px dashed var(--acc)";
    else if (r.ovu) st = "background:#2f9e6e;color:#fff";
    else if (r.fer) st = "background:rgba(47,158,110,.2);color:var(--ink)";
    else if (r.pms) st = "background:rgba(155,93,229,.18);color:var(--ink)";
    cells +=
      '<button data-pd="' + key + '" style="aspect-ratio:1;border-radius:12px;border:0;font:inherit;font-size:14px;cursor:pointer;' + st +
      (key === td ? ";box-shadow:inset 0 0 0 2px var(--ink)" : "") + '">' + d + "</button>";
  }
  h +=
    '<div class="card"><div class="mnav"><button data-pnav="-1" aria-label="上个月">‹</button><b>' + y + "年" + (mo + 1) + '月</b><button data-pnav="1" aria-label="下个月">›</button></div>' +
    '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center" class="mute">' +
    ["一", "二", "三", "四", "五", "六", "日"].map(function (x) { return "<span>" + x + "</span>"; }).join("") +
    '</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-top:4px">' + cells + "</div>" +
    '<div class="mute" style="margin-top:10px;line-height:1.9"><span style="background:var(--acc);color:#fff;border-radius:4px;padding:0 6px">经期</span> ' +
    '<span style="border:1px dashed var(--acc);color:var(--acc);border-radius:4px;padding:0 6px">预测</span> ' +
    '<span style="background:rgba(155,93,229,.18);border-radius:4px;padding:0 6px">经前 PMS</span> ' +
    '<span style="background:rgba(47,158,110,.2);border-radius:4px;padding:0 6px">易孕期</span> ' +
    '<span style="background:#2f9e6e;color:#fff;border-radius:4px;padding:0 6px">排卵日</span><br>点某一天可以记录开始 / 结束</div></div>';
  // 记录
  if (C.logs.length)
    h +=
      '<div class="card"><b>最近记录</b>' +
      C.logs
        .slice(-6)
        .reverse()
        .map(function (x) {
          var i = C.logs.indexOf(x),
            gap = i > 0 ? dayDiff(C.logs[i - 1].start, x.start) : 0;
          return (
            '<div class="item row" data-plog="' + x.id + '" style="cursor:pointer"><span class="sp">' + perMD(x.start) + (x.end ? " – " + perMD(x.end) : " – 进行中") +
            '<div class="mute">' + (x.end ? dayDiff(x.start, x.end) + 1 + " 天" : "") + (gap ? (x.end ? " · " : "") + "距上次 " + gap + " 天" : "") + "</div></span><span class=\"mute\">›</span></div>"
          );
        })
        .join("") +
      "</div>";
  // 设置
  h +=
    '<div class="card"><b>设置</b><label>默认周期（天）· 记几次之后会自动用平均值</label><input type="number" inputmode="numeric" data-pset="cycle" value="' + (+ps.cycle || 28) +
    '"><label>默认经期天数</label><input type="number" inputmode="numeric" data-pset="len" value="' + (+ps.len || 5) +
    '"><label>提前几天提醒</label><input type="number" inputmode="numeric" data-pset="days" value="' + (+ps.days || 2) +
    '"><div style="margin-top:16px"><b>想对他说的话</b></div><div class="mute">共享后他在首页看到的就是你写的这些；留空就用默认提示</div>' +
    [
      ["before", "快到经期时（PMS）", "例如：想喝热奶茶🧋，想被抱抱，别惹我😤"],
      ["in", "经期中", "例如：肚子疼，帮我买暖宝宝和红糖姜茶"],
      ["today", "预计今天开始", "例如：可能今天来，帮我备着"],
      ["late", "推迟了", "例如：别催我，我自己会留意"],
    ]
      .map(function (x) {
        return "<label>" + x[1] + '</label><input data-pmsg="' + x[0] + '" maxlength="60" placeholder="' + x[2] + '" value="' + esc((ps.msg || {})[x[0]] || "") + '">';
      })
      .join("") +
    '<label style="display:flex;gap:8px;align-items:center;color:var(--ink);margin-top:14px"><input type="checkbox" id="pshare" style="width:auto"' + (ps.share ? " checked" : "") +
    "> 和男朋友共享预测（他的首页会提醒，关闭后不再上传）</label>" +
    '<button class="btn" id="pics" style="margin-top:12px">📅 导出到手机日历（提前提醒）</button>' +
    '<div class="mute" style="margin-top:10px">预测只是根据记录估算，不能用来避孕或判断健康问题；周期很不规律或延迟很久，请咨询医生。' +
    (ps.share ? "" : "<br>没有共享时，经期记录只存在这台手机，换手机前请先「更多 → 备份」导出。") + "</div></div>";
  return h;
}
// ---------- 🤝 借还款 ----------
// S.loans = [{ id, dir: "lend"(我借给别人) | "borrow"(别人借给我), who, amt, acc, date, due?, note?, pays: [{ amt, acc, date }] }]
// 借出 / 借入会让账户余额增减，但不算支出或收入；还款再把钱加回来 / 扣掉
function loanPaid(l) {
  var v = 0;
  (l.pays || []).forEach(function (p) {
    v += +p.amt || 0;
  });
  return v;
}
function loanLeft(l) {
  return Math.max(0, l.amt - loanPaid(l));
}
function loanCur(l) {
  var a = acc(l.acc);
  return a ? a.cur : S.base;
}
function loanAccOpts(sel) {
  return (
    '<option value="">不影响账户</option>' +
    S.accounts
      .filter(function (a) { return !a.hide; })
      .map(function (a) { return '<option value="' + a.id + '"' + (a.id === sel ? " selected" : "") + ">" + esc(a.name) + " (" + a.cur + ")</option>"; })
      .join("")
  );
}
function loanSheet(id) {
  var l = id ? S.loans.find(function (x) { return x.id === id; }) : null;
  if (id && !l) return;
  var f = l || { dir: "lend", who: "", amt: "", acc: defAcc(), date: today(), due: "", note: "" },
    m = openSheet(
      "<b>" + (l ? "修改借还款" : "记一笔借还款") + '</b><label>类型</label><select id="ld"><option value="lend">我借给别人（别人欠我）</option><option value="borrow">别人借给我（我欠别人）</option></select>' +
        '<label>对方名字</label><input id="lw" value="' + esc(f.who) + '"><label>金额</label><input id="la" type="number" inputmode="decimal" step="0.01" value="' + esc(f.amt) +
        '"><label>钱从哪个账户出 / 进</label><select id="lc">' + loanAccOpts(f.acc) + '</select><label>日期</label><input id="lt" type="date" value="' + esc(f.date) +
        '"><label>约定还款日（选填）</label><input id="lu" type="date" value="' + esc(f.due || "") + '"><label>备注（选填）</label><input id="ln" value="' + esc(f.note || "") +
        '"><button class="btn" id="ok">保存</button>' + (l ? '<button class="btn ghost" id="del">删除这笔</button>' : ""),
    ),
    q = function (x) { return m.querySelector(x); };
  q("#ld").value = f.dir === "borrow" ? "borrow" : "lend";
  q("#ok").onclick = function () {
    var o = {
      dir: q("#ld").value, who: q("#lw").value.trim(), amt: parseFloat(q("#la").value), acc: q("#lc").value,
      date: q("#lt").value || today(), due: q("#lu").value || undefined, note: q("#ln").value.trim() || undefined,
    };
    if (!o.who) return toast("请填对方名字");
    if (!(o.amt > 0)) return toast("请填金额");
    mark();
    if (l) Object.assign(l, o);
    else S.loans.push(Object.assign({ id: uid(), pays: [] }, o));
    save();
    m.remove();
    render();
    showUndo(l ? "已修改" : "已记录");
  };
  if (l)
    q("#del").onclick = function () {
      if (!confirm("删除这笔借还款？账户余额会回到没有这笔之前")) return;
      mark();
      S.loans = S.loans.filter(function (x) { return x.id !== id; });
      save();
      m.remove();
      render();
      showUndo("已删除");
    };
}
function loanPaySheet(id) {
  var l = S.loans.find(function (x) { return x.id === id; });
  if (!l) return;
  var lend = l.dir !== "borrow",
    m = openSheet(
      "<b>" + (lend ? "💸 收到 " : "💸 还给 ") + esc(l.who) + "</b><label>金额（" + loanCur(l) + '）</label><input id="pa" type="number" inputmode="decimal" step="0.01" value="' +
        loanLeft(l).toFixed(2) + '"><label>' + (lend ? "收进哪个账户" : "从哪个账户还") + '</label><select id="pc">' + loanAccOpts(l.acc) +
        '</select><label>日期</label><input id="pd" type="date" value="' + today() + '"><button class="btn" id="ok">确定</button>',
    );
  m.querySelector("#ok").onclick = function () {
    var v = parseFloat(m.querySelector("#pa").value),
      p = { amt: +v.toFixed(2), acc: m.querySelector("#pc").value, date: m.querySelector("#pd").value || today() };
    if (!(v > 0)) return toast("请填金额");
    if (v > loanLeft(l) + 0.005) return toast("金额超过还没结清的 " + fmt(loanLeft(l), loanCur(l)));
    mark();
    l.pays = (l.pays || []).concat([p]);
    save();
    m.remove();
    render();
    showUndo(loanLeft(l) <= 0.005 ? "已结清 ✓" : "已记录");
  };
}
function loanAlerts() {
  if (RO || cur !== "mine") return "";
  var td = today(),
    h = "";
  (S.loans || [])
    .filter(function (l) { return loanLeft(l) > 0.005 && l.due && dayDiff(td, l.due) <= 3; })
    .sort(function (a, b) { return a.due < b.due ? -1 : 1; })
    .slice(0, 4)
    .forEach(function (l) {
      var d = dayDiff(td, l.due),
        lend = l.dir !== "borrow";
      h +=
        '<div class="item row"><div class="ico">' + (d < 0 ? "🚨" : "🤝") + '</div><div class="sp">' + esc(l.who) + (lend ? " 该还你钱了" : "：该还钱了") +
        '<div class="mute">' + fmt(loanLeft(l), loanCur(l)) + " · " + (d < 0 ? "已逾期 " + -d + " 天" : d === 0 ? "今天到期" : d + " 天后到期") +
        '</div></div><button class="chip on" data-lpay="' + l.id + '">' + (lend ? "收款" : "还款") + "</button></div>";
    });
  return h;
}
function loanTotals() {
  var recv = 0,
    owe = 0,
    n = 0;
  (S.loans || []).forEach(function (l) {
    var left = loanLeft(l);
    if (left <= 0.005) return;
    n++;
    var v = conv(left, loanCur(l), S.base);
    if (l.dir === "borrow") owe += v;
    else recv += v;
  });
  return { recv: recv, owe: owe, n: n };
}
function loanCard() {
  if (cur !== "mine" || RO) return "";
  var t = loanTotals();
  return (
    '<div class="card"><b>🤝 借还款</b><div class="mute" style="margin:4px 0 8px">' +
    (t.n ? "别人欠我 " + fmt(t.recv) + " · 我欠别人 " + fmt(t.owe) : "借给朋友的钱、向朋友借的钱，到期提醒，还款后自动结清") +
    '</div><button class="btn" data-go="loans">打开借还款</button></div>'
  );
}
function loansPage() {
  var L = S.loans || [],
    td = today(),
    open = L.filter(function (l) { return loanLeft(l) > 0.005; }),
    done = L.filter(function (l) { return loanLeft(l) <= 0.005; }).slice(-5).reverse(),
    t = loanTotals();
  function row(l, isOpen) {
    var lend = l.dir !== "borrow",
      cu = loanCur(l),
      d = l.due ? dayDiff(td, l.due) : null;
    return (
      '<div class="item"><div class="row"><div class="ico">' + (lend ? "📤" : "📥") + '</div><div class="sp"><b>' + esc(l.who) + "</b>" + (l.note ? '<span class="mute">　' + esc(l.note) + "</span>" : "") +
      '<div class="mute">' + (lend ? "借出 " : "借入 ") + fmt(l.amt, cu) + " · " + esc(l.date) + (loanPaid(l) ? " · 已" + (lend ? "收 " : "还 ") + fmt(loanPaid(l), cu) : "") + "</div>" +
      (isOpen ? '<div class="num" style="margin-top:2px">' + (lend ? "还欠你 " : "还要还 ") + fmt(loanLeft(l), cu) + "</div>" : '<div class="mute">✓ 已结清</div>') +
      (isOpen && d !== null
        ? '<div class="' + (d < 0 ? "exp" : "mute") + '" style="font-size:13px">' + (d < 0 ? "🚨 已逾期 " + -d + " 天" : d === 0 ? "今天到期" : "到期 " + perMD(l.due) + "（还有 " + d + " 天）") + "</div>"
        : "") +
      "</div>" + (isOpen ? '<button class="chip on" data-lpay="' + l.id + '">' + (lend ? "收款" : "还款") + "</button>" : "") +
      '<button class="chip" data-loan="' + l.id + '">改</button></div></div>'
    );
  }
  return (
    '<div class="card"><h1>🤝 借还款</h1><div class="row" style="gap:10px"><div class="sp"><div class="mute">别人欠我</div><div class="num inc" style="font-size:20px">' + fmt(t.recv) +
    '</div></div><div class="sp"><div class="mute">我欠别人</div><div class="num exp" style="font-size:20px">' + fmt(t.owe) + '</div></div></div>' +
    '<button class="btn" id="loannew">＋ 记一笔借还款</button></div>' +
    (open.length ? '<div class="card"><b>还没结清</b>' + open.map(function (l) { return row(l, true); }).join("") + "</div>" : '<div class="empty">没有未结清的借还款 🎉</div>') +
    (done.length ? '<div class="card"><b>最近结清的</b>' + done.map(function (l) { return row(l, false); }).join("") + "</div>" : "")
  );
}
// ---------- 🔁 订阅总览（按「订阅会员」分类里的记录自动算，定期账单也算）----------
function addMonthsStr(str, n) {
  var d = pd(str),
    t = new Date(d.getFullYear(), d.getMonth() + n, 1);
  t.setDate(Math.min(d.getDate(), new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate()));
  return ds(t);
}
function subsCalc() {
  var td = today(),
    g = {};
  S.tx.forEach(function (t) {
    if (t.type !== "expense" || t.cat !== "订阅会员") return;
    var k = String(t.sub || String(t.note || "").replace(/（定期）$/, "") || "未命名").trim() || "未命名";
    (g[k] = g[k] || []).push(t);
  });
  return Object.keys(g).map(function (k) {
    var ts = g[k].slice().sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; }),
      last = ts[ts.length - 1],
      gaps = [];
    for (var i = 1; i < ts.length; i++) {
      var gp = dayDiff(ts[i - 1].date, ts[i].date);
      if (gp > 0) gaps.push(gp);
    }
    gaps.sort(function (a, b) { return a - b; });
    var gap = gaps.length ? gaps[Math.floor(gaps.length / 2)] : 30,
      amt = cvt(last.amt, last),
      cad, next, cycle, month;
    if (gap <= 10) { cad = "每周"; cycle = 7; next = addDays(last.date, 7); month = (amt * 52) / 12; }
    else if (gap <= 45) { cad = "每月"; cycle = 31; next = addMonthsStr(last.date, 1); month = amt; }
    else if (gap <= 120) { cad = "每季度"; cycle = 92; next = addMonthsStr(last.date, 3); month = amt / 3; }
    else if (gap >= 300 && gap <= 430) { cad = "每年"; cycle = 366; next = addMonthsStr(last.date, 12); month = amt / 12; }
    else { cad = "每 " + gap + " 天"; cycle = gap; next = addDays(last.date, gap); month = (amt * 30.4375) / gap; }
    return {
      name: k, n: ts.length, last: last, amt: amt, cad: cad, next: next, days: dayDiff(td, next), month: month,
      active: dayDiff(last.date, td) <= cycle * 2, guess: !gaps.length,
    };
  });
}
function subAlerts() {
  if (RO || cur !== "mine") return "";
  var h = "";
  subsCalc()
    .filter(function (x) { return x.active && x.days >= 0 && x.days <= 3; })
    .sort(function (a, b) { return a.days - b.days; })
    .slice(0, 3)
    .forEach(function (x) {
      h +=
        '<div class="item row" data-go="subs" style="cursor:pointer"><div class="ico">🔁</div><div class="sp">' + esc(x.name) + " 预计 " + (x.days === 0 ? "今天" : x.days + " 天后") +
        '续费<div class="mute">' + fmt(x.amt) + "（" + x.cad + "）</div></div></div>";
    });
  return h;
}
function subCard() {
  if (cur !== "mine" || RO) return "";
  var a = subsCalc().filter(function (x) { return x.active; }),
    m = a.reduce(function (t, x) { return t + x.month; }, 0);
  return (
    '<div class="card"><b>🔁 订阅总览</b><div class="mute" style="margin:4px 0 8px">' +
    (a.length ? "每月约 " + fmt(m) + "（" + a.length + " 个订阅）" : "把 Netflix、Spotify、iCloud 等记在「订阅会员」分类，这里会自动汇总") +
    '</div><button class="btn" data-go="subs">打开订阅总览</button></div>'
  );
}
function subsPage() {
  var all = subsCalc(),
    act = all.filter(function (x) { return x.active; }).sort(function (a, b) { return a.days - b.days; }),
    off = all.filter(function (x) { return !x.active; }).sort(function (a, b) { return a.last.date < b.last.date ? 1 : -1; }),
    m = act.reduce(function (t, x) { return t + x.month; }, 0);
  function row(x, on) {
    return (
      '<div class="item row"><div class="ico">🔁</div><div class="sp"><b>' + esc(x.name) + '</b><div class="mute">' + x.cad + " · 上次 " + fmt(x.amt) + "（" + esc(x.last.date) + "）" +
      (x.guess ? " · 只记过 1 次，按每月估算" : "") + "</div>" +
      (on
        ? '<div class="' + (x.days <= 3 ? "exp" : "mute") + '" style="font-size:13px">' + (x.days < 0 ? "应该已经续费了（" + -x.days + " 天前）" : x.days === 0 ? "预计今天续费" : "预计 " + perMD(x.next) + " 续费（还有 " + x.days + " 天）") + "</div>"
        : '<div class="mute" style="font-size:13px">已经 ' + dayDiff(x.last.date, today()) + " 天没扣款，可能已取消</div>") +
      '</div><span class="num">' + (on ? fmt(x.month) + "<span class=\"mute\">/月</span>" : "") + "</span></div>"
    );
  }
  return (
    '<div class="card"><h1>🔁 订阅总览</h1><div class="row" style="gap:10px"><div class="sp"><div class="mute">每月约</div><div class="num" style="font-size:22px">' + fmt(m) +
    '</div></div><div class="sp"><div class="mute">一年约</div><div class="num" style="font-size:22px">' + fmt(m * 12) + '</div></div></div>' +
    '<button class="btn" id="subadd">＋ 记一笔订阅</button></div>' +
    (act.length ? '<div class="card"><b>正在订阅（' + act.length + "）</b>" + act.map(function (x) { return row(x, true); }).join("") + "</div>" : '<div class="empty">还没有订阅记录<br><span class="mute">记账时选「订阅会员」分类，细分里选 Netflix、Spotify 等</span></div>') +
    (off.length ? '<div class="card"><b>可能已取消</b>' + off.map(function (x) { return row(x, false); }).join("") + "</div>" : "") +
    '<div class="mute" style="padding:0 4px">按「订阅会员」分类里的记录自动算：看每次扣款的间隔判断每月 / 每年，推算下次续费日。每月自动记账的订阅也会算进来。</div>'
  );
}
// ---------- 主屏幕快捷入口 ----------
function shortcutCard() {
  if (RO) return "";
  var base = location.origin + location.pathname,
    items = [["快速记账", "quick"], ["完整记账", "add"], ["购物清单", "shop"], ["聊天", "chat"]];
  return (
    '<div class="card"><b>⚡ 主屏幕快捷入口</b><div class="mute" style="margin:4px 0 8px">Android：长按桌面上的 App 图标，会出现「快速记账」「完整记账」「购物清单」「聊天」。<br>iPhone：不支持长按快捷方式，可以在 Safari 里打开下面的链接 → 分享 → 添加到主屏幕，就会多一个直接进快速记账的图标。</div>' +
    items
      .map(function (x) {
        return '<div class="item row"><span class="sp">' + x[0] + '<div class="mute ellip">' + esc(base + "?q=" + x[1]) + '</div></span><button class="chip" data-copy="' + esc(base + "?q=" + x[1]) + '">复制链接</button></div>';
      })
      .join("") +
    "</div>"
  );
}
// ---------- 一句话记账：「星巴克 15」「昨天午餐 12.5 tng」「+3000 工资」----------
var ZHCAT = [
  [/早餐|早饭/, "餐饮", "早餐"], [/午餐|午饭/, "餐饮", "午餐"], [/晚餐|晚饭/, "餐饮", "晚餐"], [/宵夜|夜宵/, "餐饮", "宵夜"],
  [/外卖/, "外卖"], [/咖啡|奶茶|饮料|珍珠/, "咖啡饮料"], [/吃饭|聚餐|火锅|烧烤|餐/, "餐饮"],
  [/买菜|超市|菜市场|杂货|水果/, "超市杂货"], [/日用品|纸巾|洗衣液|洗发水|牙膏/, "日用品"],
  [/停车/, "交通", "停车"], [/打车|公交|地铁|火车|巴士|交通/, "交通"], [/加油|油费/, "油费"], [/过路费/, "过路费"],
  [/电费|水费|网费|宽带|煤气/, "水电网络"], [/话费|充值/, "话费充值"], [/房租|租金/, "房租"],
  [/电影|游戏|ktv|唱k/i, "娱乐"], [/看病|买药|医院|诊所/, "医疗"], [/理发|美甲|护肤/, "美容美发"],
  [/健身|羽毛球|游泳/, "运动健身"], [/红包|礼物|请客/, "礼物红包"], [/猫粮|狗粮|宠物/, "宠物"], [/保险/, "保险"],
];
var ZHBRAND = [
  [/星巴克/, "咖啡饮料", "Starbucks"], [/麦当劳|肯德基/, "餐饮"], [/屈臣氏/, "日用品", "Watsons"], [/优衣库/, "衣服鞋包", "Uniqlo"],
  [/淘宝|拼多多/, "购物"], [/滴滴/, "交通"],
];
function parseQuick(text) {
  var raw = String(text || "").trim();
  if (!raw) return { ok: false };
  var s = raw.replace(/(\d),(\d{3})/g, "$1$2"),
    type = "expense",
    date = today();
  if (/^\s*\+/.test(s) || /收入|收到|工资|薪水|奖金|入账/.test(s)) type = "income";
  s = s.replace(/^\s*\+\s*/, "");
  var dm = s.match(/前天|昨天|昨日|今天|今日/);
  if (dm) {
    date = addDays(today(), dm[0] === "前天" ? -2 : /昨/.test(dm[0]) ? -1 : 0);
    s = s.replace(dm[0], " ");
  }
  var re = /\d+(?:\.\d+)?/g,
    m,
    cand = [];
  while ((m = re.exec(s))) {
    var a = m.index,
      b = a + m[0].length,
      head = s.slice(0, a),
      tail = s.slice(b),
      rmPre = /rm\s*$/i.test(head);
    if (!rmPre && a > 0 && /[A-Za-z\-.]/.test(s[a - 1])) continue; // 例如 7-eleven 里的 7 不是金额
    if (/^[A-Za-z\-]/.test(tail) && !/^(rm|myr)/i.test(tail)) continue;
    cand.push({ a: a, b: b, v: parseFloat(m[0]), mark: rmPre || /^\s*(块|元|rm|myr)/i.test(tail) });
  }
  var pk =
    cand.filter(function (c) { return c.mark && c.v > 0; }).pop() ||
    cand.filter(function (c) { return c.v > 0; }).pop();
  if (!pk) return { ok: false };
  var rest = (s.slice(0, pk.a).replace(/rm\s*$/i, "") + " " + s.slice(pk.b).replace(/^\s*(块|元|rm|myr)/i, ""))
      .replace(/[，,;；]+/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
    accId = defAcc(),
    best = null,
    low = rest.toLowerCase();
  S.accounts.forEach(function (ac) {
    if (ac.hide) return;
    var nm = String(ac.name || "").toLowerCase().trim();
    [nm, nm.split(/\s+/)[0]].forEach(function (t) {
      if (!t || (/[\u4e00-\u9fa5]/.test(t) ? t.length < 2 : t.length < 3)) return;
      if (low.indexOf(t) >= 0 && (!best || t.length > best.t.length)) best = { id: ac.id, t: t };
    });
  });
  if (best) {
    accId = best.id;
    rest = rest.replace(new RegExp(best.t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), " ").replace(/\s+/g, " ").trim();
  }
  var cat,
    sub,
    lr = rest.toLowerCase();
  if (type === "income")
    // 先看你自己的收入分类名（例如「兼职」「理财」）有没有出现在这句话里，再认工资 / 奖金
    cat =
      S.cats.income.find(function (c) { return c !== "其他" && raw.indexOf(c) >= 0; }) ||
      (/工资|薪水|salary|gaji|payroll/i.test(raw) && S.cats.income.indexOf("工资") >= 0 ? "工资" : guessCat(raw, "income"));
  else {
    var hit = null;
    S.cats.expense.forEach(function (c) {
      ((S.sub || {})[c] || []).forEach(function (x) {
        var xl = String(x).toLowerCase();
        if (xl.length >= 2 && lr.indexOf(xl) >= 0 && (!hit || xl.length > hit.l)) hit = { c: c, s: x, l: xl.length };
      });
    });
    if (hit) {
      cat = hit.c;
      sub = hit.s;
    }
    [ZHBRAND, ZHCAT].forEach(function (list) {
      if (cat) return;
      list.forEach(function (z) {
        if (!cat && z[0].test(rest) && S.cats.expense.indexOf(z[1]) >= 0) {
          cat = z[1];
          if (z[2] && ((S.sub || {})[z[1]] || []).indexOf(z[2]) >= 0) sub = z[2];
        }
      });
    });
    if (!cat) cat = guessCat(rest, "expense");
  }
  return { ok: true, type: type, amt: +pk.v.toFixed(2), cat: cat, sub: sub, note: rest, acc: accId, date: date };
}
function quickPreview(r) {
  var a = acc(r.acc) || {};
  return (
    (r.type === "income" ? "收入 · " : "") + r.cat + (r.sub ? " · " + r.sub : "") + " · " + fmt(r.amt, a.cur) + " · " + (a.name || "") +
    (r.date !== today() ? " · " + perMD(r.date) : "")
  );
}
// ---------- 🛒 购物清单 ----------
// S.shop = [{ id, name, staple?, done? }]：「我的账本」里是自己的清单，「共同账本」里是两个人共用的清单
// staple = 每周都买的日常用品；完成采购后它们会重新变成「没买」，这次临时买的会拿掉
var SHOPSUG = ["鸡蛋", "牛奶", "面包", "米", "食用油", "鸡肉", "蔬菜", "水果", "洗衣液", "纸巾", "洗发水", "牙膏", "洗洁精", "垃圾袋"];
function shopAdd(text, staple) {
  var n = 0;
  String(text || "")
    .split(/[，,、\n]+/)
    .forEach(function (t) {
      t = t.trim().slice(0, 40);
      if (!t) return;
      S.shop = S.shop || [];
      var dup = S.shop.find(function (x) { return x.name === t; });
      if (dup) {
        if (staple && !dup.staple) {
          dup.staple = true;
          n++;
        }
        return;
      }
      S.shop.push({ id: uid(), name: t, staple: staple ? true : undefined });
      n++;
    });
  if (n) save();
  return n;
}
function shopOpen(o) {
  return ((o && o.shop) || []).filter(function (x) { return !x.done; }).length;
}
function shopAlerts() {
  if (RO || cur !== "mine" || S.shopDay === undefined || S.shopDay === null) return "";
  var n = shopOpen(S);
  if (!n || new Date().getDay() !== +S.shopDay) return "";
  return '<div class="item row" data-go="shop" style="cursor:pointer"><div class="ico">🛒</div><div class="sp">今天是采购日<div class="mute">购物清单里还有 ' + n + " 样没买</div></div></div>";
}
function shopCard() {
  if (RO) return "";
  var mine = cur === "mine" ? S : typeof MINE !== "undefined" ? MINE : null,
    joint = cur === "joint" ? S : typeof JOINT !== "undefined" ? JOINT : null;
  return (
    '<div class="card"><b>🛒 购物清单</b><div class="mute" style="margin:4px 0 8px">每周去超市要买的日常用品，也可以和另一半共用一份清单。<br>我的：还差 ' +
    shopOpen(mine) + " 样" + (joint ? " · 共同：还差 " + shopOpen(joint) + " 样" : "") + '</div><button class="btn" data-go="shop">打开购物清单</button></div>'
  );
}
function shopDoneSheet() {
  var got = (S.shop || []).filter(function (x) { return x.done; });
  if (!got.length) return toast("先勾选买到的东西");
  var m = openSheet(
    "<b>✅ 完成采购</b><div class=\"mute\" style=\"margin:4px 0 8px\">已买 " + got.length + " 样。每周都买的会重新变成「没买」，这次临时买的会从清单里拿掉。</div>" +
      '<label>一共花了多少（选填，会记一笔「超市杂货」）</label><input id="sa" type="number" inputmode="decimal" step="0.01"><label>用哪个账户付</label><select id="sc">' +
      S.accounts.filter(function (a) { return !a.hide; }).map(function (a) { return '<option value="' + a.id + '">' + esc(a.name) + " (" + a.cur + ")</option>"; }).join("") +
      '</select><button class="btn" id="ok">完成</button>',
  );
  m.querySelector("#sc").value = defAcc();
  m.querySelector("#ok").onclick = function () {
    var amt = parseFloat(m.querySelector("#sa").value),
      accId = m.querySelector("#sc").value,
      cat = S.cats.expense.indexOf("超市杂货") >= 0 ? "超市杂货" : "其他";
    mark();
    S.shop = S.shop.filter(function (x) { return !(x.done && !x.staple); });
    S.shop.forEach(function (x) {
      if (x.done) x.done = undefined;
    });
    if (amt > 0 && cur === "mine")
      S.tx.push({ id: uid(), ts: Date.now(), type: "expense", amt: amt, acc: accId, date: today(), note: "购物清单", cat: cat, trip: S.trip ? S.trip.name : undefined });
    save();
    m.remove();
    render();
    if (amt > 0 && cur === "joint") txSheet(null, { type: "expense", amt: String(amt), acc: accId, to: "", cat: cat, note: "购物清单", date: today(), fee: "" });
    else showUndo(amt > 0 ? "已记录：超市杂货 " + fmt(amt, (acc(accId) || {}).cur) : "已完成采购");
  };
}
function shopPage() {
  var L = S.shop || [],
    n = shopOpen(S),
    canSwitch = cur === "joint" || chatOn();
  function row(x) {
    return (
      '<div class="item row"><button class="chip' + (x.done ? " on" : "") + '" data-shop="' + x.id + '" style="min-width:34px" aria-label="已买">' + (x.done ? "✓" : "") +
      '</button><span class="sp" data-shop="' + x.id + '" style="cursor:pointer;' + (x.done ? "text-decoration:line-through;opacity:.55" : "") + '">' + esc(x.name) +
      '</span><button class="chip" data-shopst="' + x.id + '" aria-label="每周都买">' + (x.staple ? "🔁" : "☆") + '</button><button class="chip" data-shopdel="' + x.id + '" aria-label="删除">✕</button></div>'
    );
  }
  function sorted(a) {
    return a.slice().sort(function (p, q) { return (p.done ? 1 : 0) - (q.done ? 1 : 0); });
  }
  var st = L.filter(function (x) { return x.staple; }),
    one = L.filter(function (x) { return !x.staple; }),
    have = L.map(function (x) { return x.name; }),
    sug = SHOPSUG.filter(function (x) { return have.indexOf(x) < 0; }).slice(0, 8),
    h =
      '<div class="card"><h1>🛒 购物清单</h1>' +
      (canSwitch
        ? '<div class="seg" style="margin:6px 0"><button data-shsw="mine" class="' + (cur === "mine" ? "on" : "") + '">我的清单</button><button data-shsw="joint" class="' + (cur === "joint" ? "on" : "") + '">共同清单</button></div>'
        : "") +
      '<div class="mute">' + (cur === "joint" ? "两个人共用，谁加、谁勾，对方都看得到" : "自己每周去超市要买的东西") + " · 还差 " + n + " 样（共 " + L.length + " 样）</div>" +
      '<div class="row" style="gap:8px;margin-top:10px"><input id="shi" placeholder="加一样，例如：鸡蛋（可用逗号一次加多样）" autocomplete="off"><button class="btn" id="shadd" style="margin:0;width:auto;padding:10px 16px">加</button></div>' +
      '<label style="display:flex;gap:8px;align-items:center;color:var(--ink);margin-top:8px"><input type="checkbox" id="shw" style="width:auto"' + (shopW ? " checked" : "") + "> 每周都买（完成采购后自动重置）</label>" +
      (sug.length ? '<div class="chips" style="margin-top:8px">' + sug.map(function (x) { return '<button class="chip" data-shsug="' + esc(x) + '">＋ ' + esc(x) + "</button>"; }).join("") + "</div>" : "") +
      "</div>";
  if (st.length) h += '<div class="card"><b>🔁 每周都买</b>' + sorted(st).map(row).join("") + "</div>";
  if (one.length) h += '<div class="card"><b>这次临时要买</b>' + sorted(one).map(row).join("") + "</div>";
  if (!L.length) h += '<div class="empty">清单是空的<br><span class="mute">先把每周都要买的日常用品加进来，勾上「每周都买」</span></div>';
  if (L.some(function (x) { return x.done; }))
    h += '<button class="btn" id="shdone">✅ 完成采购</button><button class="btn ghost" id="shreset" style="color:var(--mute)">取消全部勾选</button>';
  if (cur === "mine")
    h +=
      '<div class="card"><label style="margin-top:0">采购日提醒（那天打开 App，首页会提醒你清单里还有几样）</label><select id="shday"><option value="">不提醒</option>' +
      ["日", "一", "二", "三", "四", "五", "六"].map(function (d, i) { return '<option value="' + i + '"' + (S.shopDay !== undefined && +S.shopDay === i ? " selected" : "") + ">每周" + d + "</option>"; }).join("") +
      "</select></div>";
  return h;
}
function expIn(a, b) {
  var v = 0;
  S.tx.forEach(function (t) {
    var d = String(t.date || "").slice(0, 10);
    if (t.type === "expense" && d >= a && d <= b) v += cvt(t.amt, t);
  });
  return v;
}
var PAL = ["#e8506b", "#9b5de5", "#f15bb5", "#00bbf9", "#00c48c", "#fcb900", "#ff8a5c", "#6c757d", "#7a6bd6", "#2f9e6e"];
function billF(t) {
  if (fF === "all") return true;
  if (fF === "q") return !!t.q;
  return fF.indexOf("t:") === 0 ? t.type === fF.slice(2) : t.cat === fF.slice(2);
}
function fOpts() {
  function o(v, l) {
    return '<option value="' + esc(v) + '"' + (fF === v ? " selected" : "") + ">" + esc(l) + "</option>";
  }
  return (
    o("all", "全部类型和分类") + o("q", "❓ 有疑问") + o("t:expense", "仅支出") + o("t:income", "仅收入") + o("t:transfer", "仅转账") +
    '<optgroup label="支出分类">' + S.cats.expense.map(function (c) { return o("c:" + c, c); }).join("") +
    '</optgroup><optgroup label="收入分类">' + S.cats.income.map(function (c) { return o("c:" + c, c); }).join("") + "</optgroup>"
  );
}
function csvSheet() {
  var m = openSheet(
    '<b>导出 CSV</b><label>开始日期</label><input id="c1" type="date" value="' + new Date().getFullYear() +
      '-01-01"><label>结束日期</label><input id="c2" type="date" value="' + today() +
      '"><div class="mute" style="margin-top:8px">会多一列「折合 ' + S.base + '」，外币记录对账更方便</div><button class="btn" id="go">导出</button>',
  );
  m.querySelector("#go").onclick = function () {
    csv(m.querySelector("#c1").value, m.querySelector("#c2").value);
    m.remove();
  };
}
async function fxUpdate() {
  toast("正在更新汇率…");
  try {
    var j = await (await fetch("https://open.er-api.com/v6/latest/MYR")).json(),
      n = 0;
    if (!j || !j.rates) throw 0;
    CURS.forEach(function (c) {
      var v = j.rates[c];
      if (c !== "MYR" && v > 0) {
        S.rates[c] = +(1 / v).toPrecision(5);
        n++;
      }
    });
    save();
    render();
    toast("已更新 " + n + " 个币种的汇率");
  } catch (e) {
    toast("更新失败，请检查网络，或手动填写汇率");
  }
}
function prevRange(r) {
  var s = pd(r.a);
  if (statMode === "day") {
    var e = ds(new Date(s.getFullYear(), s.getMonth(), s.getDate() - 1));
    return [e, e];
  }
  if (statMode === "week")
    return [ds(new Date(s.getFullYear(), s.getMonth(), s.getDate() - 7)), ds(new Date(s.getFullYear(), s.getMonth(), s.getDate() - 1))];
  if (statMode === "month")
    return [ds(new Date(s.getFullYear(), s.getMonth() - 1, 1)), ds(new Date(s.getFullYear(), s.getMonth(), 0))];
  return [statYear - 1 + "-01-01", statYear - 1 + "-12-31"];
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
      return b.date.localeCompare(a.date) || (b.ts || 0) - (a.ts || 0);
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
    periodCard() +
    perHomeCard() +
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
    list = (fQ ? S.tx.filter(matchQ) : monthTx(m, fAcc)).filter(billF).sort(function (a, b) {
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
    '</select><select id="fc" style="margin-top:8px">' + fOpts() + "</select>" +
    (RO
      ? ""
      : '<div class="row" style="margin-top:8px;gap:8px"><button class="chip' + (selMode ? " on" : "") + '" id="selbtn">' +
        (selMode ? "完成" : "☑️ 选择") + "</button>" +
        (selMode
          ? '<span class="mute sp">已选 ' + Object.keys(sel).length + ' 笔</span><button class="chip" id="selcat">改分类</button><button class="chip" id="seldel" style="color:var(--exp)">删除</button>'
          : "") + "</div>") +
    '<div class="card row"><div class="sp"><div class="mute">收入</div><div class="num inc">' +
    fmt(s.i) +
    '</div></div><div class="sp"><div class="mute">支出</div><div class="num exp">' +
    fmt(s.e) +
    "</div></div></div>";
  if (!list.length) return h + '<div class="empty">这个月没有记录</div>';
  var cur = "",
    dayE = {};
  list.forEach(function (t) {
    if (t.type === "expense") dayE[t.date] = (dayE[t.date] || 0) + cvt(t.amt, t);
  });
  list.forEach(function (t) {
    if (t.date !== cur) {
      cur = t.date;
      h +=
        '<div class="date row"><span class="sp">' +
        (fQ ? cur : cur.slice(5).replace("-", "月") + "日") +
        "</span>" +
        (dayE[cur] ? "<span>支出 " + fmt(dayE[cur]) + "</span>" : "") +
        "</div>";
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

  var pv = prevRange(r),
    ptot = expIn(pv[0], pv[1]),
    df = tot - ptot,
    cmp = "",
    hl = "";
  if (df !== 0)
    cmp =
      '<div class="mute">较上一' + { day: "天", week: "周", month: "个月", year: "年" }[statMode] +
      '：<span class="' + (df > 0 ? "exp" : "inc") + '">' + (df > 0 ? "↑ " : "↓ ") + fmt(Math.abs(df)) +
      (ptot ? "（" + Math.abs((df / ptot) * 100).toFixed(0) + "%）" : "") + "</span></div>";
  if (statMode !== "day" && tot > 0) {
    var bk = Object.keys(sub).sort(function (a, b) {
        return sub[b] - sub[a];
      })[0],
      bt = null;
    list.forEach(function (t) {
      if (t.type !== "expense") return;
      var v = cvt(t.amt, t);
      if (!bt || v > bt.v) bt = { v: v, t: t };
    });
    hl =
      '<div class="mute">最高 ' + (statMode === "year" ? +bk.slice(5, 7) + "月" : bk.slice(5).replace("-", "月") + "日") +
      " " + fmt(sub[bk]) + (bt ? " · 最大一笔 " + esc(bt.t.cat) + " " + fmt(bt.v) : "") + "</div>";
  }
  var pie = "";
  if (tot > 0) {
    var acc0 = 0;
    pie =
      '<div style="position:relative;width:130px;height:130px;border-radius:50%;margin:10px auto;background:conic-gradient(' +
      keys
        .filter(function (k) {
          return by[k] > 0;
        })
        .map(function (k, i) {
          var p = (by[k] / tot) * 100,
            x = PAL[i % PAL.length] + " " + acc0 + "% " + (acc0 + p) + "%";
          acc0 += p;
          return x;
        })
        .join(",") +
      ')"><div class="mute" style="position:absolute;inset:28px;border-radius:50%;background:var(--card);display:grid;place-items:center">支出</div></div>';
  }
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
    "</div>" +
    cmp +
    hl +
    "</div>";

  // 分类明细
  h += '<div class="card"><b>分类支出</b>' + pie;
  h += keys.length
    ? keys
        .map(function (k, ki) {
          var bd = statMode === "month" ? S.budget[k] || 0 : 0,
            p = bd ? Math.min((by[k] / bd) * 100, 100) : tot ? (by[k] / tot) * 100 : 0,
            ov = bd && by[k] > bd;
          return (
            '<div class="item"><div class="row"><span class="sp"><i style="display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;background:' +
            PAL[ki % PAL.length] +
            '"></i>' +
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
    var trend = "";
    if (statMode === "year" && tot > 0) {
      var tv = rows.map(function (x, i) {
          if (!trendCat) return x[2];
          var s2 = 0;
          list.forEach(function (t) {
            if (t.type === "expense" && t.cat === trendCat && String(t.date).slice(5, 7) === p2(i + 1)) s2 += cvt(t.amt, t);
          });
          return s2;
        }),
        tmx = Math.max.apply(null, tv.concat(1)),
        pts = tv.map(function (v, i) {
          return [10 + (i * 280) / 11, 70 - (v / tmx) * 56];
        });
      trend =
        '<select id="tcat" style="margin-top:8px"><option value="">趋势：全部分类</option>' +
        keys
          .filter(function (k) { return by[k] > 0; })
          .map(function (k) { return '<option value="' + esc(k) + '"' + (k === trendCat ? " selected" : "") + ">趋势：" + esc(k) + "</option>"; })
          .join("") +
        '</select><svg viewBox="0 0 300 92" style="width:100%;margin:6px 0"><polyline fill="none" stroke="var(--acc)" stroke-width="2.5" stroke-linejoin="round" points="' +
        pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ") + '"/>' +
        pts.map(function (p, i) {
          return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3" fill="var(--acc)"/><text x="' + p[0].toFixed(1) + '" y="88" font-size="8" text-anchor="middle" fill="var(--mute)">' + (i + 1) + "</text>";
        }).join("") + "</svg>";
    }
    if (rows.length)
      h +=
        '<div class="card"><b>' +
        title +
        "</b>" +
        trend +
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
    '</details><button class="btn" id="fxb" style="margin-top:12px">🔄 自动更新汇率（会覆盖手动值）</button></div>';
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
    perSetCard() +
    loanCard() +
    subCard() +
    shopCard() +
    shortcutCard() +
    tripCard() +
    carCard() +
    more() +
    '<div class="card"><b>备份</b><div class="mute">数据只存在这个浏览器里，建议定期导出备份。</div><div class="row" style="margin-top:8px"><button class="chip" data-bk="out">导出</button><button class="chip" data-bk="in">导入</button><button class="chip" data-bk="csv">导出 CSV</button><button class="chip" data-bk="imp">导入银行账单</button><button class="chip" data-bk="pho_out">导出照片</button><button class="chip" data-bk="pho_in">导入照片</button>' +
    (localStorage.getItem("ledger.bak")
      ? '<button class="chip" data-bk="rst">恢复被覆盖的数据</button>'
      : "") +
    "</div></div>"
  );
}
function backup(k) {
  if (k === "imp") {
    importSheet();
    return;
  }
  if (k === "pho_out") {
    imgAll().then(async function (o) {
      var n = o ? Object.keys(o).length : 0;
      if (!n) return toast("没有照片可以导出");
      try {
        var dl2 = await claude.use("downloads");
        await dl2.save({ filename: "ledger-photos.json", data: new Blob([JSON.stringify(o)], { type: "application/json" }) });
        toast("已导出 " + n + " 张照片");
      } catch (e) {
        toast("导出失败");
      }
    });
    return;
  }
  if (k === "pho_in") {
    var inp = document.createElement("input");
    inp.type = "file";
    inp.accept = ".json,application/json";
    inp.onchange = function () {
      var rd = new FileReader();
      rd.onload = async function () {
        try {
          var o = JSON.parse(rd.result), n = 0;
          for (var id in o) if (typeof o[id] === "string" && o[id].indexOf("data:") === 0 && (await imgPut(id, o[id]))) n++;
          toast("已导入 " + n + " 张照片");
          render();
        } catch (e) {
          toast("照片文件无法识别");
        }
      };
      rd.readAsText(inp.files[0]);
    };
    inp.click();
    return;
  }
  if (k === "csv") {
    csvSheet();
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
    try {
      localStorage.setItem("ledger.lastbk", Date.now());
    } catch (e) {}
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
      '"><label>余额低于多少提醒我（选填，预付卡 / 电子钱包用）</label><input id="lw" type="number" inputmode="decimal" step="0.01" value="' +
      (a.low || "") +
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
          low: parseFloat(m.querySelector("#lw").value) || undefined,
          hide: m.querySelector("#hd").checked ? 1 : undefined,
        });
      else {
        a.name = n;
        a.type = type;
        a.cur = cur;
        a.bal = bal;
        a.due = du;
        a.low = parseFloat(m.querySelector("#lw").value) || undefined;
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
  if (S.trip)
    h +=
      '<div class="item row"><div class="ico">✈️</div><div class="sp">旅行中：' + esc(S.trip.name) +
      '<div class="mute">已花 ' + fmt(tripTotal(S.trip.name)) + "</div></div></div>";
  h += perAlerts() + loanAlerts() + subAlerts() + shopAlerts();
  if (!RO)
    ((cur === "joint" ? S.tx : (JOINT && JOINT.tx) || []).filter(function (t) { return t.q && t.q.by !== myId; }))
      .slice(0, 3)
      .forEach(function (t) {
        h +=
          '<div class="item row"><div class="ico">❓</div><div class="sp">' + esc(t.q.who || "对方") + " 对一笔账有疑问" +
          '<div class="mute">' + esc(t.cat + " · " + fmt(t.amt) + " · " + t.date + (t.q.text ? "：" + t.q.text : "")) +
          '</div></div><button class="chip on" data-qgo="' + t.id + '">查看</button></div>';
      });
  if (!RO && cur === "mine")
    S.cars.forEach(function (c) {
      (c.items || []).forEach(function (it) {
        svcStatus(c, it).forEach(function (x) {
          if (x.warn)
            h +=
              '<div class="item row" data-car="' + c.id + '" style="cursor:pointer"><div class="ico">' + (x.over ? "🚨" : "🔧") + '</div><div class="sp">' +
              esc(c.name) + " · " + esc(it.name) + '<div class="mute">' + x.txt + "</div></div></div>";
        });
      });
    });
  if (!RO) {
    var pend = S.tx.filter(function (t) {
      return t.sp && spOwed(t) - spBack(t) > 0.005;
    });
    pend.slice(0, 5).forEach(function (t) {
      h +=
        '<div class="item row"><div class="ico">👥</div><div class="sp">' + esc(t.sp.who || "朋友") + " 还欠你 " +
        fmt(spOwed(t) - spBack(t), (acc(t.acc) || {}).cur) + '<div class="mute">' + esc(t.cat + (t.note ? " · " + t.note : "")) + " · " + t.date +
        '</div></div><button class="chip on" data-sprecv="' + t.id + '">收款</button></div>';
    });
    if (pend.length > 5) h += '<div class="mute" style="padding:4px 0">还有 ' + (pend.length - 5) + " 笔待收款，在账单里点开可查看</div>";
  }
  var tb = S.tbud,
    tm = 0;
  Object.keys(by).forEach(function (k) {
    tm += by[k];
  });
  if (tb > 0) {
    var dl = new Date(td.getFullYear(), td.getMonth() + 1, 0).getDate() - td.getDate() + 1,
      left = tb - tm,
      pc = Math.round((tm / tb) * 100);
    h +=
      '<div class="item"><div class="row"><div class="ico">' + (tm > tb ? "🚨" : pc >= 80 ? "⚠️" : "💰") +
      '</div><div class="sp">本月总预算已用 ' + pc + '%<div class="mute">' +
      (left >= 0 ? "还剩 " + fmt(left) + "，每天可花 " + fmt(left / dl) : "已超支 " + fmt(-left)) +
      '</div></div><div class="num' + (tm > tb ? " exp" : "") + '">' + fmt(tm) + " / " + fmt(tb) +
      '</div></div><div class="bar"><i style="width:' + Math.min(pc, 100) + "%" + (tm > tb ? ";background:var(--exp)" : "") + '"></i></div></div>';
  }
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
    if (!(a.low > 0)) return;
    var lb2 = balance(a);
    if (lb2 < a.low)
      h +=
        '<div class="item row"><div class="ico">🔋</div><div class="sp">' + esc(a.name) + " 余额只剩 " + fmt(lb2, a.cur) +
        '<div class="mute">低于 ' + fmt(a.low, a.cur) + "，该充值了</div></div></div>";
  });
  try {
    if (!RO && !(DBR && lsGet())) {
      var lb = +localStorage.getItem("ledger.lastbk") || +localStorage.getItem("ledger.first") || 0;
      if (!lb) localStorage.setItem("ledger.first", Date.now());
      else if (S.tx.length && Date.now() - lb > 7 * 864e5)
        h +=
          '<div class="item row"><div class="ico">🗄️</div><div class="sp">已经 ' + Math.floor((Date.now() - lb) / 864e5) +
          ' 天没备份了<div class="mute">数据只存在这台手机里</div></div><button class="chip on" data-bk="out">备份</button></div>';
    }
  } catch (e) {}
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
    '）</b><div class="mute">留空表示不设预算，超过 80% 会在总览提醒</div><div class="row item"><span class="sp">💰 本月总预算</span><input type="number" inputmode="decimal" style="width:110px" data-tbud="1" value="' + (S.tbud || "") + '"></div>' +
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
        amt: f.amt > 0 ? String(f.amt) : "",
        acc: acc(f.acc) ? f.acc : S.accounts[0].id,
        to: "",
        cat: f.cat,
        sub: f.sub,
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
  i.oninput = async function () {
    var v = i.value,
      hashed = S.pin.indexOf("h1:") === 0,
      okp = hashed ? (await pinHash(v)) === S.pin : v === S.pin;
    if (okp) {
      if (!hashed) {
        // 旧版明文 PIN：解锁成功后顺便改成哈希保存
        S.pin = await pinHash(v);
        S.pinLen = v.length;
        save();
      }
      d.remove();
    } else if (v.length >= (hashed ? S.pinLen || 6 : S.pin.length)) {
      d.querySelector("#le").textContent = "PIN 不对";
      i.value = "";
    }
  };
}
document.addEventListener("visibilitychange", function () {
  if (document.hidden) lock();
  else if (!RO && S && S.rec) {
    var n0 = S.tx.length;
    runRec();
    if (S.tx.length !== n0) render();
  }
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
  话费充值: "📶",
  外卖: "🛵",
  咖啡饮料: "☕",
  超市杂货: "🛒",
  日用品: "🧴",
  订阅会员: "🔁",
  衣服鞋包: "👕",
  手机数码: "📱",
  美容美发: "💇",
  运动健身: "🏋️",
  宠物: "🐾",
  汽车: "🚗",
  保险: "🛡️",
  礼物红包: "🎁",
  孩子: "🧸",
  家居维修: "🔧",
  税费罚款: "🧾",
  慈善捐款: "🤝",
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
  ["starbucks", "#00704A", "SB"],
  ["zus", "#14284B", "ZUS"],
  ["tealive", "#D7263D", "TL"],
  ["chagee", "#1B4D3E", "霸"],
  ["gong cha,gongcha", "#B3001B", "GC"],
  ["luckin", "#0A3D91", "LK"],
  ["kenangan", "#B8860B", "KN"],
  ["mcd,mcdonald", "#FFC72C", "M", "#DA291C"],
  ["kfc", "#E4002B", "KFC"],
  ["pizza hut", "#EE3124", "PH"],
  ["domino", "#006491", "Dom"],
  ["subway", "#009A44", "Sub"],
  ["7-eleven,7eleven,7 eleven", "#00833E", "7"],
  ["kk mart", "#E4002B", "KK"],
  ["aeon", "#C2185B", "AEON"],
  ["lotus,tesco", "#E31837", "Lotus"],
  ["giant", "#D4001A", "G"],
  ["99 speedmart,99speedmart", "#FFD100", "99", "#222"],
  ["mydin", "#F58220", "Myd"],
  ["jaya grocer", "#0B6B3A", "JG"],
  ["nsk", "#E2231A", "NSK"],
  ["econsave", "#E31837", "Eco"],
  ["watsons", "#00A19B", "W"],
  ["guardian", "#00843D", "Gd"],
  ["mr diy,mrdiy", "#FFC72C", "DIY", "#C8102E"],
  ["ikea", "#0058A3", "IKEA", "#FFDA1A"],
  ["zalora", "#111111", "Z"],
  ["uniqlo", "#E4002B", "UQ"],
  ["h&m", "#E50010", "H&M"],
  ["zara", "#111111", "ZARA"],
  ["padini", "#111111", "PD"],
  ["nike", "#111111", "Nike"],
  ["adidas", "#111111", "ad"],
  ["decathlon", "#0082C3", "Dec"],
  ["samsung", "#1428A0", "SS"],
  ["xiaomi", "#FF6900", "Mi"],
  ["huawei", "#CF0A2C", "Hw"],
  ["tgv", "#E4002B", "TGV"],
  ["gsc", "#ED1C24", "GSC"],
  ["air selangor", "#0072BC", "AS"],
  ["indah water", "#0072BC", "IWK"],
  ["time dotcom", "#E31837", "TIME"],
  ["aia", "#D31145", "AIA"],
  ["great eastern", "#E31837", "GE"],
  ["prudential", "#ED1B2E", "Pru"],
  ["allianz", "#003781", "Alz"],
  ["takaful", "#00694B", "Tak"],
  ["anytime fitness", "#6A2C91", "AF"],
  ["celebrity fit", "#E4002B", "CF"],
  ["sephora", "#111111", "Sep"],
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
  var b = (t.note || t.sub) && brand((t.note || "") + " " + (t.sub || ""));
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
  if (!(c.pset && c.pset.share)) {
    delete c.pl;
    delete c.pset;
  }
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
// ---------- 聊天室 ----------
// 每个人只写自己的文档 chat/<自己的id>（里面是自己发的消息），读对方的文档，所以两个人同时发也不会互相覆盖。
// 消息和账本用同一个共同密码加密。本机另存一份完整记录，服务器上每人只留最近 300 条。
var CHK = "ledger.chat",
  CH = loadChat(),
  CC = null,
  CD = null,
  chatUnsub = null,
  chatMs = 0,
  chatQ = Promise.resolve();
function loadChat() {
  try {
    var o = JSON.parse(localStorage.getItem(CHK) || "null");
    if (o && o.msgs) return o;
  } catch (e) {}
  return { msgs: {}, seen: 0, pseen: 0, peer: "", pname: "" };
}
function saveChat() {
  var ids = Object.keys(CH.msgs);
  if (ids.length > 2000)
    ids
      .sort(function (a, b) {
        return CH.msgs[a].t - CH.msgs[b].t;
      })
      .slice(0, ids.length - 2000)
      .forEach(function (k) {
        delete CH.msgs[k];
      });
  try {
    localStorage.setItem(CHK, JSON.stringify(CH));
  } catch (e) {}
}
function chatOn() {
  return shState === "ok" && !!CC;
}
function chatList() {
  return Object.keys(CH.msgs)
    .map(function (k) {
      return CH.msgs[k];
    })
    .sort(function (a, b) {
      return a.t - b.t || (a.id < b.id ? -1 : 1);
    });
}
function chatUnread() {
  var n = 0;
  Object.keys(CH.msgs).forEach(function (k) {
    var m = CH.msgs[k];
    if (m.a !== myId && !m.d && m.t > CH.seen) n++;
  });
  return n;
}
function chatBadgeHtml() {
  var n = chatUnread();
  return n ? '<i class="dot">' + (n > 9 ? "9+" : n) + "</i>" : "";
}
function updateBadge() {
  var n = chatUnread(),
    b = document.querySelector('#nav [data-tab="chat"] b');
  if (b) b.innerHTML = "💬" + chatBadgeHtml();
  document.title = (n ? "(" + n + ") " : "") + "账本";
  try {
    if (navigator.setAppBadge) {
      if (n) navigator.setAppBadge(n);
      else navigator.clearAppBadge();
    }
  } catch (e) {}
}
function chatListHtml() {
  var list = chatList(),
    h = "",
    day = "",
    lastRead = null;
  list.forEach(function (m) {
    if (m.a === myId && !m.d && m.t <= CH.pseen && !m.p) lastRead = m.id;
  });
  if (!list.length) return '<div class="empty">还没有消息，打个招呼吧 💬</div>';
  list.forEach(function (m) {
    var d = new Date(m.t),
      ds2 = ds(d),
      mine = m.a === myId;
    if (ds2 !== day) {
      day = ds2;
      h += '<div class="date" style="text-align:center">' + (ds2 === today() ? "今天" : ds2.slice(5).replace("-", "月") + "日") + "</div>";
    }
    h +=
      '<div class="cm ' + (mine ? "r" : "l") + '"><div class="bub ' + (mine ? "me" : "pe") + '" data-cm="' + m.id + '">' +
      (m.d ? '<i style="opacity:.7">消息已撤回</i>' : chatCard(m.c, m.x) + (m.x ? esc(m.x) : "")) + '</div><div class="cmeta">' +
      p2(d.getHours()) + ":" + p2(d.getMinutes()) +
      (mine ? (m.p ? " · 发送中…" : m.id === lastRead ? " · 已读" : "") : "") + "</div></div>";
  });
  return h;
}
function chatPage() {
  if (!chatOn())
    return '<div class="card"><b>💬 聊天</b><div class="mute" style="margin-top:6px">先在「更多 → 同步设置」连接你们的数据库，就能在这里聊天了。</div></div>';
  return (
    '<div class="card" style="padding:10px 14px"><b>💬 ' + esc(CH.pname || "聊天") +
    '</b><div class="mute">消息已加密，两个人都打开 App 时几秒内会同步（没有推送通知）</div></div><div id="chatlist" style="padding-bottom:130px">' +
    chatListHtml() +
    '</div><div class="chatbar"><div class="in"><div class="chips emo">' +
    ["😘", "❤️", "😂", "👍", "🥺"].map(function (e) { return '<button class="chip">' + e + "</button>"; }).join("") +
    '</div><div class="row" style="margin-top:6px"><input id="cin" placeholder="说点什么…" autocomplete="off" enterkeyhint="send"><button class="chip on" id="csend" style="padding:9px 16px">发送</button></div></div></div>'
  );
}
function chatScroll() {
  window.scrollTo(0, document.body.scrollHeight);
}
function chatDraw(force) {
  var l = document.getElementById("chatlist");
  if (!l) return;
  var near = window.innerHeight + window.scrollY >= document.body.scrollHeight - 160;
  l.innerHTML = chatListHtml();
  if (force || near) chatScroll();
  chatSeen();
}
function chatSeen() {
  if (tab !== "chat" || document.hidden) return;
  var latest = CH.seen;
  Object.keys(CH.msgs).forEach(function (k) {
    var m = CH.msgs[k];
    if (m.a !== myId && m.t > latest) latest = m.t;
  });
  if (latest > CH.seen) {
    CH.seen = latest;
    saveChat();
    updateBadge();
    chatPush();
  }
}
function chatBind() {
  var inp = document.getElementById("cin"),
    l = document.getElementById("chatlist");
  if (!inp || !l) return;
  function send() {
    var v = inp.value;
    inp.value = "";
    chatSend(v);
    inp.focus();
  }
  document.getElementById("csend").onclick = send;
  inp.onkeydown = function (e) {
    if (e.key === "Enter" && !e.isComposing) {
      e.preventDefault();
      send();
    }
  };
  document.querySelectorAll(".emo button").forEach(function (b) {
    b.onclick = function () {
      chatSend(b.textContent);
    };
  });
  l.onclick = function (e) {
    var b = e.target.closest("[data-cm]");
    if (!b) return;
    var m = CH.msgs[b.dataset.cm];
    if (m && m.a === myId && !m.d && confirm("撤回这条消息？")) chatRecall(m.id);
  };
  chatScroll();
  chatSeen();
}
function chatSend(x, c) {
  x = String(x || "").trim();
  if ((!x && !c) || !myId) return;
  var m = { id: uid(), a: myId, t: Date.now(), x: x.slice(0, 1000), p: 1 };
  if (c) m.c = c;
  CH.msgs[m.id] = m;
  saveChat();
  chatDraw(true);
  chatPush();
}
function cardOf(t) {
  return { cat: t.cat, sub: t.sub, amt: +t.amt || 0, cur: (acc(t.acc) || {}).cur, date: t.date, note: t.note || "", type: t.type };
}
function chatCard(c, hasText) {
  if (!c) return "";
  return (
    '<div style="background:rgba(127,127,127,.16);border-radius:12px;padding:8px 10px;' + (hasText ? "margin-bottom:6px" : "") +
    '"><div style="font-size:12px;opacity:.85">📒 ' + esc(c.cat || "") + (c.sub ? " · " + esc(c.sub) : "") +
    '</div><div style="font-size:20px;font-weight:800">' + (c.type === "income" ? "+" : "") + fmt(c.amt, c.cur) +
    '</div><div style="font-size:12px;opacity:.85">' + esc(c.date || "") + (c.note ? " · " + esc(c.note) : "") + "</div></div>"
  );
}
function shareToChat(t) {
  var c = cardOf(t),
    m = openSheet(
      '<b>💬 发到聊天</b><div class="card" style="box-shadow:none">' + chatCard(c) +
        '</div><label>想说点什么？（可不填）</label><input id="sc2" placeholder="例如：这笔是什么呀？"><button class="btn" id="ok">发送</button>',
    );
  m.querySelector("#ok").onclick = function () {
    chatSend(m.querySelector("#sc2").value, c);
    document.querySelectorAll(".mask").forEach(function (x) { x.remove(); });
    tab = "chat";
    render();
  };
}
// ---------- 账单「有疑问」标记（共同账本）----------
function qNotify(r) {
  if (!chatOn()) return;
  chatSend("❓ 这笔有疑问" + (r.q.text ? "：" + r.q.text : ""), cardOf(r));
}
function chatRecall(id) {
  var m = CH.msgs[id];
  if (!m || m.a !== myId) return;
  m.d = 1;
  m.x = "";
  m.c = undefined;
  saveChat();
  chatDraw();
  chatPush();
}
// 把自己的消息写到云端（先读后写，合并别的设备发的，只保留最近 300 条）
function chatPush() {
  chatQ = chatQ.then(async function () {
    if (!CD || !myId) return;
    try {
      var sn = await CD.get(),
        mine = {};
      if (sn.exists && sn.data().json) {
        try {
          (JSON.parse(sn.data().json).m || []).forEach(function (m) {
            mine[m.id] = m;
          });
        } catch (e) {}
      }
      Object.keys(CH.msgs).forEach(function (k) {
        var m = CH.msgs[k];
        if (m.a === myId) mine[k] = { id: m.id, t: m.t, x: m.d || (mine[k] && mine[k].d) ? "" : m.x, d: m.d || (mine[k] && mine[k].d) || undefined, c: m.d || (mine[k] && mine[k].d) ? undefined : m.c };
      });
      var arr = Object.keys(mine)
        .map(function (k) {
          return mine[k];
        })
        .sort(function (a, b) {
          return a.t - b.t;
        })
        .slice(-300);
      await CD.set({ json: JSON.stringify({ m: arr, seen: CH.seen }), t: Date.now() });
      Object.keys(CH.msgs).forEach(function (k) {
        delete CH.msgs[k].p;
      });
      saveChat();
      if (tab === "chat") chatDraw();
    } catch (e) {
      /* 没发出去的消息保持「发送中」，下次会一起补发 */
    }
  });
  return chatQ;
}
function chatMerge(id, data, fresh) {
  var o;
  try {
    o = JSON.parse(data.json);
  } catch (e) {
    return;
  }
  (o.m || []).forEach(function (m) {
    if (!CH.msgs[m.id] && id !== myId && !m.d) fresh.push(m);
    CH.msgs[m.id] = { id: m.id, a: id, t: m.t, x: m.x, d: m.d, c: m.c };
  });
  if (id !== myId) {
    CH.peer = id;
    if (data.name) CH.pname = data.name;
    CH.pseen = o.seen || 0;
  } else CH.seen = Math.max(CH.seen, o.seen || 0);
}
function chatSub(ms) {
  if (!CC || chatMs === ms) return;
  if (chatUnsub) chatUnsub();
  chatMs = ms;
  chatUnsub = CC.onSnapshot(function (sn) {
    var fresh = [];
    sn.docs.forEach(function (d) {
      chatMerge(d.id, d.data(), fresh);
    });
    saveChat();
    updateBadge();
    if (tab === "chat") chatDraw();
    else if (fresh.length) toast("💬 " + (CH.pname || "对方") + "：" + (fresh[fresh.length - 1].x || "📒 发来一笔账单").slice(0, 30));
  }, ms);
}
setInterval(function () {
  if (chatOn() && Object.keys(CH.msgs).some(function (k) { return CH.msgs[k].p; })) chatPush();
}, 8000);
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
    CC = c.collection("chat");
    CD = c.doc("chat/" + me);
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
    chatSub(6000);
    render();
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
          (x.amt > 0 ? " " + fmt(x.amt, (acc(x.acc) || {}).cur) : "") +
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
async function csv(from, to) {
  try {
    var dl = await claude.use("downloads");
    if (!dl) return;
    var rows = [["日期", "类型", "账户", "分类", "金额", "币种", "备注", "记录人", "折合 " + S.base, "手填MYR", "AA已收回", "里程km", "升数"]];
    S.tx
      .slice()
      .filter(function (t) {
        return (!from || t.date >= from) && (!to || t.date <= to);
      })
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
          t.type === "transfer" ? "" : +cvt(t.amt, t).toFixed(2),
          t.myr || "",
          t.sp ? spBack(t) : "",
          t.odo || "",
          t.lit || "",
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
    toast("已导出 " + (rows.length - 1) + " 条记录");
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
  var old = document.getElementById("toast0");
  if (old) old.remove();
  var d = document.createElement("div");
  d.id = "toast0";
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
      pinHash(p).then(function (h) {
        S.pin = h;
        S.pinLen = p.length;
        save();
        render();
      });
      m.remove();
    } else toast("PIN 需要是 4 到 6 位数字");
  };
}
var UN = null;
function mark() {
  UN = { cur: cur, j: JSON.stringify(S), fresh: true };
}
function showUndo(msg) {
  var d = document.createElement("div");
  d.style.cssText =
    "position:fixed;left:50%;bottom:110px;transform:translateX(-50%);background:#4a2a33;color:#fff;padding:10px 14px;border-radius:14px;z-index:200;display:flex;gap:14px;align-items:center";
  d.innerHTML =
    '<span>' + esc(msg || '已删除') + '</span><button style="background:none;border:0;color:#ffb3c6;font:inherit;font-weight:700;cursor:pointer">撤销</button>';
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
// 收据照片存在 IndexedDB（容量大），账本数据里 img 只留一个标记 1
var IDB = null;
function idb() {
  return (
    IDB ||
    (IDB = new Promise(function (ok) {
      try {
        var q = indexedDB.open("ledger-img", 1);
        q.onupgradeneeded = function () {
          q.result.createObjectStore("img");
        };
        q.onsuccess = function () {
          ok(q.result);
        };
        q.onerror = q.onblocked = function () {
          ok(null);
        };
      } catch (e) {
        ok(null);
      }
    }))
  );
}
function imgOp(mode, fn) {
  return idb().then(function (d) {
    if (!d) return null;
    return new Promise(function (ok) {
      try {
        var tr = d.transaction("img", mode),
          r = fn(tr.objectStore("img"));
        tr.oncomplete = function () {
          ok(r ? r.result : true);
        };
        tr.onerror = tr.onabort = function () {
          ok(null);
        };
      } catch (e) {
        ok(null);
      }
    });
  });
}
function imgPut(id, u) {
  return imgOp("readwrite", function (s) {
    return s.put(u, id);
  });
}
function imgGet(id) {
  return imgOp("readonly", function (s) {
    return s.get(id);
  });
}
function imgDel(id) {
  return imgOp("readwrite", function (s) {
    return s["delete"](id);
  });
}
// 把还留在账本里的旧照片（base64）搬进 IndexedDB，账本里只留标记
function imgMigrate() {
  if (cur !== "mine") return;
  S.tx
    .filter(function (t) {
      return typeof t.img === "string" && t.img.indexOf("data:") === 0;
    })
    .forEach(function (t) {
      imgPut(t.id, t.img).then(function (r) {
        if (!r || cur !== "mine") return;
        var x = S.tx.find(function (y) {
          return y.id === t.id;
        });
        if (!x || x.img !== t.img) return;
        x.img = 1;
        LM.rebase("mine", S);
        try {
          localStorage.setItem(KEY, JSON.stringify(S));
        } catch (e) {}
      });
    });
}
// 清掉已经没有对应记录的照片（启动时跑一次，不影响刚删除后的撤销）
function imgGC() {
  if (cur !== "mine" || !S.tx.length) return;
  imgOp("readonly", function (s) {
    return s.getAllKeys();
  }).then(function (ks) {
    if (!ks || ks === true) return;
    var live = {};
    S.tx.forEach(function (t) {
      if (t.img) live[t.id] = 1;
    });
    ks.forEach(function (k) {
      if (!live[k]) imgDel(k);
    });
  });
}
function squash(f, cb) {
  var r = new FileReader();
  r.onload = function () {
    var im = new Image();
    im.onload = function () {
      var k = Math.min(1, 900 / Math.max(im.width, im.height)),
        c = document.createElement("canvas");
      c.width = im.width * k;
      c.height = im.height * k;
      c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
      cb(c.toDataURL("image/jpeg", 0.7));
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
      acc: defAcc(),
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
  var qWas = !!(edit && edit.q);
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
      spF() +
      qF() +
      fuelF() +
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
      (edit && chatOn() ? '<button class="btn ghost" style="color:var(--acc)" id="tochat">💬 发到聊天</button>' : "") +
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
  function imgShow(id) {
    imgGet(id).then(function (u) {
      var el = sh.querySelector("#rimv");
      if (el && u && typeof u === "string") el.src = u;
    });
    return "";
  }
  function imgF() {
    if (cur !== "mine") return "";
    return (
      "<label>收据照片（只存在这台手机，不同步）</label>" +
      (t.img
        ? '<img id="rimv" alt=""' +
          (t.img === 1 ? "" : ' src="' + t.img + '"') +
          ' style="width:100%;border-radius:12px"><button class="chip" id="rmimg" style="margin:6px 0">移除照片</button>'
        : "") +
      (t.img === 1 && t.id ? imgShow(t.id) : "") +
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
          (brand(x) ? badge(brand(x)) + " " : "") +
          esc(x) +
          "</button>"
        );
      }).join("") +
      "</div>"
    );
  }
  function spF() {
    if (cur !== "mine" || st.type !== "expense") return "";
    var sp = t.sp,
      locked = sp && sp.pays && sp.pays.length,
      h =
        '<label style="display:flex;gap:8px;align-items:center;color:var(--ink)"><input type="checkbox" id="spon" style="width:auto"' +
        (sp ? " checked" : "") + (locked ? " disabled" : "") + "> 👥 AA 分账（我先垫付，朋友之后还我）</label>";
    if (!sp) return h;
    var am = parseFloat(t.amt) || 0,
      n = Math.max(2, parseInt(sp.n) || 2),
      cu = (acc(t.acc) || {}).cur;
    h +=
      '<div class="card" style="margin:8px 0;background:var(--accbg);box-shadow:none"><label style="margin-top:0">几个人分（含我）</label><input id="spn" type="number" inputmode="numeric" min="2" step="1" value="' +
      n + '"><label>我的那份（留空 = 平均分）</label><input id="spm" type="number" inputmode="decimal" step="0.01" placeholder="' +
      (am > 0 ? (am / n).toFixed(2) : "") + '" value="' + esc(sp.mine === undefined || sp.mine === "" ? "" : sp.mine) +
      '"><label>谁欠我（选填）</label><input id="spw" value="' + esc(sp.who || "") + '" placeholder="例如：Ali、Siti"><div class="mute" id="spi" style="margin-top:8px">' +
      spInfo(am, spMineOf(am, sp), spBack({ sp: sp }), cu) + "</div>";
    (sp.pays || []).forEach(function (p, i) {
      h +=
        '<div class="row" style="margin-top:6px"><span class="sp mute">' + esc(p.date) + " 收到 " + fmt(p.amt, cu) + " → " +
        esc((acc(p.acc) || {}).name || "已删除") + '</span><button class="chip" data-sprm="' + i + '">✕</button></div>';
    });
    return h + '<button class="btn" id="sprv" style="margin-top:10px;background:var(--card);color:var(--acc);box-shadow:none;border:1px solid var(--acc)">💸 对方还钱了</button></div>';
  }
  function qF() {
    if (cur !== "joint" || !edit) return "";
    var q = t.q;
    if (!q) return '<button class="chip" id="qset" style="margin:8px 0">❓ 标记有疑问（通知对方）</button>';
    return (
      '<div class="card" style="margin:8px 0;background:var(--accbg);box-shadow:none"><b>❓ ' + esc(q.who || "有疑问") +
      ' 标记了有疑问</b><label>想问什么（选填）</label><input id="qtext" value="' + esc(q.text || "") +
      '" placeholder="例如：这是什么？"><button class="btn" id="qdone" style="margin-top:10px;background:var(--card);color:var(--acc);box-shadow:none;border:1px solid var(--acc)">✅ 已解决，取消标记</button></div>'
    );
  }
  function fuelF() {
    if (cur !== "mine" || st.type !== "expense" || st.cat !== "油费") return "";
    if (!S.cars.length) return '<button class="chip" id="fnew" style="margin:8px 0">🚗 添加车辆，记录里程和油耗</button>';
    var cid = S.cars.some(function (x) { return x.id === t.car; }) ? t.car : S.cars[0].id,
      car = S.cars.find(function (x) { return x.id === cid; });
    return (
      '<label>⛽ 加油记录</label><select id="fcar">' +
      S.cars.map(function (x) { return '<option value="' + x.id + '"' + (x.id === cid ? " selected" : "") + ">" + esc(x.name) + "</option>"; }).join("") +
      '</select><div class="row" style="gap:8px;margin-top:8px"><input id="fodo" type="number" inputmode="numeric" placeholder="目前里程 km' +
      (car.odo ? "（上次 " + car.odo + "）" : "") + '" value="' + esc(t.odo || "") +
      '"><input id="flit" type="number" inputmode="decimal" step="0.01" placeholder="加了多少升" value="' + esc(t.lit || "") +
      '"></div><div class="mute" id="fli" style="margin-top:6px">' +
      fuelNow(cid, parseFloat(t.odo) || 0, parseFloat(t.lit) || 0, parseFloat(t.amt) || 0, t.id, (acc(t.acc) || {}).cur) + "</div>"
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
    var qt2 = sh.querySelector("#qtext");
    if (qt2 && t.q) t.q.text = qt2.value;
    var fc = sh.querySelector("#fcar");
    if (fc) {
      t.car = fc.value;
      t.odo = g("fodo");
      t.lit = g("flit");
    }
    var sq = sh.querySelector("#spon");
    if (sq && !sq.disabled) {
      if (sq.checked) {
        var so = t.sp || { pays: [] },
          sn = sh.querySelector("#spn"),
          sm = sh.querySelector("#spm"),
          sw2 = sh.querySelector("#spw");
        so.n = Math.max(2, parseInt(sn ? sn.value : so.n) || 2);
        if (sm) so.mine = sm.value;
        if (sw2) so.who = sw2.value;
        t.sp = so;
      } else t.sp = undefined;
    }
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
    if (id === "amt" || id === "fodo" || id === "flit") {
      var fi = sh.querySelector("#fli"),
        fq = sh.querySelector("#fcar");
      if (fi && fq)
        fi.textContent = fuelNow(
          fq.value, parseFloat(sh.querySelector("#fodo").value) || 0, parseFloat(sh.querySelector("#flit").value) || 0,
          parseFloat(sh.querySelector("#amt").value) || 0, t.id, (acc(t.acc) || {}).cur,
        );
    }
    if (id === "amt" || id === "spn" || id === "spm") {
      var pn = sh.querySelector("#spn"),
        pm = sh.querySelector("#spm"),
        pi = sh.querySelector("#spi");
      if (pn && pm && pi) {
        var a1 = parseFloat(sh.querySelector("#amt").value) || 0,
          n1 = Math.max(2, parseInt(pn.value) || 2);
        pm.placeholder = a1 > 0 ? (a1 / n1).toFixed(2) : "";
        pi.textContent = spInfo(a1, spMineOf(a1, { n: n1, mine: pm.value }), spBack({ sp: t.sp }), (acc(t.acc) || {}).cur);
      }
    }
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
    if (e.target.id === "fcar") {
      keep();
      draw();
      return;
    }
    if (e.target.id === "acc" || e.target.id === "to" || e.target.id === "spon") {
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
    } else if (b.id === "tochat") {
      keep();
      shareToChat(edit);
    } else if (b.id === "qset") {
      keep();
      t.q = { by: myId, who: myName, t: Date.now(), text: "" };
      draw();
    } else if (b.id === "qdone") {
      keep();
      t.q = undefined;
      draw();
    } else if (b.id === "fnew") {
      keep();
      carNew(function () {
        draw();
      });
    } else if (b.id === "sprv") {
      keep();
      var am3 = parseFloat(t.amt) || 0,
        sp3 = t.sp || {};
      spPaySheet(t, Math.max(0, am3 - spMineOf(am3, sp3) - spBack({ sp: sp3 })), function (p) {
        t.sp.pays = (t.sp.pays || []).concat([p]);
        draw();
      });
    } else if (b.dataset.sprm !== undefined) {
      keep();
      t.sp.pays.splice(+b.dataset.sprm, 1);
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
          sub: t.sub,
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
        trip: edit ? edit.trip : S.trip ? S.trip.name : undefined,
        q: cur === "joint" ? t.q : undefined,
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
      if (rec.q && !qWas)
        setTimeout(function () {
          qNotify(rec);
        }, 0);
      if (cur === "mine" && st.type === "expense" && st.cat === "油费" && S.cars.length) {
        var fcid = S.cars.some(function (x) { return x.id === t.car; }) ? t.car : S.cars[0].id,
          fo = parseFloat(t.odo),
          fl = parseFloat(t.lit),
          fcar = S.cars.find(function (x) { return x.id === fcid; });
        rec.car = fcid;
        rec.odo = fo > 0 ? fo : undefined;
        rec.lit = fl > 0 ? fl : undefined;
        if (fo > (+fcar.odo || 0)) fcar.odo = fo;
      }
      if (cur === "mine" && st.type === "expense" && t.sp) {
        var spmv = parseFloat(t.sp.mine);
        rec.sp = {
          n: Math.max(2, parseInt(t.sp.n) || 2),
          mine: spmv >= 0 ? Math.min(amt, +spmv.toFixed(2)) : undefined,
          who: (t.sp.who || "").trim() || undefined,
          pays: t.sp.pays || [],
        };
      }
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
      imgMigrate();
      m.remove();
      render();
    }
  });
}


document.addEventListener("click", function (e) {
  var el = e.target.closest(
    "[data-tab],[data-go],[data-tx],[data-acc],[data-shop],[data-shopst],[data-shopdel],[data-shsug],[data-shsw],[data-m],[data-hm],[data-sprecv],[data-loan],[data-lpay],[data-copy],[data-car],[data-qgo],[data-pd],[data-pnav],[data-plog],[data-pics],[data-sm],[data-sn],[data-sd],[data-base],[data-addcat],[data-delcat],[data-bk],[data-act]",
  );
  if (e.target.id === "cam") {
    document.getElementById("shot").click();
    return;
  }
  if (e.target.id === "fab") {
    plusMenu();
    return;
  }
  if (e.target.id === "loannew") {
    loanSheet();
    return;
  }
  if (e.target.id === "subadd") {
    txSheet(null, { type: "expense", amt: "", acc: defAcc(), to: "", cat: "订阅会员", note: "", date: today(), fee: "" });
    return;
  }
  if (e.target.id === "pnow") {
    perAdd(today());
    return;
  }
  if (e.target.id === "pend") {
    var pc0 = perCalc(S.pl, S.pset).last;
    if (pc0) {
      mark();
      pc0.end = today();
      save();
      render();
      showUndo("已记录：经期结束");
    }
    return;
  }
  if (e.target.id === "pics") {
    perExport(S.pl, S.pset || {}, false);
    return;
  }
  if (e.target.id === "shadd") {
    var shi = document.getElementById("shi");
    if (shopAdd(shi.value, shopW)) render();
    return;
  }
  if (e.target.id === "shdone") {
    shopDoneSheet();
    return;
  }
  if (e.target.id === "shreset") {
    (S.shop || []).forEach(function (x) {
      x.done = undefined;
    });
    save();
    render();
    return;
  }
  if (e.target.id === "carnew") {
    carNew();
    return;
  }
  if (e.target.id === "tripgo") {
    S.trip = { name: document.getElementById("trn").value.trim() || "旅行 " + today(), cur: document.getElementById("trc").value };
    save();
    render();
    toast("旅行模式已开启");
    return;
  }
  if (e.target.id === "tripend") {
    S.trip = undefined;
    save();
    render();
    return;
  }
  if (e.target.id === "selbtn") {
    selMode = !selMode;
    sel = {};
    render();
    return;
  }
  if (e.target.id === "seldel") {
    var ids = Object.keys(sel);
    if (!ids.length) return toast("先点选要删除的记录");
    if (!confirm("删除选中的 " + ids.length + " 笔记录？删除后可以点「撤销」找回")) return;
    var gone = S.tx.filter(function (x) { return sel[x.id]; });
    mark();
    S.tx = S.tx.filter(function (x) { return !sel[x.id]; });
    if (cur === "joint") gone.forEach(function (x) { mirror(x, true); });
    selMode = false;
    sel = {};
    save();
    render();
    showUndo();
    return;
  }
  if (e.target.id === "selcat") {
    var ids2 = Object.keys(sel);
    if (!ids2.length) return toast("先点选要修改的记录");
    var mm = openSheet(
      '<b>批量改分类</b><div class="mute">只会改类型相同的记录（支出分类改支出，收入分类改收入）</div><select id="bc" style="margin-top:10px"><optgroup label="支出分类">' +
        S.cats.expense.map(function (c) { return '<option value="expense:' + esc(c) + '">' + esc(c) + "</option>"; }).join("") +
        '</optgroup><optgroup label="收入分类">' +
        S.cats.income.map(function (c) { return '<option value="income:' + esc(c) + '">' + esc(c) + "</option>"; }).join("") +
        '</optgroup></select><button class="btn" id="ok">应用到 ' + ids2.length + " 笔</button>",
    );
    mm.querySelector("#ok").onclick = function () {
      var v = mm.querySelector("#bc").value.split(":"), n = 0;
      mark();
      S.tx.forEach(function (x) {
        if (sel[x.id] && x.type === v[0]) {
          x.cat = v.slice(1).join(":");
          delete x.sub;
          n++;
        }
      });
      selMode = false;
      sel = {};
      save();
      mm.remove();
      render();
      showUndo("已修改 " + n + " 笔");
    };
    return;
  }
  if (e.target.id === "tcat") return;
  if (e.target.id === "fxb") {
    fxUpdate();
    return;
  }
  if (!el || el.closest(".mask")) return;
  if (
    RO &&
    !(
      el.dataset.tab ||
      el.dataset.go ||
      el.dataset.m ||
      el.dataset.hm ||
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
  } else if (el.dataset.loan) {
    loanSheet(el.dataset.loan);
  } else if (el.dataset.lpay) {
    loanPaySheet(el.dataset.lpay);
  } else if (el.dataset.copy) {
    var cu0 = el.dataset.copy;
    if (navigator.clipboard) navigator.clipboard.writeText(cu0).then(function () { toast("链接已复制"); }, function () { prompt("请手动复制：", cu0); });
    else prompt("请手动复制：", cu0);
  } else if (el.dataset.pd) {
    perDaySheet(el.dataset.pd);
  } else if (el.dataset.pnav) {
    perMon = new Date(perMon.getFullYear(), perMon.getMonth() + +el.dataset.pnav, 1);
    render();
  } else if (el.dataset.plog) {
    perLogSheet(el.dataset.plog);
  } else if (el.dataset.pics) {
    var pp = periodOf(el.dataset.pics);
    if (pp) perExport(pp.pl, pp.pset, true, names[el.dataset.pics]);
  } else if (el.dataset.shop) {
    var si = (S.shop || []).find(function (x) { return x.id === el.dataset.shop; });
    if (si) {
      si.done = si.done ? undefined : true;
      save();
      render();
    }
  } else if (el.dataset.shopst) {
    var sj = (S.shop || []).find(function (x) { return x.id === el.dataset.shopst; });
    if (sj) {
      sj.staple = sj.staple ? undefined : true;
      save();
      render();
    }
  } else if (el.dataset.shopdel) {
    mark();
    S.shop = (S.shop || []).filter(function (x) { return x.id !== el.dataset.shopdel; });
    save();
    render();
    showUndo("已删除");
  } else if (el.dataset.shsug) {
    shopAdd(el.dataset.shsug, shopW);
    render();
  } else if (el.dataset.shsw) {
    sw(el.dataset.shsw);
    if (cur !== el.dataset.shsw) toast("共同账本还没准备好");
    else {
      tab = "shop";
      render();
    }
  } else if (el.dataset.qgo) {
    if (cur !== "joint") sw("joint");
    var qt = S.tx.find(function (x) {
      return x.id === el.dataset.qgo;
    });
    if (qt) txSheet(JSON.parse(JSON.stringify(qt)));
  } else if (el.dataset.car) {
    carSheet(el.dataset.car);
  } else if (el.dataset.sprecv) {
    var st0 = S.tx.find(function (x) {
      return x.id === el.dataset.sprecv;
    });
    if (!st0) return;
    spPaySheet(st0, spOwed(st0) - spBack(st0), function (p) {
      mark();
      st0.sp.pays = (st0.sp.pays || []).concat([p]);
      save();
      render();
      showUndo("已记录收款 " + fmt(p.amt, (acc(st0.acc) || {}).cur));
    });
  } else if (el.dataset.hm) {
    statMode = el.dataset.hm;
    statDay = today();
    statWeek = new Date();
    mon = new Date();
    statYear = new Date().getFullYear();
    backTo = tab;
    tab = "stats";
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
    if (selMode && tab === "bills") {
      if (sel[el.dataset.tx]) delete sel[el.dataset.tx];
      else sel[el.dataset.tx] = 1;
      render();
      return;
    }
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
  if (e.target.id === "fc") {
    fF = e.target.value;
    render();
  }
  if (e.target.id === "tcat") {
    trendCat = e.target.value;
    render();
  }
  if (e.target.id === "shw") {
    shopW = e.target.checked;
    render();
  }
  if (e.target.id === "shday") {
    S.shopDay = e.target.value === "" ? undefined : +e.target.value;
    save();
  }
  if (e.target.id === "pon2") {
    S.pset = Object.assign({ cycle: 28, len: 5, days: 2, share: false }, S.pset || {}, { on: e.target.checked });
    save();
    render();
  }
  if (e.target.id === "pshare") {
    if (e.target.checked && !confirm("开启后，经期记录会加密上传到你们共用的同步空间，男朋友可以看到预测和提醒。确定吗？")) {
      e.target.checked = false;
      return;
    }
    S.pset.share = e.target.checked;
    save();
    render();
  }
  if (e.target.dataset.pmsg && S.pset) {
    S.pset.msg = Object.assign({}, S.pset.msg, { [e.target.dataset.pmsg]: e.target.value.trim() });
    save();
    return;
  }
  if (e.target.dataset.pset) {
    var pv = parseFloat(e.target.value);
    if (pv > 0 && S.pset) {
      S.pset[e.target.dataset.pset] = Math.round(pv);
      save();
      render();
    }
  }

  if (e.target.id === "fa") {
    fAcc = e.target.value;
    render();
  }
  if (e.target.dataset.tbud) {
    var tv = parseFloat(e.target.value);
    S.tbud = tv > 0 ? tv : undefined;
    save();
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
imgMigrate();
imgGC();
perToast();
// 购物清单：在输入框里按回车就加上，并留在输入框里继续输入下一样
document.addEventListener("keydown", function (e) {
  if (e.key !== "Enter" || !e.target || e.target.id !== "shi") return;
  e.preventDefault();
  if (shopAdd(e.target.value, shopW)) {
    render();
    var n = document.getElementById("shi");
    if (n) n.focus();
  }
});
(function () {
  var q = new URLSearchParams(location.search).get("q");
  if (!q) return;
  try {
    history.replaceState(null, "", location.pathname + location.hash);
  } catch (e) {}
  if (RO) return;
  setTimeout(function () {
    if (q === "quick") quickSheet();
    else if (q === "add") txSheet();
    else if (q === "shop") {
      tab = "shop";
      render();
    } else if (q === "chat") {
      var tries = 0,
        iv = setInterval(function () {
          if (chatOn()) {
            clearInterval(iv);
            tab = "chat";
            render();
          } else if (++tries > 20) clearInterval(iv);
        }, 500);
    }
  }, 300);
})();
try {
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist();
} catch (e) {}
lock();
initShare();
window.addEventListener("hashchange", hashGo);
hashGo();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(function () {});