const H = require("./harness");
const { boot, wait, click, setv } = H;
let pass = 0, fail = [];
const ok = (c, m) => { c ? pass++ : fail.push(m) };

const cfg = n => ({
  "ledger.fb": { url: "https://t-default-rtdb.firebaseio.com", pass: "correct horse battery", name: n },
  "ledger.v1": { accounts: [{ id: "a1", name: "现金", type: "cash", cur: "MYR", bal: 0 }], tx: [] }
});

const until = async (fn, ms = 20000) => {
  const t = Date.now();
  while (Date.now() - t < ms) {
    try {
      if (fn()) return true;
    } catch (e) {}
    await wait(250);
  }
  return false;
};

(async () => {
  const store = { d: {} };
  const A = boot(cfg("Alice"), store), B = boot(cfg("Bob"), store);

  [A, B].forEach(w => {
    const o = w.fetch;
    w.fetch = (u, x) => store.fail ? Promise.reject(new Error("offline")) : o(u, x);
  });

  ok(await until(() => A.__g("shState") === "ok" && B.__g("shState") === "ok", 15000), "both devices connected");
  ok(A.eval("chatOn()") && B.eval("chatOn()"), "chat tab enabled once synced");

  const app = w => w.document.getElementById("app").innerHTML,
        nav = w => w.document.getElementById("nav").innerHTML;

  ok(/聊天/.test(nav(A)), "💬 聊天 tab visible in nav");

  // A opens chat and sends
  A.eval("tab='chat';render()");
  ok(/还没有消息/.test(app(A)) && !!A.document.querySelector("#cin"), "empty chat page with input");

  setv(A, "#cin", "你好呀 ❤️");
  click(A, "#csend");
  ok(/你好呀/.test(app(A)) && /发送中/.test(app(A)), "my message shows immediately as 'sending'");
  ok(await until(() => !/发送中/.test(app(A)), 8000), "message delivered (sending label disappears)");

  // B receives: badge + toast while on another tab
  ok(await until(() => B.eval("chatUnread()") === 1, 15000), "Bob receives it and unread count = 1");
  ok(/class="dot"/.test(nav(B)) || /dot/.test(nav(B)), "unread red dot on Bob's chat tab");
  ok(/\(1\)/.test(B.document.title), "page title shows (1)");

  // B opens chat: sees message, marks read
  B.eval("tab='chat';render()");
  ok(/你好呀/.test(app(B)), "Bob sees Alice's message");
  ok(B.eval("chatUnread()") === 0, "unread cleared when chat opened");
  ok(await until(() => /已读/.test(app(A)), 15000), "Alice sees '已读' read receipt");

  // B replies, A receives
  setv(B, "#cin", "在呀，晚上吃什么？");
  click(B, "#csend");
  ok(await until(() => /晚上吃什么/.test(app(A)), 15000), "Alice receives the reply while chat is open");
  ok(A.eval("chatUnread()") === 0, "no unread while Alice is looking at the chat");

  // emoji quick button sends immediately
  click(A, ".emo button");
  ok(/😘/.test(app(A)), "emoji button sends a message");

  // ordering with several quick messages
  ["一", "二", "三"].forEach(x => {
    setv(A, "#cin", "排序" + x);
    click(A, "#csend");
  });
  ok(await until(() => /排序三/.test(app(B)) && B.eval("chatList().length") >= 6, 15000), "Bob gets all quick messages");

  const order = B.eval("chatList().map(function(m){return m.x}).filter(function(x){return x.indexOf('排序')===0}).join(',')");
  ok(order === "排序一,排序二,排序三", "messages keep their order (" + order + ")");

  // recall
  A.confirm = () => true;
  A.eval("confirm=function(){return true}");
  const mine = A.eval("chatList().filter(function(m){return m.x==='排序三'})[0].id");
  A.document.querySelector('[data-cm="' + mine + '"]').click();
  ok(/消息已撤回/.test(app(A)), "recall shows placeholder for me");
  ok(await until(() => /消息已撤回/.test(app(B)), 15000), "recall propagates to Bob");

  // offline: message waits, then retries
  store.fail = true;
  setv(A, "#cin", "断网时发的");
  click(A, "#csend");
  await wait(1500);
  ok(/发送中/.test(app(A)), "offline message stays 'sending'");
  
  store.fail = false;
  ok(await until(() => /断网时发的/.test(app(B)), 25000), "after reconnect it is delivered automatically");

  // privacy + no dup subscriptions
  const enc = JSON.stringify(store.d);
  ok(!enc.includes("你好呀") && !enc.includes("晚上吃什么") && !enc.includes("Alice"), "server holds only ciphertext (messages and names)");

  [A, B].forEach((w, i) => ok(w.errs.length === 0, "no uncaught errors " + "AB"[i] + ": " + w.errs.join("|")));

  console.log("PASS", pass, "FAIL", fail.length);
  fail.forEach(f => console.log(" ✗", f));
  process.exit(fail.length ? 1 : 0);
})().catch(e => {
  console.log("CRASH", e.stack.split("\n").slice(0, 6).join("\n"));
  console.log(pass, fail);
  process.exit(1);
});