const H=require("./harness");const {boot,wait,click,setv}=H;let pass=0,fail=[];const ok=(c,m)=>{c?pass++:fail.push(m)};
const pad=n=>String(n).padStart(2,"0");
(async()=>{
 // --- LM.merge rules ---
 const w=boot({"ledger.v1":{accounts:[{id:"a",name:"x",type:"cash",cur:"MYR",bal:0}],tx:[]}});
 const T=(id,amt,u,extra)=>Object.assign({id,type:"expense",amt,acc:"a",cat:"餐饮",date:"2026-11-01",note:"",_u:u},extra||{});
 const mg=(L,R)=>JSON.parse(w.eval("JSON.stringify(LM.merge("+JSON.stringify(L)+","+JSON.stringify(R)+"))"));
 const O=(tx,del,t)=>({accounts:[{id:"a",name:"x",type:"cash",cur:"MYR",bal:0}],tx,del:del||{},_t:t||1});
 let r=mg(O([T("1",5,100)]),O([T("1",9,200)]));ok(r.tx[0].amt===9,"newer edit wins");
 r=mg(O([T("1",5,300)]),O([T("1",9,200)]));ok(r.tx[0].amt===5,"older remote edit loses");
 r=mg(O([T("1",5,100)]),O([],{"tx:1":200}));ok(r.tx.length===0,"newer tombstone deletes");
 r=mg(O([T("1",5,300)]),O([],{"tx:1":200}));ok(r.tx.length===1,"edit after delete resurrects");
 r=mg(O([T("1",5,100)]),O([T("2",7,100)]));ok(r.tx.length===2,"union of different tx");
 // --- track(): delete detected, undo clears tombstone ---
 const w2=boot({"ledger.v1":{accounts:[{id:"a",name:"x",type:"cash",cur:"MYR",bal:0}],tx:[T("1",5,0),T("2",6,0)]}});
 w2.eval("S.tx=S.tx.filter(function(t){return t.id!=='1'});save()");
 ok(w2.eval("!!S.del['tx:1']"),"tombstone created on delete");
 // --- empty / huge data ---
 const w3=boot({"ledger.v1":{accounts:[{id:"a",name:"x",type:"cash",cur:"MYR",bal:0}],tx:[]}});
 for(const t of ["home","bills","accts","stats","set"]){w3.eval("tab='"+t+"';render()")}
 ["day","week","month","year"].forEach(m=>{w3.eval("statMode='"+m+"';tab='stats';render()")});ok(w3.errs.length===0,"empty ledger renders all views: "+w3.errs.join("|"));
 const tx=[];for(let i=0;i<20000;i++){const d=new Date(2026,0,1+(i%320));tx.push({id:"x"+i,ts:i,type:"expense",amt:1+(i%50),acc:"a",cat:["餐饮","交通","购物"][i%3],date:`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`,note:""})}
 const w4=boot({"ledger.v1":{accounts:[{id:"a",name:"x",type:"cash",cur:"MYR",bal:0}],tx}});
 const t0=Date.now();for(const t of ["home","bills","stats"]){w4.eval("tab='"+t+"';render()")}
 ["day","week","month","year"].forEach(m=>{w4.eval("statMode='"+m+"';tab='stats';render()")});
 const ms=Date.now()-t0;ok(ms<4000,"20k tx: 7 renders took "+ms+"ms");console.log("20k tx render ms:",ms);
 // --- odd data: missing date / unknown currency / NaN ---
 const w5=boot({"ledger.v1":{accounts:[{id:"a",name:"x",type:"cash",cur:"XXX",bal:0}],tx:[{id:"q",type:"expense",amt:5,acc:"a",cat:"餐饮",date:"2026-11-01"}]}});
 for(const t of ["home","bills","stats"]){w5.eval("tab='"+t+"';render()")}
 ok(!/NaN/.test(w5.document.getElementById("app").innerHTML),"unknown currency does not show NaN");ok(w5.errs.length===0,"odd data no errors: "+w5.errs.join("|"));
 // --- month with 31 days / Feb ---
 const w6=boot({"ledger.v1":{accounts:[{id:"a",name:"x",type:"cash",cur:"MYR",bal:0}],tx:[{id:"f",type:"expense",amt:8,acc:"a",cat:"餐饮",date:"2026-02-28"},{id:"g",type:"expense",amt:3,acc:"a",cat:"餐饮",date:"2026-03-31"}]}});
 w6.eval("statMode='month';mon=new Date(2026,1,1)");ok(w6.eval("statRange().b")==="2026-02-28"&&/RM 8\.00/.test(w6.eval("stats()")),"Feb range ends 28 and totals 8");
 w6.eval("mon=new Date(2026,2,1)");ok(/RM 3\.00/.test(w6.eval("stats()")),"Mar 31 included");
 console.log("PASS",pass,"FAIL",fail.length);fail.forEach(f=>console.log(" ✗",f));process.exit(0);
})().catch(e=>{console.log("CRASH",e.stack.split("\n").slice(0,6).join("\n"));console.log(pass,fail);process.exit(1)});