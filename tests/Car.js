const H=require("./harness");const {boot,wait,click,setv}=H;let pass=0,fail=[];const ok=(c,m)=>{c?pass++:fail.push(m)};
const pad=n=>String(n).padStart(2,"0"),ds=x=>`${x.getFullYear()}-${pad(x.getMonth()+1)}-${pad(x.getDate())}`;
const base={accounts:[{id:"a1",name:"现金",type:"cash",cur:"MYR",bal:1000}],tx:[]};
const top=(w,sel)=>{const m=[...w.document.querySelectorAll(".mask")].pop();const e=m.querySelector(sel);if(!e)throw new Error("no top "+sel);return e};
const tset=(w,sel,v)=>{const e=top(w,sel);e.value=v;e.dispatchEvent(new w.Event("input",{bubbles:true}));e.dispatchEvent(new w.Event("change",{bubbles:true}))};
const tclick=(w,sel)=>top(w,sel).click();
const near=(a,b,e=0.005)=>Math.abs(a-b)<e;
(async()=>{
 const w=boot({"ledger.v1":base}),S=()=>w.__g("S"),html=()=>w.document.getElementById("app").innerHTML;
 // no car yet: fuel form offers to add one
 w.eval("txSheet()");click(w,'[data-c="油费"]');ok(!!w.document.querySelector("#fnew"),"fuel category without a car offers 'add car'");
 // add car from inside the tx sheet, keeping what was typed
 setv(w,"#amt","60");click(w,"#fnew");tset(w,"#cn","Myvi");tset(w,"#cp","WXY 1234");tset(w,"#co","10000");tclick(w,"#ok");
 ok(S().cars.length===1&&S().cars[0].items.length===4,"car created with 4 default service items");
 ok(!!w.document.querySelector("#fcar")&&w.document.querySelector("#amt").value==="60","back in tx sheet: car selector shown and amount kept");
 // fill-up 1 (first reading)
 setv(w,"#fodo","10000");setv(w,"#flit","30");click(w,"#ok");
 const f1=S().tx[0];ok(f1.car===S().cars[0].id&&f1.odo===10000&&f1.lit===30,"fill-up stores car / odometer / litres");
 // fill-up 2: live info while typing
 w.eval("txSheet()");click(w,'[data-c="油费"]');setv(w,"#amt","72");setv(w,"#fodo","10500");setv(w,"#flit","36");
 const live=w.document.querySelector("#fli").textContent;ok(/7\.20 L\/100km/.test(live)&&/距上次 500 km/.test(live)&&/油价 RM 2\.00\/L/.test(live)&&/每公里 RM 0\.14/.test(live),"live info while typing: "+live);
 click(w,"#ok");
 // fill-up 3
 w.eval("txSheet()");click(w,'[data-c="油费"]');setv(w,"#amt","84");setv(w,"#fodo","11100");setv(w,"#flit","42");click(w,"#ok");
 const car=S().cars[0];ok(car.odo===11100,"car odometer follows latest fill-up ("+car.odo+")");
 const st=JSON.parse(w.eval("JSON.stringify(carStats(S.cars[0]))"));
 ok(near(st.avg,7.0909,0.001)&&near(st.perKm,156/1100,0.0001)&&near(st.last.l100,7.0,0.001)&&st.n===3&&near(st.price,216/108,0.001),"stats: avg "+st.avg.toFixed(3)+" L/100km, "+st.perKm.toFixed(4)+"/km, last "+st.last.l100.toFixed(2));
 w.eval("tab='bills';render()");ok(/⛽ 42 L · 11100 km/.test(html()),"bill row shows litres and km");
 // settings card + car sheet
 w.eval("tab='set';render()");ok(/Myvi/.test(html())&&/7\.09 L\/100km/.test(html()),"settings card shows car and consumption");
 click(w,"[data-car]");const sheet=()=>[...w.document.querySelectorAll(".sheet")].pop().innerHTML;
 ok(/7\.09 L\/100km/.test(sheet())&&/换机油/.test(sheet())&&/还有 8900 km/.test(sheet()),"car sheet: consumption + oil change due in 8900 km");
 // odometer update triggers reminders
 tset(w,"#codo","19700");ok(S().cars[0].odo===19700,"odometer edited");
 ok(/⚠️ 还有 300 km/.test(sheet()),"oil change warning at 300 km left");
 w.document.querySelectorAll(".mask").forEach(x=>x.remove());
 w.eval("tab='home';render()");ok(/Myvi · 换机油/.test(html())&&/还有 300 km/.test(html()),"home reminder for oil change");
 // date based: road tax overdue
 w.eval("S.cars[0].items[1].lastDate='"+ds(new Date(Date.now()-400*864e5))+"'");w.eval("tab='home';render()");
 ok(/Myvi · 路税 Road Tax/.test(html())&&/已超过/.test(html())&&/🚨/.test(html()),"road tax overdue reminder");
 // mark done + expense
 w.eval("carSheet(S.cars[0].id)");tclick(w,'[data-cdone="0"]');tset(w,"#dc","180");tclick(w,"#ok");
 const it=S().cars[0].items[0];ok(it.lastKm===19700&&it.lastDate===ds(new Date()),"service done updates last km/date");
 const sv=S().tx.find(t=>t.note&&t.note.includes("换机油"));ok(sv&&sv.amt===180&&sv.cat==="汽车"&&sv.sub==="保养","service cost recorded as 汽车/保养 expense");
 ok(near(w.eval("balance(S.accounts[0])"),1000-60-72-84-180),"cash reduced by all four payments");
 w.document.querySelectorAll(".mask").forEach(x=>x.remove());
 w.eval("tab='home';render()");ok(!/Myvi · 换机油/.test(html()),"oil change reminder gone after service");
 // add / edit / delete item
 w.eval("carSheet(S.cars[0].id)");tclick(w,"#cadd");tset(w,"#in","电池");tset(w,"#im","24");tclick(w,"#ok");ok(S().cars[0].items.some(i=>i.name==="电池"&&i.months===24),"custom item added");
 tclick(w,'[data-cedit="4"]');tset(w,"#im","36");tclick(w,"#ok");ok(S().cars[0].items[4].months===36,"item edited");
 // delete car keeps history
 w.confirm=()=>true;w.eval("confirm=function(){return true}");tclick(w,"#crm");ok(S().cars.length===0&&S().tx.some(t=>t.car),"car deleted, fuel history kept");
 // CSV + merge
 let cap="";w.claude={use:async()=>({save:async r=>{cap=r.data}})};await w.eval("csv('2000-01-01','2100-01-01')");ok(/里程km/.test(cap)&&/11100/.test(cap),"csv has km / litres columns");
 const mg=JSON.parse(w.eval("JSON.stringify(LM.merge({accounts:[],tx:[],cars:[{id:'c1',name:'A'}],_t:1},{accounts:[],tx:[],cars:[{id:'c2',name:'B'}],_t:2}))"));ok(mg.cars.length===2,"cars from two devices merge");
 for(const tb of ["home","bills","accts","stats","set"]){w.eval("tab='"+tb+"';render()")}
 ok(w.errs.length===0,"no uncaught errors: "+w.errs.join("|"));
 console.log("PASS",pass,"FAIL",fail.length);fail.forEach(f=>console.log(" ✗",f));process.exit(fail.length?1:0);
})().catch(e=>{console.log("CRASH",e.stack.split("\n").slice(0,6).join("\n"));console.log(pass,fail);process.exit(1)});