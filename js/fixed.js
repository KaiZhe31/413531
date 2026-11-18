const H=require("./harness");const {boot,wait,click,setv}=H;let pass=0,fail=[];const ok=(c,m)=>{c?pass++:fail.push(m)};
const pad=n=>String(n).padStart(2,"0"),ds=x=>`${x.getFullYear()}-${pad(x.getMonth()+1)}-${pad(x.getDate())}`;
const T=ds(new Date()),add=n=>{const d=new Date();d.setDate(d.getDate()+n);return ds(d)};
const near=(a,b,e=0.005)=>Math.abs(a-b)<e;
const base={accounts:[{id:"a1",name:"现金",type:"cash",cur:"MYR",bal:1000},{id:"a2",name:"Maybank",type:"bank",cur:"MYR",bal:0},{id:"a3",name:"现金 SGD",type:"cash",cur:"SGD",bal:100}],tx:[]};
const top=(w,sel)=>{const m=[...w.document.querySelectorAll(".mask")].pop();const e=m.querySelector(sel);if(!e)throw new Error("no top "+sel);return e};
const tset=(w,sel,v)=>{const e=top(w,sel);e.value=v;e.dispatchEvent(new w.Event("input",{bubbles:true}));e.dispatchEvent(new w.Event("change",{bubbles:true}))};
const tclick=(w,sel)=>top(w,sel).click();
const app=w=>w.document.getElementById("app").innerHTML;
(async()=>{
 const w=boot({"ledger.v1":base}),S=()=>w.__g("S"),bal=id=>w.eval("balance(S.accounts.find(function(a){return a.id==='"+id+"'}))");
 // ================= 借还款 =================
 w.eval("tab='set';render()");ok(/借还款/.test(app(w)),"settings has the 借还款 card");
 click(w,'[data-go="loans"]');ok(w.__g("tab")==="loans"&&/还没有|没有未结清/.test(app(w)),"loans page opens (empty)");
 click(w,"#loannew");tset(w,"#lw","Ali");tset(w,"#la","200");tset(w,"#lc","a1");tset(w,"#lu",add(2));tset(w,"#ln","吃饭");tclick(w,"#ok");
 ok(S().loans.length===1&&S().loans[0].dir==="lend"&&S().loans[0].who==="Ali","lend saved");
 ok(near(bal("a1"),800),"lending RM200 reduces cash to 800");ok(S().tx.length===0&&near(w.eval("expIn('2000-01-01','2100-01-01')"),0),"lending is NOT an expense (no tx, stats unchanged)");
 ok(/还欠你 RM 200\.00/.test(app(w))&&/别人欠我/.test(app(w)),"page shows Ali owes RM 200");
 w.eval("tab='home';render()");ok(/Ali 该还你钱了/.test(app(w))&&/2 天后到期/.test(app(w))&&/收款/.test(app(w)),"home reminder 2 days before due with a 收款 button");
 click(w,"[data-lpay]");ok(top(w,"#pa").value==="200.00","repay form pre-filled with what is left");tset(w,"#pa","80");tset(w,"#pc","a2");tclick(w,"#ok");
 ok(near(bal("a2"),80)&&near(bal("a1"),800),"RM80 received into Maybank");
 w.eval("tab='loans';render()");ok(/还欠你 RM 120\.00/.test(app(w))&&/已收 RM 80\.00/.test(app(w)),"left 120, received 80");
 click(w,"[data-lpay]");tset(w,"#pa","999");tclick(w,"#ok");ok(S().loans[0].pays.length===1&&/金额超过/.test(w.document.body.innerHTML)&&near(bal("a1"),800),"repaying more than what is left is blocked (balances untouched)");
 w.document.querySelectorAll(".mask").forEach(x=>x.remove());
 S().loans[0].pays=[{amt:80,acc:"a2",date:T}];
 click(w,"[data-lpay]");tset(w,"#pa","120");tset(w,"#pc","a1");tclick(w,"#ok");
 ok(near(bal("a1"),920)&&near(w.eval("loanLeft(S.loans[0])"),0),"fully repaid into cash: 920, nothing left");
 w.eval("tab='loans';render()");ok(/已结清/.test(app(w))&&/没有未结清/.test(app(w)),"settled loan moves to 最近结清");
 w.eval("tab='home';render()");ok(!/Ali 该还你钱了/.test(app(w)),"no more reminder");
 // borrowed
 w.eval("tab='loans';render()");click(w,"#loannew");tset(w,"#ld","borrow");tset(w,"#lw","Siti");tset(w,"#la","500");tset(w,"#lc","a1");tclick(w,"#ok");
 ok(near(bal("a1"),1420),"borrowing RM500 adds to cash");
 w.eval("tab='loans';render()");click(w,"[data-lpay]");tset(w,"#pa","100");tclick(w,"#ok");ok(near(bal("a1"),1320),"repaying Siti RM100 reduces cash");
 ok(/我欠别人/.test(app(w))&&/RM 400\.00/.test(app(w)),"I owe 400");
 // overdue reminder
 S().loans.find(l=>l.who==="Siti").due=add(-3);w.eval("tab='home';render()");ok(/Siti：该还钱了/.test(app(w))&&/已逾期 3 天/.test(app(w))&&/🚨/.test(app(w)),"overdue reminder for a loan I must repay");
 // edit + delete + undo
 w.eval("tab='loans';render()");click(w,"[data-loan]");tset(w,"#la","600");tclick(w,"#ok");ok(S().loans.find(l=>l.who==="Siti").amt===600||S().loans.some(l=>l.amt===600),"loan edited");
 const n0=S().loans.length;w.confirm=()=>true;w.eval("confirm=function(){return true}");click(w,"[data-loan]");tclick(w,"#del");ok(S().loans.length===n0-1,"loan deleted");w.eval("undo()");ok(S().loans.length===n0,"undo brings it back");
 // foreign currency + no-account loans
 S().loans=[];w.eval("tab='loans';render()");click(w,"#loannew");tset(w,"#lw","Tan");tset(w,"#la","50");tset(w,"#lc","a3");tclick(w,"#ok");
 ok(near(bal("a3"),50),"SGD loan: SGD cash 100 -> 50");
 click(w,"[data-lpay]");tset(w,"#pa","20");tset(w,"#pc","a1");const a1=bal("a1");tclick(w,"#ok");
 ok(near(bal("a1")-a1,20*3.3,0.01),"20 SGD repaid into a MYR account is converted (+66)");
 S().loans=[];w.eval("tab='loans';render()");click(w,"#loannew");tset(w,"#lw","Lee");tset(w,"#la","30");tset(w,"#lc","");tclick(w,"#ok");const b1=bal("a1"),b2=bal("a2");
 click(w,"[data-lpay]");tset(w,"#pa","30");tset(w,"#pc","");tclick(w,"#ok");ok(near(bal("a1"),b1)&&near(bal("a2"),b2)&&near(w.eval("loanLeft(S.loans[0])"),0),"'不影响账户' loans never touch balances");
 // validation
 click(w,"#loannew");tset(w,"#la","10");tclick(w,"#ok");ok(S().loans.length===1&&/请填对方名字/.test(w.document.body.innerHTML),"name required");w.document.querySelectorAll(".mask").forEach(x=>x.remove());
 const mg=JSON.parse(w.eval("JSON.stringify(LM.merge({accounts:[],tx:[],loans:[{id:'l1',who:'A',amt:1}],_t:1},{accounts:[],tx:[],loans:[{id:'l2',who:'B',amt:2}],_t:2}))"));ok(mg.loans.length===2,"loans from two devices merge");
 // ================= 订阅总览 =================
 const w2=boot({"ledger.v1":Object.assign({},base,{tx:[
  {id:"n1",ts:1,type:"expense",amt:55,acc:"a1",cat:"订阅会员",sub:"Netflix",date:add(-61),note:""},
  {id:"n2",ts:2,type:"expense",amt:55,acc:"a1",cat:"订阅会员",sub:"Netflix",date:add(-30),note:""},
  {id:"n3",ts:3,type:"expense",amt:55,acc:"a1",cat:"订阅会员",sub:"Netflix",date:add(-1),note:""},
  {id:"i1",ts:4,type:"expense",amt:120,acc:"a1",cat:"订阅会员",sub:"iCloud",date:add(-400),note:""},
  {id:"i2",ts:5,type:"expense",amt:120,acc:"a1",cat:"订阅会员",sub:"iCloud",date:add(-35),note:""},
  {id:"s1",ts:6,type:"expense",amt:20,acc:"a1",cat:"订阅会员",sub:"Spotify",date:add(-3),note:""},
  {id:"o1",ts:7,type:"expense",amt:30,acc:"a1",cat:"订阅会员",sub:"OldApp",date:add(-300),note:""},
  {id:"d1",ts:8,type:"expense",amt:15,acc:"a1",cat:"订阅会员",note:"Disney+（定期）",date:add(-28),acc2:1},
  {id:"d2",ts:9,type:"expense",amt:15,acc:"a1",cat:"订阅会员",note:"Disney+（定期）",date:add(2),acc2:1},
  {id:"x1",ts:10,type:"expense",amt:99,acc:"a1",cat:"购物",sub:"Shopee",date:add(-5),note:""}]})});
 const subs=JSON.parse(w2.eval("JSON.stringify(subsCalc())")),by=n=>subs.find(x=>x.name===n);
 ok(by("Netflix")&&by("Netflix").cad==="每月"&&near(by("Netflix").month,55)&&by("Netflix").active,"Netflix: monthly RM55");
 ok(by("Netflix").days>=28&&by("Netflix").days<=31,"Netflix next renewal about a month after the last charge ("+by("Netflix").days+" days)");
 ok(by("iCloud")&&by("iCloud").cad==="每年"&&near(by("iCloud").month,10)&&by("iCloud").active,"iCloud: yearly RM120 = RM10 a month ("+by("iCloud").cad+", "+by("iCloud").month.toFixed(2)+")");
 ok(by("Spotify")&&by("Spotify").guess&&near(by("Spotify").month,20),"one charge only: estimated monthly, flagged as a guess");
 ok(by("OldApp")&&!by("OldApp").active,"nothing charged for 10 months -> 可能已取消");
 ok(!by("Shopee")&&!subs.some(x=>x.name==="Shopee"),"only the 订阅会员 category counts");
 ok(by("Disney+")&&by("Disney+").n===2,"recurring bills ('（定期）') are grouped under the subscription's name");
 w2.eval("tab='set';render()");ok(/订阅总览/.test(app(w2))&&/每月约/.test(app(w2)),"settings card summarises monthly cost");
 click(w2,'[data-go="subs"]');ok(w2.__g("tab")==="subs"&&/正在订阅/.test(app(w2))&&/可能已取消/.test(app(w2))&&/Netflix/.test(app(w2)),"subscriptions page lists active and probably-cancelled");
 const tot=subs.filter(x=>x.active).reduce((t,x)=>t+x.month,0);ok(app(w2).includes(w2.eval("fmt("+tot+")")),"page total = sum of active monthly costs ("+tot.toFixed(2)+")");
 // reminder when renewal is within 3 days
 const w3=boot({"ledger.v1":Object.assign({},base,{tx:[{id:"m1",ts:1,type:"expense",amt:55,acc:"a1",cat:"订阅会员",sub:"Netflix",date:add(-29),note:""},{id:"m0",ts:0,type:"expense",amt:55,acc:"a1",cat:"订阅会员",sub:"Netflix",date:add(-59),note:""}]})});
 w3.eval("tab='home';render()");ok(/Netflix 预计 \d 天后续费|Netflix 预计今天续费/.test(app(w3)),"home reminds about an upcoming renewal");
 click(w3,"[data-go=\"subs\"]");click(w3,"#subadd");ok(!!w3.document.querySelector("#amt")&&w3.document.querySelector('[data-c="订阅会员"]').className.includes("on"),"'＋ 记一笔订阅' opens the form on the 订阅会员 category");
 w3.document.querySelectorAll(".mask").forEach(x=>x.remove());
 for(const x of [w,w2,w3]){for(const t of ["home","bills","accts","stats","set","loans","subs"]){x.eval("tab='"+t+"';render()")}}
 [w,w2,w3].forEach((x,i)=>ok(x.errs.length===0,"no uncaught errors #"+i+": "+x.errs.join("|")));
 console.log("PASS",pass,"FAIL",fail.length);fail.forEach(f=>console.log(" ✗",f));process.exit(fail.length?1:0);
})().catch(e=>{console.log("CRASH",e.stack.split("\n").slice(0,7).join("\n"));console.log(pass,fail);process.exit(1)});