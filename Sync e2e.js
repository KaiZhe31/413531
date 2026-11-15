const H=require("./harness");const {boot,wait,click,setv}=H;let pass=0,fail=[];const ok=(c,m)=>{c?pass++:fail.push(m)};
const cfg=n=>({"ledger.fb":{url:"https://t-default-rtdb.firebaseio.com",pass:"correct horse battery",name:n},"ledger.v1":{accounts:[{id:"a1",name:"现金",type:"cash",cur:"MYR",bal:0}],tx:[]}});
(async()=>{
 const store={d:{}};
 const A=boot(cfg("Alice"),store), B=boot(cfg("Bob"),store);
 await wait(9000); // both initShare, see empty joint
 ok(A.__g("shState")==="ok"&&B.__g("shState")==="ok","both devices connect (A:"+A.__g("shState")+" B:"+B.__g("shState")+")");
 // A creates joint ledger and adds a tx
 A.eval("sw('joint')");await wait(100);
 A.eval("txSheet()");setv(A,"#amt","40");click(A,'[data-c="餐饮"]');click(A,"#ok");
 await wait(9000);
 const enc=Object.values(store.d).map(v=>JSON.stringify(v)).join("");
 ok(!enc.includes("餐饮")&&!enc.includes("Alice"),"server stores only ciphertext");
 const jb=B.__g("JOINT");ok(jb&&jb.tx&&jb.tx.length===1&&jb.tx[0].amt===40,"B receives A's joint tx ("+(jb&&jb.tx&&jb.tx.length)+")");
 // B adds a tx while viewing joint; A edits the first one concurrently
 B.eval("sw('joint')");await wait(100);
 B.eval("txSheet()");setv(B,"#amt","15");click(B,'[data-c="交通"]');click(B,"#ok");
 A.eval("S.tx[0].amt=45;S.tx[0].note='edited';save()");
 await wait(16000);
 const as=A.__g("S").tx,bs=B.__g("S").tx;
 ok(as.length===2&&bs.length===2,"both sides converge to 2 tx (A:"+as.length+" B:"+bs.length+")");
 ok(bs.find(t=>t.note==="edited"&&t.amt===45),"B sees A's edit");
 ok(as.find(t=>t.amt===15),"A sees B's new tx");
 // B deletes the edited one -> A must lose it too, B's remaining stays
 const delId=bs.find(t=>t.note==="edited").id;
 B.eval("S.tx=S.tx.filter(function(t){return t.note!=='edited'});save()");
 await wait(16000);
 ok(!A.__g("S").tx.find(t=>t.id===delId)&&A.__g("S").tx.length===1,"deletion propagates, nothing resurrected ("+A.__g("S").tx.length+")");
 // wrong password device cannot read
 const C=boot(Object.assign(cfg("Eve"),{"ledger.fb":{url:"https://t-default-rtdb.firebaseio.com",pass:"wrong password!!",name:"Eve"}}),store);
 await wait(4000);
 ok(!C.__g("JOINT"),"wrong password sees nothing");
 [A,B,C].forEach((w,i)=>ok(w.errs.length===0,"no uncaught errors device "+"ABC"[i]+": "+w.errs.join("|")));
 console.log("PASS",pass,"FAIL",fail.length);fail.forEach(f=>console.log(" ✗",f));process.exit(fail.length?1:0);
})().catch(e=>{console.log("CRASH",e.stack.split("\n").slice(0,6).join("\n"));console.log("PASS",pass,fail);process.exit(1)});