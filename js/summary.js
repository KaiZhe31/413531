(function () {
  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function periodExpenseTotal(period, date) {
    var d = date || new Date();
    var list = (S.tx || []).filter(function (t) {
      if (!t.date) return false;
      var isExpense = t.type === "expense" || (t.type === "transfer" && !!t.fee);
      if (!isExpense) return false;
      if (period === "day") {
        return t.date === d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
      }
      if (period === "week") {
        var info = getWeekInfo(d);
        return info.days.indexOf(t.date) >= 0;
      }
      if (period === "month") {
        return t.date.slice(0, 7) === d.getFullYear() + "-" + pad(d.getMonth() + 1);
      }
      if (period === "year") {
        return t.date.slice(0, 4) === String(d.getFullYear());
      }
      return false;
    });
    return sums(list).e;
  }

  function periodSummaryCard(label, value, extra) {
    return (
      '<div class="card" style="padding:12px 14px">' +
      '<div class="mute">' + label + "</div>" +
      '<div class="num exp" style="font-size:22px;margin-top:4px">' +
      fmt(value) +
      "</div>" +
      (extra ? '<div class="mute" style="margin-top:4px">' + extra + "</div>" : "") +
      "</div>"
    );
  }

  function statsDay() {
    var list = (S.tx || []).filter(function (t) {
      return t.date === today() && (t.type === "expense" || (t.type === "transfer" && !!t.fee));
    });
    var s = sums(list);
    var h =
      '<div class="mnav"><b>今日支出</b></div>' +
      periodSummaryCard(
        "今日总开销",
        s.e,
        "收入 " + fmt(s.i) + " · 结余 " + fmt(s.i - s.e)
      ) +
      '<div class="card">' +
      '<div class="row" style="margin-bottom:6px"><b class="sp">📅 今日明细</b></div>' +
      (list.length
        ? list
            .map(function (t) {
              return txRow(t);
            })
            .join("")
        : '<div class="empty">今天还没有记录</div>') +
      "</div>";
    return h;
  }

  function statsYear() {
    var year = new Date().getFullYear();
    var arr = [];
    for (var m = 1; m <= 12; m++) {
      var d = new Date(year, m - 1, 1);
      var list = (S.tx || []).filter(function (t) {
        return (
          t.date &&
          t.date.slice(0, 7) === d.getFullYear() + "-" + pad(d.getMonth() + 1) &&
          (t.type === "expense" || (t.type === "transfer" && !!t.fee))
        );
      });
      arr.push({ month: m, sum: sums(list).e });
    }
    var tot = arr.reduce(function (sum, item) {
      return sum + item.sum;
    }, 0);
    var mx = Math.max(1, ...arr.map(function (item) {
      return item.sum || 0;
    }));
    var h =
      '<div class="mnav"><b>' + year + " 年总开销</b></div>" +
      periodSummaryCard("本年总开销", tot) +
      '<div class="card"><b>📆 每月开销</b><div class="mo">';
    arr.forEach(function (x) {
      h +=
        '<div><div style="display:flex;align-items:flex-end;gap:2px;flex:1;width:100%;justify-content:center"><span style="height:' +
        ((x.sum / mx) * 100 || 0) +
        '%;background:var(--exp)"></span></div>' +
        x.month +
        "月</div>";
    });
    h += '</div></div>';
    h += '<div class="card"><b>📋 各月明细</b>';
    arr.forEach(function (x) {
      if (x.sum > 0) {
        h += '<div class="row item"><span class="sp">' + x.month + '月</span><span class="num exp">' + fmt(x.sum) + '</span></div>';
      }
    });
    if (!arr.some(function (x) {
      return x.sum > 0;
    })) {
      h += '<div class="empty">今年还没有支出</div>';
    }
    h += '</div>';
    return h;
  }

  function home() {
    var base = window.__legacyHome.call(this);
    var todayExp = periodExpenseTotal("day", new Date());
    var weekExp = periodExpenseTotal("week", new Date());
    var monthExp = periodExpenseTotal("month", new Date());
    var yearExp = periodExpenseTotal("year", new Date());
    var summaryCards =
      '<div class="card row">' +
      '<div class="sp"><div class="mute">今日总开销</div><div class="num exp">' + fmt(todayExp) + '</div></div>' +
      '<div class="sp"><div class="mute">本周总开销</div><div class="num exp">' + fmt(weekExp) + '</div></div>' +
      '</div>' +
      '<div class="card row">' +
      '<div class="sp"><div class="mute">本月总开销</div><div class="num exp">' + fmt(monthExp) + '</div></div>' +
      '<div class="sp"><div class="mute">今年总开销</div><div class="num exp">' + fmt(yearExp) + '</div></div>' +
      '</div>';
    var marker = '<div class="card row"><div class="sp"><div class="mute">本月收入</div>';
    if (base.indexOf(marker) >= 0) return base.replace(marker, summaryCards + marker);
    return summaryCards + base;
  }

  function stats() {
    var switcherHtml =
      '<div class="seg" style="margin-bottom:12px">' +
      '<button class="' + (statMode === "day" ? "on" : "") + '" data-stat="day">按日统计</button>' +
      '<button class="' + (statMode === "week" ? "on" : "") + '" data-stat="week">按周统计</button>' +
      '<button class="' + (statMode === "month" ? "on" : "") + '" data-stat="month">按月统计</button>' +
      '<button class="' + (statMode === "year" ? "on" : "") + '" data-stat="year">按年统计</button>' +
      "</div>";
    if (statMode === "day") return switcherHtml + statsDay();
    if (statMode === "year") return switcherHtml + statsYear();
    return switcherHtml + (statMode === "week" ? statsWeek() : statsMonth());
  }

  window.__legacyHome = window.home;
  window.__legacyStats = window.stats;
  window.home = home;
  window.stats = stats;
  render();
})();
