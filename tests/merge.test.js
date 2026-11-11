// 运行：node tests/merge.test.js
var fs = require("fs"),
  vm = require("vm"),
  assert = require("assert");
global.localStorage = (function () {
  var m = {};
  return {
    getItem: (k) => (k in m ? m[k] : null),
    setItem: (k, v) => {
      m[k] = String(v);
    },
    removeItem: (k) => {
      delete m[k];
    },
  };
})();
vm.runInThisContext(fs.readFileSync(__dirname + "/../js/merge.js", "utf8"));
var n = 0;
function t(name, f) {
  f();
  n++;
  console.log("ok  " + name);
}
function mk(tx, extra) {
  return Object.assign(
    { accounts: [{ id: "a1", name: "现金", bal: 0 }], tx: tx || [], _t: 0 },
    extra || {},
  );
}
function rec(id, amt) {
  return { id: id, amt: amt, type: "expense" };
}
var T = 1000;
function save(scope, o) {
  o._t = ++T;
  LM.track(scope, o);
}

t("空账本（时间更新）不会覆盖云端记录——正是之前丢记录的场景", function () {
  var remote = mk([rec("1", 5), rec("2", 6), rec("3", 7)], { _t: 500 });
  var fresh = mk([]);
  fresh._t = 9999999; // 新设备上点了一下，本机时间“更新”
  var m = LM.merge(fresh, remote);
  assert.strictEqual(m.tx.length, 3);
});
t("云端是空的、本机有记录，合并后记录还在", function () {
  var m = LM.merge(mk([rec("1", 5)], { _t: 10 }), mk([], { _t: 99 }));
  assert.strictEqual(m.tx.length, 1);
});
t("两台设备各自新增，合并后两边都有", function () {
  var a = mk([rec("1", 1)]),
    b = mk([rec("1", 1), rec("2", 2)]);
  var m1 = LM.merge(a, b),
    m2 = LM.merge(b, a);
  assert.strictEqual(m1.tx.length, 2);
  assert.strictEqual(m2.tx.length, 2);
  assert.ok(LM.same(m1, m2));
});
t("删除会同步（墓碑），不会被另一台设备复活", function () {
  var A = mk([rec("1", 1), rec("2", 2)]);
  LM.rebase("A", A);
  var B = JSON.parse(JSON.stringify(A));
  A.tx = A.tx.filter((x) => x.id !== "1");
  save("A", A);
  assert.ok(A.del["tx:1"]);
  var m = LM.merge(B, A); // B 是旧的，拉到 A 的删除
  assert.deepStrictEqual(
    m.tx.map((x) => x.id),
    ["2"],
  );
  var back = LM.merge(A, B); // A 拉到旧的 B，不能把 1 带回来
  assert.deepStrictEqual(
    back.tx.map((x) => x.id),
    ["2"],
  );
});
t("删除后又撤销（重新出现），记录会保留", function () {
  var A = mk([rec("1", 1)]);
  LM.rebase("U", A);
  var saved = JSON.parse(JSON.stringify(A));
  A.tx = [];
  save("U", A);
  assert.ok(A.del["tx:1"]);
  A.tx = saved.tx;
  save("U", A); // 撤销
  assert.ok(!A.del["tx:1"]);
  assert.strictEqual(LM.merge(A, mk([rec("1", 1)])).tx.length, 1);
});
t("同一条记录两边都改，取较新的一次", function () {
  var base = mk([rec("1", 1)]);
  LM.rebase("X", base);
  LM.rebase("Y", JSON.parse(JSON.stringify(base)));
  var X = JSON.parse(JSON.stringify(base)),
    Y = JSON.parse(JSON.stringify(base));
  X.tx[0].amt = 10;
  save("X", X);
  var later = Date.now() + 5;
  var realNow = Date.now;
  Date.now = () => later;
  Y.tx[0].amt = 20;
  save("Y", Y);
  Date.now = realNow;
  assert.strictEqual(LM.merge(X, Y).tx[0].amt, 20);
  assert.strictEqual(LM.merge(Y, X).tx[0].amt, 20);
});
t("全新设备的默认账户不会覆盖云端同 id 的真实账户", function () {
  var remote = mk([], { _t: 500 });
  remote.accounts = [{ id: "a1", name: "我的钱包", bal: 888 }];
  var fresh = { accounts: [{ id: "a1", name: "现金", bal: 0 }], tx: [] }; // 没有 _t
  var m = LM.merge(fresh, remote);
  assert.strictEqual(m.accounts[0].bal, 888);
});
t("合并是稳定的：反复合并不会互相触发无限同步", function () {
  var a = mk([rec("1", 1), rec("3", 3)], { _t: 5 }),
    b = mk([rec("2", 2)], { _t: 6 });
  var m = LM.merge(a, b);
  assert.ok(LM.same(LM.merge(m, a), m));
  assert.ok(LM.same(LM.merge(m, b), m));
  assert.ok(LM.same(LM.merge(LM.merge(m, b), m), m));
});
t("私人记录（p）只在本机，也不会被云端合并掉", function () {
  var a = mk([rec("1", 1), { id: "p1", amt: 9, p: 1 }]);
  var m = LM.merge(a, mk([rec("1", 1)], { _t: 99 }));
  assert.ok(m.tx.some((x) => x.id === "p1"));
});
t("旧记录没有 id 时，两台设备补出的 id 相同（不会变成重复记录）", function () {
  var a = mk([]);
  a.goals = [{ name: "旅行", target: 100, saved: 0 }];
  var b = mk([]);
  b.goals = [{ name: "旅行", target: 100, saved: 0 }];
  assert.strictEqual(LM.merge(a, b).goals.length, 1);
});
t("本机截图（img）在云端版本胜出时仍会保留", function () {
  var a = mk([{ id: "1", amt: 1, img: "data:x", _u: 1 }]),
    b = mk([{ id: "1", amt: 2, _u: 5 }], { _t: 9 });
  var m = LM.merge(a, b);
  assert.strictEqual(m.tx[0].amt, 2);
  assert.strictEqual(m.tx[0].img, "data:x");
});
t("滚动备份最多 3 份，恢复时能全部找回", function () {
  var s1 = mk([rec("1", 1)]),
    s2 = mk([rec("1", 1), rec("2", 2)]),
    s3 = mk([rec("3", 3)]);
  LM.snapshot(s1, true);
  LM.snapshot(s2, true);
  LM.snapshot(s3, true);
  var bs = LM.backups();
  assert.strictEqual(bs.length, 3);
  var cur = mk([]);
  bs.forEach((b) => {
    b._t = 0;
    cur = LM.merge(cur, b);
  });
  assert.strictEqual(cur.tx.length, 3);
});
console.log("\n全部 " + n + " 项通过");
