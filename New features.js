const H=require("./harness");const {boot,wait,click,setv}=H;let pass=0,fail=[];const ok=(c,m)=>{c?pass++:fail.push(m)};
const pad=n=>String(n).padStart(2,"0"),ds=x=>`${x.getFullYear()}-${pad(x.getMonth()+1)}-${pad(x.getDate())}`;
const base={accounts:[{id:"a1",name:"现金",type:"cash",cur:"MYR",bal:100},{id:"a2",name:"现金 SGD",type:"cash",cur:"SGD",bal:50}],tx:[]};
(async()=>{
 const w=boot({"ledger.v1":base}),S=()=>w.__g("S");
 // seeds + + menu
 ok(S().fav.length===3,"3 seed quick templates ("+S().fav.length+")");
 click(w,"#fab");ok(!!w.document.querySelector("#pq")&&!!w.document.querySelector("#pf"),"+ shows quick / full options");
 click(w,"#pq");ok(/快速记账/.test(w.document.querySelector(".sheet").innerHTML)&&/U Mobile 充值/.test(w.document.querySelector(".sheet").innerHTML),"quick sheet lists templates");
 // tap U Mobile template -> instant tx
 click(w,'[data-qi="0"]');
 ok(S().tx.length===1&&S().tx[0].cat==="话费充值"&&S().tx[0].sub==="U Mobile"&&S().tx[0].amt===30&&S().tx[0].date===ds(new Date()),"one tap records U Mobile RM30 under 话费充值/U Mobile");
 ok(w.eval("balance(S.accounts[0])")===70,"cash balance reduced by 30");
 w.eval("undo()");ok(S().tx.length===0,"undo removes quick entry");
 // copy last
 click(w,"#fab");click(w,"#pq");click(w,'[data-qi="1"]');
 click(w,"#fab");click(w,"#pq");ok(/复制上一笔/.test(w.document.querySelector(".sheet").innerHTML),"copy-last offered");click(w,"[data-ql]");ok(S().tx.length===2,"copy last adds a tx");
 // new template via form (no amount -> opens full sheet prefilled)
 click(w,"#fab");click(w,"#pq");click(w,"[data-qn]");setv(w,"#tn","午餐");setv(w,"#tcg","餐饮");click(w,"#ok");
 const nt=S().fav.find(f=>f.name==="午餐");ok(nt&&!nt.amt,"new template saved without fixed amount");
 w.document.querySelectorAll(".mask").forEach(x=>x.remove());
 click(w,"#fab");click(w,"#pq");click(w,'[data-qi="3"]');ok(!!w.document.querySelector("#amt")&&w.document.querySelector("#amt").value==="","template without amount opens full sheet to type amount");
 w.document.querySelectorAll(".mask").forEach(x=>x.remove());
 // manage / delete template
 click(w,"#fab");click(w,"#pq");click(w,"[data-qm]");click(w,'[data-qi="3"]');click(w,"#del");ok(!S().fav.find(f=>f.name==="午餐"),"template deleted in manage mode");
 w.document.querySelectorAll(".mask").forEach(x=>x.remove());
 // trip mode
 w.eval("tab='set';render()");setv(w,"#trn","新加坡 11 月");setv(w,"#trc","SGD");click(w,"#tripgo");
 ok(S().trip&&S().trip.cur==="SGD","trip started");
 w.eval("txSheet()");ok(w.document.querySelector("#acc").value==="a2","trip defaults account to SGD cash");
 setv(w,"#amt","12");click(w,"#ok");
 const tt=S().tx.find(t=>t.acc==="a2");ok(tt&&tt.trip==="新加坡 11 月","tx tagged with trip");
 w.eval("tab='home';render()");ok(/旅行中/.test(w.document.getElementById("app").innerHTML),"home shows trip banner");
 click(w,'#fab');click(w,"#pq");click(w,'[data-qi="1"]');ok(S().tx.find(t=>t.note===""&&t.cat==="餐饮"&&t.trip==="新加坡 11 月"),"quick entry also tagged with trip");
 w.eval("tab='set';render()");click(w,"#tripend");ok(!S().trip,"trip ended");ok(/以前的旅行/.test(w.document.getElementById("app").innerHTML),"past trips listed");
 // CSV import
 const csv='Date,Description,Amount\n"12/11/2026","GRAB*A-123 KL","-15.50"\n"13/11/2026","U MOBILE TOPUP","-30.00"\n"13/11/2026","SALARY ACME","3,000.00"\n"14 Nov 2026","Petronas Station","(80.20)"\n"bad","x","1"\n';
 const r=JSON.parse(w.eval("JSON.stringify(csvToTx("+JSON.stringify(csv)+",'auto'))"));
 ok(r.items.length===4,"csv parses 4 valid rows ("+r.items.length+")");
 const by=n=>r.items.find(i=>i.note.includes(n));
 ok(by("GRAB").cat==="交通"&&by("GRAB").type==="expense"&&by("GRAB").amt===15.5&&by("GRAB").date==="2026-11-12","Grab -> 交通, dd/mm date");
 ok(by("U MOBILE").cat==="话费充值"&&by("U MOBILE").sub==="U Mobile","U Mobile topup -> 话费充值/U Mobile");
 ok(by("SALARY").type==="income"&&by("SALARY").amt===3000&&by("SALARY").cat==="工资","salary -> income 3000 工资");
 ok(by("Petronas").cat==="油费"&&by("Petronas").amt===80.2&&by("Petronas").date==="2026-11-14","parentheses = expense, '14 Nov 2026' parsed, 油费");
 const tng='Transaction Date,Status,Transaction Type,Reference,Description,Details,Amount (MYR),Wallet Balance\n"2026-11-10","Success","Payment","1","MCD","McDonalds Bangsar","12.90","100"\n';
 const r2=JSON.parse(w.eval("JSON.stringify(csvToTx("+JSON.stringify(tng)+",'exp'))"));
 ok(r2.items.length===1&&r2.items[0].type==="expense"&&r2.items[0].amt===12.9&&r2.items[0].cat==="餐饮","TNG-style file with 'all expense' mode (balance column ignored)");
 ok(JSON.parse(w.eval("JSON.stringify(csvToTx('foo,bar\\n1,2','auto'))")).err!=="","unknown format gives a clear error");
 // import UI + dedupe + undo
 const n0=S().tx.length;w.eval("importSheet()");
 const f=w.document.querySelector("#if");Object.defineProperty(f,"files",{value:[new w.File([csv],"a.csv")]});f.dispatchEvent(new w.Event("change"));await wait(200);
 ok(/将导入 <b>4<\/b>/.test(w.document.querySelector("#ip").innerHTML),"preview says 4 to import");click(w,"#ig");ok(S().tx.length===n0+4,"import adds 4");
 w.eval("importSheet()");const f2=w.document.querySelector("#if");Object.defineProperty(f2,"files",{value:[new w.File([csv],"a.csv")]});f2.dispatchEvent(new w.Event("change"));await wait(200);
 ok(/疑似重复/.test(w.document.querySelector("#ip").innerHTML)&&w.document.querySelector("#ig").style.display==="none","second import: all skipped as duplicates");
 w.document.querySelectorAll(".mask").forEach(x=>x.remove());
 w.eval("undo()");ok(S().tx.length===n0+4||S().tx.length===n0,"undo available after import");
 // batch edit
 w.eval("tab='bills';render()");click(w,"#selbtn");const rows=w.document.querySelectorAll("#app [data-tx]");ok(rows.length>2&&/⬜/.test(w.document.getElementById("app").innerHTML),"select mode shows checkboxes");
 rows[0].click();w.document.querySelectorAll("#app [data-tx]")[1].click();ok(Object.keys(w.__g("sel")).length===2,"two rows selected");
 const total=S().tx.length;click(w,"#selcat");setv(w,"#bc","expense:购物");click(w,"#ok");
 ok(S().tx.filter(t=>t.cat==="购物").length>=1,"batch category change applied");
 w.eval("tab='bills';render()");click(w,"#selbtn");w.document.querySelectorAll("#app [data-tx]")[0].click();w.confirm=()=>true;w.eval("confirm=function(){return true}");click(w,"#seldel");
 ok(S().tx.length===total-1,"batch delete removes selected ("+S().tx.length+" vs "+(total-1)+")");
 // PIN hashed + legacy upgrade
 w.eval("pinSheet()");setv(w,"#pn","4321");click(w,"#ok");await wait(100);
 ok(/^h1:[0-9a-f]{64}$/.test(S().pin)&&!JSON.stringify(S()).includes('"4321"'),"PIN stored as hash");
 w.eval("lock()");let i=w.document.querySelector("#lp");i.value="1111";i.dispatchEvent(new w.Event("input"));await wait(50);ok(!!w.document.getElementById("lk"),"wrong PIN stays locked");
 i.value="4321";i.dispatchEvent(new w.Event("input"));await wait(50);ok(!w.document.getElementById("lk"),"right PIN unlocks");
 w.eval("S.pin='2468';delete S.pinLen;lock()");i=w.document.querySelector("#lp");i.value="2468";i.dispatchEvent(new w.Event("input"));await wait(100);
 ok(/^h1:/.test(S().pin),"legacy plain PIN upgraded to hash after unlock");
 // year trend chart
 w.eval("statMode='year';tab='stats';render()");ok(/<polyline/.test(w.document.getElementById("app").innerHTML)&&/id="tcat"/.test(w.document.getElementById("app").innerHTML),"year view shows trend line + category picker");
 w.__s("trendCat","'交通'");w.eval("render()");ok(w.errs.length===0,"trend by category renders: "+w.errs.join("|"));
 // photos export
 await w.eval("imgPut('t-photo','data:image/jpeg;base64,AAAA')");const all=await w.eval("imgAll()");ok(all&&all["t-photo"],"imgAll returns stored photos");
 // merge: favourites merge per record
 const mg=JSON.parse(w.eval("JSON.stringify(LM.merge({accounts:[],tx:[],fav:[{name:'A',cat:'x',type:'expense',amt:1}],_t:1},{accounts:[],tx:[],fav:[{name:'B',cat:'y',type:'expense',amt:2}],_t:2}))"));
 ok(mg.fav.length===2,"templates from two devices are merged, not overwritten");

 // ===== new categories / logos =====
 const w9=boot({"ledger.v1":{accounts:[{id:"a1",name:"现金",type:"cash",cur:"MYR",bal:0}],tx:[],cats:{expense:["餐饮","交通","其他"],income:["工资","其他"]},sub:{餐饮:["我的自订细分"]}}});
 const ex=w9.__g("S").cats.expense;
 ok(["外卖","咖啡饮料","超市杂货","订阅会员","保险","宠物","汽车","孩子","话费充值"].every(c=>ex.includes(c)),"new categories added to an existing ledger");
 ok(ex[ex.length-1]==="其他"&&new Set(ex).size===ex.length,"'其他' stays last, no duplicates ("+ex.length+" cats)");
 ok(w9.__g("S").sub.餐饮.includes("我的自订细分")&&w9.__g("S").sub.餐饮.includes("聚餐"),"own sub-categories kept, new ones appended");
 ok(w9.__g("S").sub.话费充值.includes("U Mobile")&&w9.__g("S").sub.咖啡饮料.includes("Starbucks"),"brand sub-categories present");
 w9.eval("S.cats.expense=S.cats.expense.filter(function(c){return c!=='宠物'});migrate()");
 ok(!w9.__g("S").cats.expense.includes("宠物"),"deleted category is not re-added");
 ok(w9.eval("S.cats.expense.every(function(c){return ci(c)!=='🏷️'})"),"every default category has a logo");
 ok(/SB/.test(w9.eval("txi({cat:'咖啡饮料',sub:'Starbucks',note:''})")),"tx with sub Starbucks shows Starbucks badge");
 ok(/U/.test(w9.eval("txi({cat:'话费充值',sub:'U Mobile',note:''})"))&&/class="bd"/.test(w9.eval("txi({cat:'话费充值',sub:'U Mobile',note:''})")),"U Mobile top-up shows U Mobile badge");
 w9.eval("txSheet(null,{type:'expense',amt:'5',acc:'a1',to:'',cat:'咖啡饮料',note:'',date:today(),fee:''})");
 ok((w9.document.querySelector(".sheet").innerHTML.match(/class="bd"/g)||[]).length>=5,"sub chips show brand logos");
 w9.document.querySelectorAll(".mask").forEach(x=>x.remove());
 const rules=[["FOODPANDA KL","外卖"],["ZUS COFFEE BANGSAR","咖啡饮料"],["AEON BIG","超市杂货"],["NETFLIX.COM","订阅会员"],["AIA PUBLIC TAKAFUL","保险"],["UNIQLO PAVILION","衣服鞋包"],["ANYTIME FITNESS","运动健身"],["LHDN PAYMENT","税费罚款"]];
 rules.forEach(([n,c])=>{const r=JSON.parse(w9.eval("JSON.stringify(csvToTx("+JSON.stringify("Date,Description,Amount\n2026-11-01,"+n+",-10")+",'auto'))"));ok(r.items[0]&&r.items[0].cat===c,"import: "+n+" -> "+c+" (got "+(r.items[0]&&r.items[0].cat)+")")});
 for(const t of ["home","bills","accts","stats","set"]){w9.eval("tab='"+t+"';render()")}
 ok(w9.errs.length===0,"renders with new categories: "+w9.errs.join("|"));
 ok(w.errs.length===0,"no uncaught errors: "+w.errs.join("|"));
 console.log("PASS",pass,"FAIL",fail.length);fail.forEach(f=>console.log(" ✗",f));process.exit(0);
})().catch(e=>{console.log("CRASH",e.stack.split("\n").slice(0,6).join("\n"));console.log(pass,fail);process.exit(1)});