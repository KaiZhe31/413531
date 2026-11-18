const {JSDOM}=require("jsdom"),fs=require("fs"),fake=require("fake-indexeddb"),nodeCrypto=require("crypto");
let pass=0,fail=[];const ok=(c,m)=>{c?pass++:fail.push(m)};
const pad=n=>String(n).padStart(2,"0"),ds=x=>`${x.getFullYear()}-${pad(x.getMonth()+1)}-${pad(x.getDate())}`;
function boot(seed,store,url){
  const dom=new JSDOM(`<!DOCTYPE html><body><main id="app"></main><button id="fab"></button><button id="cam"></button><input id="shot"><nav><div id="nav"></div></nav></body>`,{runScripts:"outside-only",url:url||"https://x.test/",pretendToBeVisual:true});
  const w=dom.window;w.indexedDB=fake.indexedDB;w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;
  Object.defineProperty(w,"crypto",{value:nodeCrypto.webcrypto});
  w.HTMLCanvasElement.prototype.toDataURL=()=>"";w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:()=>()=>({addColorStop(){}}),set:()=>true});
  w.scrollTo=function(){};w.prompt=function(){return null};w.errs=[];w.addEventListener("error",e=>w.errs.push(e.message));
  if(store){w.fetch=async(u,o)=>{u=String(u);const key=u.split("?")[0],m=(o&&o.method)||"GET";
    if(m==="PUT"){store.d[key]=JSON.parse(o.body);return {ok:true,json:async()=>({})}}
    if(u.includes("shallow=true")){const base=key.replace(/\.json$/,"/");const ks={};Object.keys(store.d).forEach(k=>{if(k.startsWith(base)){ks[k.slice(base.length).split("/")[0].replace(/\.json$/,"")]=true}});return {ok:true,json:async()=>ks}}
    if(key.endsWith("/t.json")){const v=store.d[key.replace(/\/t\.json$/,".json")];return {ok:true,json:async()=>v?v.t:null}}
    if(store.d[key]===undefined){const base=key.replace(/\.json$/,"/"),o={};Object.keys(store.d).forEach(k=>{if(k.startsWith(base)){o[k.slice(base.length).replace(/\.json$/,"")]=store.d[k]}});return {ok:true,json:async()=>Object.keys(o).length?o:null}}
    return {ok:true,json:async()=>store.d[key]}}}
  if(seed)Object.entries(seed).forEach(([k,v])=>w.localStorage.setItem(k,typeof v==="string"?v:JSON.stringify(v)));
  for(const f of ["merge.js","sync.js","app.js"])w.eval(fs.readFileSync(require("path").join(__dirname,"..","js",f),"utf8")+(f==="app.js"?"\n;window.__g=function(n){return eval(n)};window.__s=function(n,v){eval(n+'='+v)};":""));
  return w;
}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const click=(w,sel)=>{const e=w.document.querySelector(sel);if(!e)throw new Error("no "+sel);e.click()};
const setv=(w,sel,v)=>{const e=w.document.querySelector(sel);if(!e)throw new Error("no "+sel);e.value=v;e.dispatchEvent(new w.Event("input",{bubbles:true}));e.dispatchEvent(new w.Event("change",{bubbles:true}))};
const base={accounts:[{id:"a1",name:"现金",type:"cash",cur:"MYR",bal:100},{id:"a2",name:"现金 SGD",type:"cash",cur:"SGD",bal:50},{id:"a3",name:"Maybank",type:"bank",cur:"MYR",bal:0}],tx:[]};

module.exports={boot,wait,click,setv,ok:(c,m)=>ok(c,m),state:()=>({pass,fail})};