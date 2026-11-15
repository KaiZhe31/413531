const H=require("./harness");const {boot,wait,click,setv}=H;let pass=0,fail=[];const ok=(c,m)=>{c?pass++:fail.push(m)};
const pad=n=>String(n).padStart(2,"0"),ds=x=>`${x.getFullYear()}-${pad(x.getMonth()+1)}-${pad(x.getDate())}`,TODAY=ds(new Date());
const base={accounts:[{id:"a1",name:"Maybank",type:"bank",cur:"MYR",bal:1000},{id:"a2",name:"TNG",type:"wallet",cur:"MYR",bal:0},{id:"a3",name:"现金 SGD",type:"cash",cur:"SGD",bal:100}],tx:[]};
const near=(a,b)=>Math.abs(a-b)<0.005;
(async()=>{
 const w=boot({"ledger.v1":base}),S=()=>w.__g("S"),bal=id=>w.eval("balance(S.accounts.find(function(a){return a.id==='"+id+"'}))"),eIn=()=>w.eval("expIn('"+TODAY+"','"+TODAY+"')");
 // 1. dinner RM120 split by 3 people, I paid
 w.eval("txSheet()");setv(w,"#amt","120");click(w,'[data-c="餐饮"]');
 click(w,"#spon");ok(!!w.document.querySelector("#spn"),"AA section opens when ticked");
 setv(w,"#spn","3");setv(w,"#spw","Ali、Siti");
 ok(/朋友共欠 RM 80\.00/.test(w.document.querySelector("#spi").textContent),"live info: friends owe RM 80 ("+w.document.querySelector("#spi").textContent+")");
 click(w,"#ok");
 const t=S().tx[0];ok(t.sp&&t.sp.n===3&&t.sp.who==="Ali、Siti"&&t.sp.mine===undefined&&t.sp.pays.length===0,"tx saved with split info");
 ok(near(bal("a1"),880),"bank paid full 120 first -> 880");ok(near(eIn(),120),"before repayment my expense is still 120");
 w.eval("tab='home';render()");ok(/Ali、Siti 还欠你 RM 80\.00/.test(w.document.getElementById("app").innerHTML),"home reminds: Ali、Siti owe RM 80");
 // 2. partial repay RM30 into TNG via the home button
 click(w,"[data-sprecv]");setv(w,"#pa","30");setv(w,"#pc","a2");click(w,"#ok");
 ok(near(bal("a2"),30)&&near(bal("a1"),880),"RM30 credited to TNG, Maybank unchanged");
 ok(near(eIn(),90),"expense now 90 = 120 - 30 repaid ("+eIn()+")");
 w.eval("tab='home';render()");ok(/还欠你 RM 50\.00/.test(w.document.getElementById("app").innerHTML),"still owes RM 50");
 // row shows net amount and status
 w.eval("tab='bills';render()");const row=w.document.querySelector("#app [data-tx]").innerHTML;
 ok(/RM 90\.00/.test(row)&&/已收 RM 30\.00/.test(row)&&/待收 RM 50\.00/.test(row)&&/垫付 RM 120\.00/.test(row),"bill row: net 90, paid 120, received 30, pending 50");
 // 3. rest repaid into Maybank (same account)
 w.eval("tab='home';render()");click(w,"[data-sprecv]");ok(w.document.querySelector("#pa").value==="50.00","repay form pre-fills remaining 50");click(w,"#ok");
 ok(near(eIn(),40)&&near(bal("a1"),930),"fully repaid: my expense = my share 40, Maybank 930");
 w.eval("tab='home';render()");ok(!/还欠你/.test(w.document.getElementById("app").innerHTML),"no more reminder once settled");
 w.eval("tab='bills';render()");ok(/✓/.test(w.document.querySelector("#app [data-tx]").innerHTML),"row shows settled tick");
 // 4. stats/budget use the net amount
 w.eval("statMode='day';statDay=today();tab='stats';render()");ok(/RM 40\.00/.test(w.document.getElementById("app").innerHTML.match(/总开销.*?<\/div>/)[0]),"stats day total is 40");
 w.eval("S.tbud=100;tab='home';render()");ok(/已用 40%/.test(w.document.getElementById("app").innerHTML),"total budget uses net 40%");
 // 5. edit: remove one repayment inside the sheet, can't untick while repayments exist
 w.eval("txSheet(JSON.parse(JSON.stringify(S.tx[0])))");ok(w.document.querySelector("#spon").disabled,"cannot untick AA while repayments exist");
 click(w,'[data-sprm="0"]');click(w,'[data-sprm="0"]');click(w,"#ok");ok(near(eIn(),120)&&near(bal("a1"),880)&&near(bal("a2"),0),"removing repayments restores 120 / balances");
 // 6. my share typed manually
 w.eval("txSheet()");setv(w,"#amt","50");click(w,"#spon");setv(w,"#spm","10");click(w,"#ok");
 const t2=S().tx.find(x=>x.amt===50);ok(near(w.eval("spOwed(S.tx.find(function(x){return x.amt===50}))"),40),"custom share 10 -> friends owe 40");
 // 7. foreign currency: paid in SGD, repaid into MYR account (converted)
 w.eval("txSheet()");setv(w,"#acc","a3");await wait(10);setv(w,"#amt","30");click(w,"#spon");setv(w,"#spn","2");click(w,"#ok");
 const t3=S().tx.find(x=>x.acc==="a3");ok(t3&&t3.sp,"SGD split saved");
 w.eval("tab='home';render()");const btn=[...w.document.querySelectorAll("[data-sprecv]")].find(b=>b.dataset.sprecv===t3.id);btn.click();setv(w,"#pa","15");setv(w,"#pc","a3");click(w,"#ok");
 ok(near(bal("a3"),100-30+15),"SGD repayment credited in SGD ("+bal("a3")+")");
 w.eval("txSheet()");w.document.querySelectorAll(".mask").forEach(x=>x.remove());
 // 8. undo of repayment
 w.eval("undo()");ok(near(bal("a3"),70),"undo takes the repayment back");
 // 9. split not offered in joint ledger / for income
 w.eval("txSheet()");click(w,'[data-t="income"]');ok(!w.document.querySelector("#spon"),"no AA option for income");w.document.querySelectorAll(".mask").forEach(x=>x.remove());
 // 10. csv has repaid column, all tabs render
 let cap="";w.claude={use:async()=>({save:async r=>{cap=r.data}})};await w.eval("csv('2000-01-01','2100-01-01')");ok(/AA已收回/.test(cap),"csv has AA repaid column");
 for(const tb of ["home","bills","accts","stats","set"]){w.eval("tab='"+tb+"';render()")}
 ok(w.errs.length===0,"no uncaught errors: "+w.errs.join("|"));
 console.log("PASS",pass,"FAIL",fail.length);fail.forEach(f=>console.log(" ✗",f));process.exit(fail.length?1:0);
})().catch(e=>{console.log("CRASH",e.stack.split("\n").slice(0,6).join("\n"));console.log(pass,fail);process.exit(1)});