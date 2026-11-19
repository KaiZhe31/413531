const H=require("./harness");const {boot,wait,click,setv}=H;let pass=0,fail=[];const ok=(c,m)=>{c?pass++:fail.push(m)};
const pad=n=>String(n).padStart(2,"0"),ds=x=>`${x.getFullYear()}-${pad(x.getMonth()+1)}-${pad(x.getDate())}`;
const T=ds(new Date()),add=n=>{const d=new Date();d.setDate(d.getDate()+n);return ds(d)};
const near=(a,b,e=0.005)=>Math.abs(a-b)<e;
const base={accounts:[{id:"a1",name:"现金",type:"cash",cur:"MYR",bal:1000},{id:"a2",name:"TNG eWallet",type:"wallet",cur:"MYR",bal:200},{id:"a3",name:"Maybank",type:"bank",cur:"MYR",bal:0}],tx:[]};
const cfg=n=>({"ledger.fb":{url:"https://t-default-rtdb.firebaseio.com",pass:"correct horse battery",name:n},"ledger.v1":base});
const until=async(fn,ms=35000)=>{const t=Date.now();while(Date.now()-t<ms){try{if(fn())return true}catch(e){}await wait(250)}return false};
const app=w=>w.document.getElementById("app").innerHTML;
const top=(w,sel)=>{const m=[...w.document.querySelectorAll(".mask")].pop();const e=m.querySelector(sel);if(!e)throw new Error("no top "+sel);return e};
const tset=(w,sel,v)=>{const e=top(w,sel);e.value=v;e.dispatchEvent(new w.Event("input",{bubbles:true}));e.dispatchEvent(new w.Event("change",{bubbles:true}))};
(async()=>{
 const w=boot({"ledger.v1":base}),S=()=>w.__g("S");
 const pq=t=>JSON.parse(w.eval("JSON.stringify(parseQuick("+JSON.stringify(t)+"))"));
 // ================= 一句话记账：识别 =================
 let r=pq("星巴克 15");ok(r.ok&&r.amt===15&&r.cat==="咖啡饮料"&&r.sub==="Starbucks"&&r.acc==="a1"&&r.date===T&&r.type==="expense","星巴克 15 -> 咖啡饮料/Starbucks RM15 ("+r.cat+"/"+r.sub+")");
 r=pq("午餐 12.5");ok(r.amt===12.5&&r.cat==="餐饮"&&r.sub==="午餐","午餐 12.5 -> 餐饮/午餐");
 r=pq("grab rm 20");ok(r.amt===20&&r.cat==="交通"&&r.sub==="Grab","grab rm 20 -> 交通/Grab RM20");
 r=pq("7-eleven 12");ok(r.amt===12&&r.cat==="超市杂货"&&r.sub==="7-Eleven","7-eleven 12: the 7 is part of the name, amount is 12 ("+r.amt+","+r.cat+","+r.sub+")");
 r=pq("昨天 晚餐 30 tng");ok(r.amt===30&&r.date===add(-1)&&r.cat==="餐饮"&&r.sub==="晚餐"&&r.acc==="a2","昨天 晚餐 30 tng -> yesterday, TNG account");
 r=pq("前天午餐12");ok(r.amt===12&&r.date===add(-2)&&r.sub==="午餐","前天午餐12 (no spaces)");
 r=pq("+3000 工资");ok(r.type==="income"&&r.amt===3000&&r.cat==="工资","+3000 工资 -> income");
 r=pq("netflix 55");ok(r.cat==="订阅会员"&&r.sub==="Netflix"&&r.amt===55,"netflix 55");
 r=pq("充值 30 u mobile");ok(r.amt===30&&r.cat==="话费充值"&&r.sub==="U Mobile","充值 30 u mobile -> 话费充值/U Mobile");
 r=pq("买菜 85.5");ok(r.amt===85.5&&r.cat==="超市杂货","买菜 85.5 -> 超市杂货");
 r=pq("停车 3");ok(r.cat==="交通"&&r.sub==="停车"&&r.amt===3,"停车 3");
 r=pq("加油 60");ok(r.cat==="油费"&&r.amt===60,"加油 60 -> 油费");
 r=pq("15块 咖啡");ok(r.amt===15&&r.cat==="咖啡饮料","15块 咖啡 (amount first, 块)");
 r=pq("rm15 麦当劳");ok(r.amt===15&&r.cat==="餐饮","rm15 麦当劳");
 r=pq("1,200 租金");ok(r.amt===1200&&r.cat==="房租","1,200 租金 -> 1200 (thousands comma)");
 r=pq("2 杯咖啡 12");ok(r.amt===12&&r.cat==="咖啡饮料","2 杯咖啡 12 -> amount is 12, not 2");
 r=pq("99 speedmart 30");ok(r.amt===30&&r.cat==="超市杂货"&&r.sub==="99 Speedmart","99 speedmart 30");
 r=pq("优衣库 99");ok(r.cat==="衣服鞋包"&&r.sub==="Uniqlo"&&r.amt===99,"优衣库 99 -> Uniqlo");
 r=pq("神秘商店 8");ok(r.ok&&r.cat==="其他"&&r.note==="神秘商店","unknown shop -> 其他, note kept");
 ok(!pq("没有金额").ok&&!pq("").ok&&!pq("0 午餐").ok&&!pq("   ").ok,"no amount / empty / zero -> not recognised");
 // ================= 一句话记账：界面 =================
 click(w,"#fab");click(w,"#pq");const sheet=()=>[...w.document.querySelectorAll(".sheet")].pop();
 ok(!!sheet().querySelector("#qq")&&!!sheet().querySelector("#qgo"),"quick sheet has the one-line box");
 const qq=sheet().querySelector("#qq");qq.value="星巴克 15";qq.dispatchEvent(new w.Event("input",{bubbles:true}));
 ok(/咖啡饮料 · Starbucks · RM 15\.00 · 现金/.test(sheet().querySelector("#qp").textContent),"live preview: "+sheet().querySelector("#qp").textContent);
 qq.value="只有字";qq.dispatchEvent(new w.Event("input",{bubbles:true}));ok(/还没认出金额/.test(sheet().querySelector("#qp").textContent),"preview says when no amount is found");
 sheet().querySelector("#qgo").click();ok(S().tx.length===0&&/请带上金额/.test(w.document.body.innerHTML),"submitting without amount does not record");
 qq.value="星巴克 15";sheet().querySelector("#qgo").click();
 ok(S().tx.length===1&&S().tx[0].amt===15&&S().tx[0].cat==="咖啡饮料"&&S().tx[0].sub==="Starbucks"&&S().tx[0].note==="星巴克","tap 记 -> recorded");
 ok(near(w.eval("balance(S.accounts[0])"),985),"cash reduced by 15");w.eval("undo()");ok(S().tx.length===0,"undo works");
 click(w,"#fab");click(w,"#pq");const q2=sheet().querySelector("#qq");q2.value="昨天 午餐 12 tng";q2.dispatchEvent(new w.KeyboardEvent("keydown",{key:"Enter",bubbles:true}));
 ok(S().tx.length===1&&S().tx[0].date===add(-1)&&S().tx[0].acc==="a2"&&S().tx[0].amt===12,"Enter key records it (yesterday, TNG)");
 click(w,"#fab");click(w,"#pq");const q3=sheet().querySelector("#qq");q3.value="+500 收入";q3.dispatchEvent(new w.KeyboardEvent("keydown",{key:"Enter",bubbles:true}));
 ok(S().tx.some(t=>t.type==="income"&&t.amt===500),"income through the one-line box");
 w.eval("cur='joint';quickAdd({name:'x',type:'expense',amt:20,acc:'a1',cat:'餐饮',sub:'午餐',note:'午餐',date:'"+add(-1)+"'})");
 ok(!!w.document.querySelector("#amt")&&w.document.querySelector("#amt").value==="20","in the shared ledger it opens the full form (payer must be chosen), prefilled");
 w.eval("cur='mine'");w.document.querySelectorAll(".mask").forEach(x=>x.remove());
 // ================= 购物清单 =================
 w.eval("tab='set';render()");ok(/购物清单/.test(app(w))&&/我的：还差 0 样/.test(app(w)),"settings card");
 click(w,'[data-go="shop"]');ok(w.__g("tab")==="shop"&&/清单是空的/.test(app(w))&&w.document.querySelectorAll("[data-shsug]").length===8,"empty list with 8 suggestions");
 ok(!w.document.querySelector('[data-shsw]'),"no 我的/共同 switch when not synced");
 setv(w,"#shi","鸡蛋, 牛奶、面包，鸡蛋");click(w,"#shadd");ok(S().shop.length===3&&["鸡蛋","牛奶","面包"].every(n=>S().shop.some(x=>x.name===n)),"comma / 、 / ， separated, duplicate ignored");
 const wk=w.document.querySelector("#shw");wk.checked=true;wk.dispatchEvent(new w.Event("change",{bubbles:true}));setv(w,"#shi","米");click(w,"#shadd");
 ok(S().shop.find(x=>x.name==="米").staple===true&&!S().shop.find(x=>x.name==="牛奶").staple,"'每周都买' ticked -> added as weekly staple");
 click(w,'[data-shsug="食用油"]');ok(S().shop.find(x=>x.name==="食用油").staple===true,"suggestion chip adds (as staple while ticked)");
 const idOf=n=>S().shop.find(x=>x.name===n).id;
 click(w,'.sp[data-shop="'+idOf("牛奶")+'"]');ok(S().shop.find(x=>x.name==="牛奶").done===true&&/line-through/.test(app(w)),"tap an item -> bought (struck through)");
 click(w,'[data-shopst="'+idOf("面包")+'"]');ok(S().shop.find(x=>x.name==="面包").staple===true,"🔁 toggles weekly staple");
 const k=w.document.querySelector("#shi");k.value="酱油";k.dispatchEvent(new w.KeyboardEvent("keydown",{key:"Enter",bubbles:true}));ok(S().shop.some(x=>x.name==="酱油"),"Enter in the box adds the item");
 click(w,'[data-shopdel="'+idOf("酱油")+'"]');ok(!S().shop.some(x=>x.name==="酱油"),"✕ deletes");w.eval("undo()");ok(S().shop.some(x=>x.name==="酱油"),"undo brings it back");
 click(w,'.sp[data-shop="'+idOf("鸡蛋")+'"]');click(w,'.sp[data-shop="'+idOf("酱油")+'"]');click(w,'.sp[data-shop="'+idOf("米")+'"]');
 ok(/还差 2 样（共 6 样）/.test(app(w)),"counter: "+(app(w).match(/还差 \d+ 样（共 \d+ 样）/)||[""])[0]+" (expect 还差 2 样（共 6 样）)");
 // finish shopping with an amount
 const bal0=w.eval("balance(S.accounts[0])"),tx0=S().tx.length;
 click(w,"#shdone");tset(w,"#sa","85.5");tset(w,"#sc","a1");top(w,"#ok").click();
 const spent=S().tx[S().tx.length-1];ok(S().tx.length===tx0+1&&spent.cat==="超市杂货"&&spent.amt===85.5&&spent.note==="购物清单"&&spent.type==="expense","完成采购 records 超市杂货 RM85.5");
 ok(near(w.eval("balance(S.accounts[0])"),bal0-85.5),"cash reduced");
 ok(!S().shop.some(x=>x.name==="鸡蛋")&&!S().shop.some(x=>x.name==="牛奶"),"bought one-offs (鸡蛋 牛奶) removed from the list");
 ok(S().shop.length===4&&["米","面包","食用油","酱油"].every(n=>S().shop.some(x=>x.name===n)),"weekly staples stay (酱油 was added while '每周都买' was ticked)");
 ok(S().shop.every(x=>!x.done),"staples reset to 'not bought'; unbought items untouched");
 w.eval("undo()");ok(S().shop.some(x=>x.name==="酱油"&&x.done)&&S().tx.length===tx0,"undo restores list and removes the expense");
 click(w,"#shdone");top(w,"#ok").click();ok(S().tx.length===tx0,"finishing without an amount records nothing");
 w.eval("tab='shop';render()");ok(!w.document.querySelector("#shdone"),"no 完成采购 button when nothing is ticked");click(w,"#shw");
 // reminder on shopping day
 w.eval("tab='home';render()");ok(!/今天是采购日/.test(app(w)),"no reminder by default");
 S().shopDay=new Date().getDay();w.eval("tab='home';render()");ok(/今天是采购日/.test(app(w))&&/还有 \d+ 样没买/.test(app(w)),"reminder on the chosen weekday");
 S().shopDay=(new Date().getDay()+1)%7;w.eval("tab='home';render()");ok(!/今天是采购日/.test(app(w)),"no reminder on other days");
 S().shopDay=new Date().getDay();S().shop.forEach(x=>x.done=true);w.eval("tab='home';render()");ok(!/今天是采购日/.test(app(w)),"no reminder when everything is bought");
 w.eval("tab='shop';render()");const sd=w.document.querySelector("#shday");sd.value="6";sd.dispatchEvent(new w.Event("change",{bubbles:true}));ok(S().shopDay===6,"采购日 select saves");
 const mg=JSON.parse(w.eval("JSON.stringify(LM.merge({accounts:[],tx:[],shop:[{id:'s1',name:'A'}],_t:1},{accounts:[],tx:[],shop:[{id:'s2',name:'B'}],_t:2}))"));ok(mg.shop.length===2,"list items from two devices merge");
 for(const t of ["home","bills","accts","stats","set","shop"]){w.eval("tab='"+t+"';render()")}
 ok(w.errs.length===0,"no uncaught errors: "+w.errs.join("|"));
 // ================= 共同清单（两台设备）=================
 const store={d:{}};const A=boot(cfg("Alice"),store),B=boot(cfg("Bob"),store);
 ok(await until(()=>A.__g("shState")==="ok"&&B.__g("shState")==="ok",20000),"both connected");
 A.eval("tab='set';render()");ok(/共同：还差/.test(app(A))||/我的：还差/.test(app(A)),"settings card on a synced device");
 A.eval("tab='shop';render()");ok(!!A.document.querySelector('[data-shsw="joint"]'),"我的清单 / 共同清单 switch appears once synced");
 A.eval("shopAdd('我自己的',false);save()");
 click(A,'[data-shsw="joint"]');ok(A.__g("cur")==="joint"&&A.__g("tab")==="shop"&&/共同清单/.test(app(A))&&!/我自己的/.test(app(A)),"switching to 共同清单 shows a separate list");
 A.eval("shopAdd('牛奶, 纸巾',false)");A.eval("tab='shop';render()");
 ok(await until(()=>B.__g("JOINT")&&B.__g("JOINT").shop&&B.__g("JOINT").shop.length===2),"Bob receives the shared items");
 B.eval("sw('joint');tab='shop';render()");ok(/牛奶/.test(app(B))&&/纸巾/.test(app(B))&&!/我自己的/.test(app(B)),"Bob sees them, and not Alice's personal list");
 const mid=B.__g("S").shop.find(x=>x.name==="牛奶").id;click(B,'.sp[data-shop="'+mid+'"]');
 ok(await until(()=>A.__g("S").shop.find(x=>x.name==="牛奶").done===true),"Bob ticks 牛奶 -> Alice sees it as bought");
 // both add different things at the same time
 A.eval("shopAdd('鸡蛋',false)");B.eval("shopAdd('面包',false)");
 ok(await until(()=>["鸡蛋","面包"].every(n=>A.__g("S").shop.some(x=>x.name===n)&&B.__g("S").shop.some(x=>x.name===n))),"two people adding at once: nobody's item is lost");
 // delete propagates
 const del=A.__g("S").shop.find(x=>x.name==="纸巾").id;A.eval("S.shop=S.shop.filter(function(x){return x.name!=='纸巾'});save()");
 ok(await until(()=>!B.__g("S").shop.some(x=>x.name==="纸巾")&&B.__g("S").shop.some(x=>x.name==="面包")),"a deleted item disappears on the other phone, the rest stays");
 [A,B].forEach((x,i)=>ok(x.errs.length===0,"no uncaught errors "+"AB"[i]+": "+x.errs.join("|")));
 console.log("PASS",pass,"FAIL",fail.length);fail.forEach(f=>console.log(" ✗",f));process.exit(fail.length?1:0);
})().catch(e=>{console.log("CRASH",e.stack.split("\n").slice(0,7).join("\n"));console.log(pass,fail);process.exit(1)});