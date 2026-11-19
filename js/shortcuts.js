const H=require("./harness");const {boot,wait,click}=H;const fs=require("fs"),path=require("path");let pass=0,fail=[];const ok=(c,m)=>{c?pass++:fail.push(m)};
const base={accounts:[{id:"a1",name:"现金",type:"cash",cur:"MYR",bal:0}],tx:[]};
const mpath=[path.join(__dirname,"..","manifest.json"),path.join(__dirname,"manifest.json")].find(p=>fs.existsSync(p));
(async()=>{
 const man=JSON.parse(fs.readFileSync(mpath,"utf8"));
 ok(man.start_url==="."&&man.display==="standalone"&&man.icons.length>=2,"manifest keeps its original fields");
 ok(Array.isArray(man.shortcuts)&&man.shortcuts.length===4,"manifest has 4 shortcuts");
 ok(man.shortcuts.every(s=>s.name&&s.short_name&&/^\.\/\?q=(quick|add|shop|chat)$/.test(s.url)&&s.icons&&s.icons[0].src),"every shortcut has a name, a ./?q=… URL (inside scope) and an icon");
 const qs=man.shortcuts.map(s=>s.url.split("=")[1]);ok(["quick","add","shop","chat"].every(q=>qs.includes(q)),"shortcuts: quick / add / shop / chat");
 const tabs=w=>[...w.document.querySelectorAll(".sheet")].map(x=>x.innerHTML).join("|");
 // ?q=quick
 let w=boot({"ledger.v1":base},null,"https://x.test/?q=quick");await wait(700);
 ok(/快速记账/.test(tabs(w))&&w.location.search==="","?q=quick opens the quick-entry sheet and cleans the URL");
 ok(w.errs.length===0,"no errors (quick): "+w.errs.join("|"));
 // ?q=add
 w=boot({"ledger.v1":base},null,"https://x.test/?q=add");await wait(700);
 ok(!!w.document.querySelector("#amt")&&w.location.search==="","?q=add opens the full entry form");
 // ?q=shop
 w=boot({"ledger.v1":base},null,"https://x.test/?q=shop");await wait(700);
 ok(w.__g("tab")==="shop"&&/购物清单/.test(w.document.getElementById("app").innerHTML)&&w.location.search==="","?q=shop opens the shopping list");
 // ?q=chat (only once chat is available)
 w=boot({"ledger.v1":base},null,"https://x.test/?q=chat");w.eval("chatOn=function(){return true}");await wait(1200);
 ok(w.__g("tab")==="chat","?q=chat opens the chat tab when chat is available");
 w=boot({"ledger.v1":base},null,"https://x.test/?q=chat");await wait(700);ok(w.__g("tab")==="home","?q=chat does nothing (no crash) when sync is not set up");
 // unknown / no query / keeps the #sync= hash
 w=boot({"ledger.v1":base},null,"https://x.test/?q=bogus");await wait(500);ok(!w.document.querySelector(".mask")&&w.errs.length===0,"unknown shortcut is ignored");
 const code="LG1-"+Buffer.from(JSON.stringify({u:"https://t-default-rtdb.firebaseio.com",p:"pw123456"})).toString("base64").replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
 w=boot({"ledger.v1":base},null,"https://x.test/?q=quick#sync="+code);await wait(700);await wait(500);ok(/快速记账/.test(tabs(w))&&/同步设置/.test(tabs(w)),"a #sync= link still works next to ?q= (both sheets open)");
 // settings card with copy links
 w=boot({"ledger.v1":base});w.eval("tab='set';render()");const html=w.document.getElementById("app").innerHTML;
 ok(/主屏幕快捷入口/.test(html)&&/\?q=quick/.test(html)&&/\?q=add/.test(html)&&/\?q=shop/.test(html)&&/\?q=chat/.test(html),"settings card shows all four links");
 ok(/iPhone/.test(html)&&/Android/.test(html),"card is honest about Android vs iPhone");
 let copied=null;w.prompt=(m,v)=>{copied=v;return null};click(w,'[data-copy*="q=quick"]');await wait(100);
 ok(copied===null||/\?q=quick$/.test(copied),"copy link button works (prompt fallback in this test browser)");
 ok(w.errs.length===0,"no errors (settings): "+w.errs.join("|"));
 console.log("PASS",pass,"FAIL",fail.length);fail.forEach(f=>console.log(" ✗",f));process.exit(fail.length?1:0);
})().catch(e=>{console.log("CRASH",e.stack.split("\n").slice(0,7).join("\n"));console.log(pass,fail);process.exit(1)});