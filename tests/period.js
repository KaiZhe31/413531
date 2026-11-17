const H=require("./harness");const {boot,wait,click,setv}=H;let pass=0,fail=[];const ok=(c,m)=>{c?pass++:fail.push(m)};
const pad=n=>String(n).padStart(2,"0"),ds=x=>`${x.getFullYear()}-${pad(x.getMonth()+1)}-${pad(x.getDate())}`;
const T=ds(new Date()),add=(n)=>{const d=new Date();d.setDate(d.getDate()+n);return ds(d)};
const base={accounts:[{id:"a1",name:"现金",type:"cash",cur:"MYR",bal:0}],tx:[]};
const cfg=n=>({"ledger.fb":{url:"https://t-default-rtdb.firebaseio.com",pass:"correct horse battery",name:n},"ledger.v1":base});
const until=async(fn,ms=30000)=>{const t=Date.now();while(Date.now()-t<ms){try{if(fn())return true}catch(e){}await wait(250)}return false};
const app=w=>w.document.getElementById("app").innerHTML;
const calc=(w,pl,ps)=>JSON.parse(w.eval("JSON.stringify(perCalc("+JSON.stringify(pl)+","+JSON.stringify(ps||{})+"))"));
(async()=>{
 const w=boot({"ledger.v1":base}),S=()=>w.__g("S");
 // ---------- prediction maths ----------
 ok(calc(w,[]).kind==="none","no logs -> none");
 let c=calc(w,[{start:add(-82)},{start:add(-54)},{start:add(-26)}]);
 ok(c.cycle===28&&c.auto&&c.next===add(2)&&c.kind==="before"&&c.days===2&&c.starts.length===6,"cycle 28 from history, next in 2 days ("+c.cycle+","+c.next+","+c.kind+")");
 ok(c.starts[1]===add(30)&&c.starts[5]===add(142),"following cycles are 28 days apart");
 c=calc(w,[{start:add(-2)}]);ok(c.kind==="in"&&c.day===3,"started 2 days ago -> day 3");
 c=calc(w,[{start:add(-10),end:add(-6)}]);ok(c.len===5&&c.kind==="before"&&c.days===18,"default 28-day cycle: 18 days left");
 c=calc(w,[{start:add(-28),end:add(-24)}]);ok(c.kind==="today","predicted start is today");
 c=calc(w,[{start:add(-31),end:add(-27)}]);ok(c.kind==="late"&&c.days===3,"3 days late");
 c=calc(w,[{start:add(-120)},{start:add(-94)},{start:add(-64)},{start:add(0-1)}]);ok(c.cycle===28||c.cycle===27||c.cycle===30,"cycle is an average of recent gaps ("+c.cycle+")");
 c=calc(w,[{start:"2026-01-01"},{start:"2026-01-27"},{start:"2026-02-26"},{start:"2026-05-27"}]);ok(c.cycle===28,"gap of 90 days (missed logs) ignored: "+c.cycle);
 c=calc(w,[{start:add(-5),end:add(-1)}],{cycle:32,len:6});ok(c.cycle===32&&c.next===add(27)&&c.len===5,"manual default cycle used when only one log; period length from log (5)");
 c=calc(w,[{start:add(-26)}]);const day=(d)=>JSON.parse(w.eval("JSON.stringify(perDay("+JSON.stringify(c)+",'"+d+"','"+T+"'))"));
 ok(day(add(3)).pred&&day(add(2)).pred&&day(add(6)).pred&&!day(add(7)).pred,"predicted period days = 5 days from predicted start");
 ok(day(add(-12)).ovu&&day(add(-17)).fer&&day(add(-11)).fer&&!day(add(-10)).fer&&!day(add(-12)).fer,"ovulation 14 days before; fertile window -5..+1");
 ok(day(add(-3)).pms&&day(add(1)).pms&&!day(add(2)).pms,"PMS = 5 days before");
 // ---------- using the app ----------
 w.eval("tab='set';render()");ok(/经期记录/.test(app(w))&&!/打开经期日历/.test(app(w)),"settings card, off by default");
 const pon=w.document.querySelector("#pon2");pon.checked=true;pon.dispatchEvent(new w.Event("change",{bubbles:true}));
 ok(S().pset&&S().pset.on&&/打开经期日历/.test(app(w)),"enabled");
 w.eval("tab='home';render()");ok(/经期：还没有记录/.test(app(w)),"home card with no data");
 click(w,'[data-go="period"]');ok(w.__g("tab")==="period"&&/今天来了/.test(app(w)),"period page opens");
 click(w,"#pnow");ok(S().pl.length===1&&S().pl[0].start===T&&/经期第 1 天/.test(app(w)),"'今天来了' logs a start; status day 1");
 ok(!!w.document.querySelector("#pend")&&!w.document.querySelector("#pnow"),"now offers '今天结束了'");
 click(w,"#pend");ok(S().pl[0].end===T,"end recorded");
 ok(/还有 28 天|距离下次经期还有 28 天/.test(app(w))||/经期第 1 天/.test(app(w)),"status after ending");
 const days=new Date(w.__g("perMon").getFullYear(),w.__g("perMon").getMonth()+1,0).getDate();
 ok(w.document.querySelectorAll("[data-pd]").length===days,"calendar shows every day of the month ("+days+")");
 const m0=w.__g("perMon").getMonth();click(w,'[data-pnav="1"]');ok(w.__g("perMon").getMonth()===(m0+1)%12,"next month button");click(w,'[data-pnav="-1"]');
 // day sheet: future day cannot be logged, past day can
 w.document.querySelector('[data-pd="'+add(5)+'"]')&&click(w,'[data-pd="'+add(5)+'"]');
 if(w.document.querySelector(".mask")){ok(/未来的日子不能记录/.test(w.document.querySelector(".sheet").innerHTML),"future day cannot be logged");w.document.querySelectorAll(".mask").forEach(x=>x.remove())}
 // add an older period through a day sheet
 S().pl.length=0;S().pl.push({id:"x1",start:add(-60),end:add(-56)});w.eval("render()");
 const pastDay=w.document.querySelector('[data-pd="'+add(-29)+'"]');
 if(pastDay){pastDay.click();w.document.querySelector("#e4").click();ok(S().pl.length===2&&S().pl.some(l=>l.start===add(-29)),"tapping a past day logs a period start")}
 else ok(true,"(past day in another month — skipped)");
 // edit / delete a log
 click(w,"[data-plog]");setv(w,"#ls",add(-61));click(w,"#ok");ok(S().pl.some(l=>l.start===add(-61)||l.start===add(-30)),"log edited");
 const n=S().pl.length;click(w,"[data-plog]");click(w,"#del");ok(S().pl.length===n-1,"log deleted");
 // default cycle setting
 S().pl.length=0;S().pl.push({id:"y",start:add(-5),end:add(-1)});w.eval("render()");
 const ci=w.document.querySelector('[data-pset="cycle"]');ci.value="32";ci.dispatchEvent(new w.Event("change",{bubbles:true}));
 ok(S().pset.cycle===32&&w.eval("perCalc(S.pl,S.pset).next")===add(27),"changing the default cycle moves the prediction");
 // ---------- reminders ----------
 S().pl.length=0;S().pl.push({id:"z",start:add(-26)});S().pset.cycle=28;w.eval("tab='home';render()");
 ok(/距离下次经期还有 2 天/.test(app(w))&&/提前备好用品/.test(app(w)),"home card: 2 days to go with a tip");
 w.localStorage.removeItem("ledger.pertoast");w.eval("perToast()");ok(/💗 距离下次经期还有 2 天/.test(w.document.body.innerHTML),"toast shown once a day");
 w.document.querySelectorAll("div").forEach(d=>{if(d.id==="toast0")d.remove()});w.eval("perToast()");ok(!w.document.getElementById("toast0"),"no second toast the same day");
 S().pl[0].start=add(-31);w.eval("tab='home';render()");ok(/已推迟 3 天/.test(app(w)),"late reminder");
 S().pl[0].start=add(-30);S().pset.days=1;w.eval("tab='home';render()");
 // ---------- privacy ----------
 S().pset.share=false;ok(!/"pl"|"pset"/.test(w.eval("ser()")),"not shared: period data is NOT in the upload");
 S().pset.share=true;ok(/"pl"/.test(w.eval("ser()"))&&/"pset"/.test(w.eval("ser()")),"shared: period data is in the upload");S().pset.share=false;
 const mg=JSON.parse(w.eval("JSON.stringify(LM.merge({accounts:[],tx:[],pl:[{id:'a',start:'2026-01-01'}],pset:{on:true,cycle:30},_t:1},{accounts:[],tx:[],pl:[],_t:5}))"));
 ok(mg.pset&&mg.pset.cycle===30&&mg.pl.length===1,"a newer upload without period data does not wipe local period settings/logs");
 // ---------- calendar (ICS) ----------
 const ics=w.eval("icsBuild([{id:'q',start:'"+add(-26)+"'}],{days:2,len:5},false)");
 ok(/^BEGIN:VCALENDAR\r\n/.test(ics)&&/END:VCALENDAR\r\n$/.test(ics)&&(ics.match(/BEGIN:VEVENT/g)||[]).length===6,"ICS has 6 events");
 ok(/TRIGGER:-PT39H/.test(ics)&&/TRIGGER:PT9H/.test(ics),"alarms: 2 days before at 09:00 and on the day");
 ok(/DTSTART;VALUE=DATE:\d{8}\r\n/.test(ics)&&/SUMMARY:💗 经期预计开始/.test(ics),"all-day events with title");
 ok(w.eval("icsBuild([{id:'q',start:'"+add(-26)+"'}],{days:3,len:5},false)").includes("TRIGGER:-PT63H"),"3 days before -> -PT63H");
 ok(!/\n(?!\r)/.test(ics.replace(/\r\n/g,""))&&!/[^\\],[^\r\n]/.test(ics.split("\r\n").filter(l=>/^(SUMMARY|DESCRIPTION)/.test(l)).join("\n")),"ICS: CRLF lines, no unescaped ASCII commas in text");
 const dts=[...ics.matchAll(/DTSTART;VALUE=DATE:(\d{8})\r\nDTEND;VALUE=DATE:(\d{8})/g)];ok(dts.length===6&&dts.every(m=>{const a=new Date(+m[1].slice(0,4),+m[1].slice(4,6)-1,+m[1].slice(6,8)),b=new Date(+m[2].slice(0,4),+m[2].slice(4,6)-1,+m[2].slice(6,8));return Math.round((b-a)/864e5)===5}),"each event spans the period length (5 days, DTEND exclusive)");
 let cap=null;w.claude={use:async()=>({save:async r=>{cap=r}})};S().pl.length=0;S().pl.push({id:"z",start:add(-26)});await w.eval("perExport(S.pl,S.pset,false)");
 ok(cap&&cap.filename==="period.ics"&&cap.data.type==="text/calendar","export saves period.ics as text/calendar");
 S().pl.length=0;cap=null;await w.eval("perExport(S.pl,S.pset,false)");ok(cap===null&&/先记录一次经期/.test(w.document.body.innerHTML),"nothing to export without a log -> helpful message");
 ok(w.errs.length===0,"no uncaught errors: "+w.errs.join("|"));
 // ---------- two devices: she shares, he gets the reminder ----------
 const store={d:{}};const A=boot(cfg("Alice"),store),B=boot(cfg("Bob"),store);
 ok(await until(()=>A.__g("shState")==="ok"&&B.__g("shState")==="ok"&&Object.keys(B.__g("names")).length>0,20000),"both connected");
 A.eval("S.pset={on:true,cycle:28,len:5,days:2,share:false};S.pl=[{id:'k1',start:'"+add(-26)+"'}];save()");await wait(9000);
 B.eval("tab='home';render()");ok(!/Alice 的经期/.test(app(B)),"not shared: Bob sees nothing");
 const othersStr=Object.values(B.__g("others")).join("");ok(!/"pset"/.test(othersStr)&&!/k1/.test(othersStr),"not shared: nothing of it reaches Bob's device");
 A.eval("S.pset.share=true;save()");
 ok(await until(()=>{B.eval("tab='home';render()");return /Alice 的下次经期还有 2 天/.test(app(B))},30000),"shared: Bob's home shows 'Alice 的下次经期还有 2 天'");
 ok(/多一点耐心和温柔|备好暖宝宝|多体谅/.test(app(B))||/快到了/.test(app(B)),"Bob gets a considerate tip");
 B.eval("tab='home';render()");let pcap=null;B.claude={use:async()=>({save:async r=>{pcap=r}})};B.eval("claude={use:async function(){return {save:async function(r){window.__cap=r}}}}");
 B.document.querySelector("[data-pics]").click();await wait(300);const pc=B.window.__cap;ok(pc&&pc.filename==="her-period.ics",'"加入日历" exports her-period.ics for him');
 const text=await new Promise(r=>{const fr=new B.FileReader();fr.onload=()=>r(fr.result);fr.readAsText(pc.data)});ok(/Alice 的经期预计开始/.test(text)&&/TRIGGER:-PT39H/.test(text),"his calendar file says 'Alice 的经期预计开始' with a 2-day alarm");
 A.eval("S.pset.share=false;save()");
 ok(await until(()=>{B.eval("tab='home';render()");return !/Alice 的经期/.test(app(B))},30000),"sharing turned off: reminder disappears for Bob");
 [A,B].forEach((x,i)=>ok(x.errs.length===0,"no uncaught errors "+"AB"[i]+": "+x.errs.join("|")));
 console.log("PASS",pass,"FAIL",fail.length);fail.forEach(f=>console.log(" ✗",f));process.exit(fail.length?1:0);
})().catch(e=>{console.log("CRASH",e.stack.split("\n").slice(0,7).join("\n"));console.log(pass,fail);process.exit(1)});