const {JSDOM}=require("jsdom"),fs=require("fs"),fake=require("fake-indexeddb"),nodeCrypto=require("crypto");
let pass=0,fail=[];const ok=(c,m)=>{c?pass++:fail.push(m)};
const pad=n=>String(n).padStart(2,"0"),ds=x=>`${x.getFullYear()}-${pad(x.getMonth()+1)}-${pad(x.getDate())}`;
function boot(seed,store){
  const dom=new JSDOM(`<!DOCTYPE html><body><main id="app"></main><button id="fab"></button><button id="cam"></button><input id="shot"><nav><div id="nav"></div></nav></body>`,{runScripts:"outside-only",url:"https://x.test/",pretendToBeVisual:true});
  const w=dom.window;w.indexedDB=fake.indexedDB;w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;
  Object.defineProperty(w,"crypto",{value:nodeCrypto.webcrypto});
  w.HTMLCanvasElement.prototype.toDataURL=()=>"";w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:()=>()=>({addColorStop(){}}),set:()=>true});
  w.errs=[];w.addEventListener("error",e=>w.errs.push(e.message));
  if(store){w.fetch=async(u,o)=>{u=String(u);const key=u.split("?")[0],m=(o&&o.method)||"GET";
    if(m==="PUT"){store.d[key]=JSON.parse(o.body);return {ok:true,json:async()=>({})}}
    if(u.includes("shallow=true")){const base=key.replace(/\.json$/,"/");const ks={};Object.keys(store.d).forEach(k=>{if(k.startsWith(base)){ks[k.slice(base.length).split("/")[0].replace(/\.json$/,"")]=true}});return {ok:true,json:async()=>ks}}
    if(key.endsWith("/t.json")){const v=store.d[key.replace(/\/t\.json$/,".json")];return {ok:true,json:async()=>v?v.t:null}}
    return {ok:true,json:async()=>store.d[key]===undefined?null:store.d[key]}}}
  if(seed)Object.entries(seed).forEach(([k,v])=>w.localStorage.setItem(k,typeof v==="string"?v:JSON.stringify(v)));
  for(const f of ["merge.js","sync.js","app.js"])w.eval(fs.readFileSync(require("path").join(__dirname,"..","js",f),"utf8")+(f==="app.js"?"\n;window.__g=function(n){return eval(n)};window.__s=function(n,v){eval(n+'='+v)};":""));
  return w;
}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const click=(w,sel)=>{const e=w.document.querySelector(sel);if(!e)throw new Error("no "+sel);e.click()};
const setv=(w,sel,v)=>{const e=w.document.querySelector(sel);if(!e)throw new Error("no "+sel);e.value=v;e.dispatchEvent(new w.Event("input",{bubbles:true}));e.dispatchEvent(new w.Event("change",{bubbles:true}))};
const base={accounts:[{id:"a1",name:"现金",type:"cash",cur:"MYR",bal:100},{id:"a2",name:"现金 SGD",type:"cash",cur:"SGD",bal:50},{id:"a3",name:"Maybank",type:"bank",cur:"MYR",bal:0}],tx:[]};
(async()=>{
 const w=boot({"ledger.v1":base});
 const S=()=>w.__g("S");
 // 1 add expense through the UI
 w.eval("txSheet()");setv(w,"#amt","12.5");click(w,'[data-c="餐饮"]');click(w,"#ok");
 ok(S().tx.length===1&&S().tx[0].amt===12.5,"add expense");
 ok(w.eval("balance(S.accounts[0])")===87.5,"balance after expense");
 // 2 foreign expense with manual MYR
 w.eval("txSheet()");setv(w,"#acc","a2");await wait(10);setv(w,"#amt","10");setv(w,"#myr","33.5");click(w,"#ok");
 const ft=S().tx.find(t=>t.acc==="a2");ok(ft&&ft.myr===33.5,"manual MYR saved");
 ok(Math.abs(w.eval("cvt(S.tx[1].amt,S.tx[1])")-33.5)<1e-9,"cvt uses manual MYR");
 // 3 transfer cross currency, fee
 w.eval("txSheet()");click(w,'[data-t="transfer"]');setv(w,"#acc","a1");setv(w,"#to","a2");await wait(10);setv(w,"#amt","33");setv(w,"#fee","1");click(w,"#ok");
 const tr=S().tx.find(t=>t.type==="transfer");ok(tr&&Math.abs(tr.toAmt-10)<0.01,"transfer converts SGD ("+(tr&&tr.toAmt)+")");
 ok(Math.abs(w.eval("balance(S.accounts[0])")-(100-12.5-33-1))<1e-9,"balance after transfer+fee");
 // 4 same-account transfer rejected
 w.eval("txSheet()");click(w,'[data-t="transfer"]');setv(w,"#acc","a1");setv(w,"#to","a1");setv(w,"#amt","5");const n0=S().tx.length;click(w,"#ok");ok(S().tx.length===n0,"same-account transfer blocked");w.document.querySelector(".mask").remove();
 // 5 zero / negative amount rejected
 w.eval("txSheet()");setv(w,"#amt","0");click(w,"#ok");ok(S().tx.length===n0,"zero amount blocked");w.document.querySelector(".mask").remove();
 // 6 delete + undo
 const id=S().tx[0].id;w.eval("txSheet(JSON.parse(JSON.stringify(S.tx[0])))");click(w,"#del");click(w,"#del");
 ok(!S().tx.find(t=>t.id===id),"deleted");await wait(20);w.eval("undo()");ok(!!S().tx.find(t=>t.id===id),"undo restores");
 // 7 recurring multi-month catch-up
 const w2=boot({"ledger.v1":Object.assign({},base,{rec:[{id:"r1",name:"Rent",amt:900,acc:"a1",cat:"房租",day:5,last:"2026-08"}]})});
 const rc=w2.__g("S").tx.filter(t=>t.id.startsWith("rc_"));
 ok(rc.map(t=>t.date).join()==="2026-09-05,2026-10-05,2026-11-05","recurring catches up Sep-Nov ("+rc.map(t=>t.date)+")");
 // 8 backup export -> import is idempotent (no duplicates)
 const before=JSON.stringify(S().tx.length);const dump=JSON.stringify(S());
 w.eval("backup('in')");w.document.querySelector("#j").value=dump;click(w,"#go");ok(JSON.stringify(S().tx.length)===before,"import same backup = no duplicates ("+before+" vs "+S().tx.length+")");
 // 9 stats navigation across year boundary
 w.__s("statMode","'month'");w.__s("mon","new Date(2026,0,1)");w.eval("statNav(-1)");ok(w.__g("mon").getFullYear()===2025&&w.__g("mon").getMonth()===11,"month nav Jan->Dec prev year");
 w.__s("statMode","'week'");w.__s("statWeek","new Date(2026,0,1)");w.eval("statNav(-1)");ok(w.eval("statRange().a")==="2025-12-22","week nav across year ("+w.eval("statRange().a")+")");
 // 10 category used by tx deleted -> old tx still render
 w.eval("S.cats.expense=S.cats.expense.filter(function(c){return c!=='餐饮'})");w.eval("render()");ok(true,"render after category removed");
 // 11 account delete cascade
 w.eval("accSheet2('a3')");click(w,"#del");click(w,"#del");ok(!S().accounts.find(a=>a.id==="a3"),"account deleted");
 // 12 PIN lock
 w.eval("S.pin='1234';lock()");ok(!!w.document.getElementById("lk"),"lock shown");setv(w,"#lp","1234");await wait(80);ok(!w.document.getElementById("lk"),"unlock with PIN");
 // 13 all tabs render with data, no exceptions
 for(const t of ["home","bills","accts","stats","set"]){w.__s("tab","'"+t+"'");w.eval("render()")}
 ok(w.errs.length===0,"no uncaught errors: "+w.errs.join("|"));
 console.log("PASS",pass,"FAIL",fail.length);fail.forEach(f=>console.log(" ✗",f));process.exit(fail.length?1:0);
})().catch(e=>{console.log("CRASH",e.stack.split("\n").slice(0,5).join("\n"));console.log("PASS",pass,fail)});