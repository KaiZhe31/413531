const H=require("./harness");const {boot,wait,click,setv}=H;let pass=0,fail=[];const ok=(c,m)=>{c?pass++:fail.push(m)};
const cfg=n=>({"ledger.fb":{url:"https://t-default-rtdb.firebaseio.com",pass:"correct horse battery",name:n},"ledger.v1":{accounts:[{id:"a1",name:"现金",type:"cash",cur:"MYR",bal:0}],tx:[]}});
const until=async(fn,ms=20000)=>{const t=Date.now();while(Date.now()-t<ms){try{if(fn())return true}catch(e){}await wait(250)}return false};
const app=w=>w.document.getElementById("app").innerHTML;
(async()=>{
 const store={d:{}};
 const A=boot(cfg("Alice"),store),B=boot(cfg("Bob"),store);
  ok(await until(()=>A.__g("shState")==="ok"&&B.__g("shState")==="ok",15000),"both connected");
 ok(await until(()=>Object.keys(A.__g("names")).length>0&&Object.keys(B.__g("names")).length>0,15000),"each device knows the other's id");
 // ---------- bill card in chat ----------
 A.eval("tab='home';render()");A.eval("txSheet()");setv(A,"#amt","40");A.document.querySelector('[data-c="餐饮"]').click();setv(A,"#nt","火锅");A.document.querySelector("#ok").click();
 const tx=A.__g("S").tx[0];A.eval("txSheet(JSON.parse(JSON.stringify(S.tx[0])))");
 ok(!!A.document.querySelector("#tochat"),"'💬 发到聊天' button on a saved bill");
 A.document.querySelector("#tochat").click();
 const sheets=[...A.document.querySelectorAll(".mask")].pop();ok(/RM 40\.00/.test(sheets.innerHTML)&&/餐饮/.test(sheets.innerHTML),"preview card shows category and amount");
 sheets.querySelector("#sc2").value="这笔是我们上次那家";sheets.querySelector("#ok").click();
 ok(A.__g("tab")==="chat"&&/RM 40\.00/.test(app(A))&&/这笔是我们上次那家/.test(app(A)),"card + comment appear in my chat");
 ok(await until(()=>B.eval("chatList().some(function(m){return m.c&&m.c.amt===40})"),15000),"Bob receives the card");
 B.eval("tab='chat';render()");ok(/RM 40\.00/.test(app(B))&&/餐饮/.test(app(B))&&/火锅/.test(app(B))&&/这笔是我们上次那家/.test(app(B)),"card renders in Bob's chat with note and comment");
 // recall removes the card
 A.confirm=()=>true;A.eval("confirm=function(){return true}");const mid=A.eval("chatList().filter(function(m){return m.c})[0].id");
 A.document.querySelector('[data-cm="'+mid+'"]').click();ok(!/RM 40\.00/.test(app(A))&&/消息已撤回/.test(app(A)),"recalling removes the card");
 ok(await until(()=>/消息已撤回/.test(app(B))&&!/RM 40\.00/.test(app(B)),15000),"card disappears for Bob too");
 // ---------- 'has a question' flag in the joint ledger ----------
 A.eval("sw('joint')");await wait(100);A.eval("txSheet()");setv(A,"#amt","200");A.document.querySelector('[data-c="购物"]').click();A.document.querySelector("#ok").click();
 ok(await until(()=>B.__g("JOINT")&&B.__g("JOINT").tx&&B.__g("JOINT").tx.length===1,15000),"Bob receives the joint bill");
 B.eval("sw('joint')");await wait(100);
 B.eval("txSheet(JSON.parse(JSON.stringify(S.tx[0])))");ok(!!B.document.querySelector("#qset"),"joint bill has the ❓ button");
 B.document.querySelector("#qset").click();ok(!!B.document.querySelector("#qtext"),"question box appears");
 B.document.querySelector("#qtext").value="这个 200 是什么？";B.document.querySelector("#ok").click();
 ok(B.__g("S").tx[0].q&&B.__g("S").tx[0].q.by&&B.__g("S").tx[0].q.text==="这个 200 是什么？","flag saved on the bill with the question");
 B.eval("tab='bills';render()");ok(/❓ Bob：这个 200 是什么？/.test(app(B)),"bill row shows ❓ + question");
 // Alice is looking at her own ledger: still gets the alert and the chat message
 ok(await until(()=>A.__g("S").tx[0].q,15000),"flag syncs to Alice");
 A.eval("sw('mine')");A.eval("tab='home';render()");
 ok(/Bob 对一笔账有疑问/.test(app(A))&&/这个 200 是什么/.test(app(A)),"Alice's home shows the alert even from her own ledger");
 ok(await until(()=>A.eval("chatList().some(function(m){return m.x&&m.x.indexOf('这笔有疑问')>=0&&m.c&&m.c.amt===200})"),15000),"a chat message with the bill card is sent automatically");
 // filter
 A.eval("sw('joint')");A.eval("fF='q';tab='bills';render()");ok(/200\.00/.test(app(A)),"bills filter '❓ 有疑问' finds it");
 // Alice opens from the alert and resolves it
 A.eval("sw('mine')");A.eval("tab='home';render()");A.document.querySelector("[data-qgo]").click();
 ok(A.__g("cur")==="joint"&&!!A.document.querySelector("#qdone"),"'查看' jumps into the joint ledger and opens the bill");
 A.document.querySelector("#qdone").click();A.document.querySelector("#ok").click();
 ok(!A.__g("S").tx[0].q,"resolved: flag removed");
 ok(await until(()=>!B.__g("S").tx[0].q,15000),"Bob sees it resolved");
 [A,B].forEach((w,i)=>ok(w.errs.length===0,"no uncaught errors "+"AB"[i]+": "+w.errs.join("|")));
 console.log("PASS",pass,"FAIL",fail.length);fail.forEach(f=>console.log(" ✗",f));process.exit(fail.length?1:0);
})().catch(e=>{console.log("CRASH",e.stack.split("\n").slice(0,6).join("\n"));console.log(pass,fail);process.exit(1)});