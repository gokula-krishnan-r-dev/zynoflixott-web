(()=>{var e={};e.id=339,e.ids=[339,783],e.modules={47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},39491:e=>{"use strict";e.exports=require("assert")},32081:e=>{"use strict";e.exports=require("child_process")},6113:e=>{"use strict";e.exports=require("crypto")},82361:e=>{"use strict";e.exports=require("events")},57147:e=>{"use strict";e.exports=require("fs")},13685:e=>{"use strict";e.exports=require("http")},95687:e=>{"use strict";e.exports=require("https")},41808:e=>{"use strict";e.exports=require("net")},22037:e=>{"use strict";e.exports=require("os")},71017:e=>{"use strict";e.exports=require("path")},12781:e=>{"use strict";e.exports=require("stream")},24404:e=>{"use strict";e.exports=require("tls")},76224:e=>{"use strict";e.exports=require("tty")},57310:e=>{"use strict";e.exports=require("url")},73837:e=>{"use strict";e.exports=require("util")},59796:e=>{"use strict";e.exports=require("zlib")},58359:()=>{},93739:()=>{},66883:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>i.a,__next_app__:()=>x,originalPathname:()=>d,pages:()=>u,routeModule:()=>p,tree:()=>c}),r(24413),r(3588),r(69778),r(35866),r(32029);var s=r(23191),a=r(88716),n=r(37922),i=r.n(n),l=r(95231),o={};for(let e in l)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>l[e]);r.d(t,o);let c=["",{children:["(default)",{children:["chat",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,24413)),"/Users/gokulakrishnanr/Documents/zynoflix_ott/ott-web/src/app/(default)/chat/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,3588)),"/Users/gokulakrishnanr/Documents/zynoflix_ott/ott-web/src/app/(default)/layout.tsx"],loading:[()=>Promise.resolve().then(r.bind(r,69778)),"/Users/gokulakrishnanr/Documents/zynoflix_ott/ott-web/src/app/(default)/loading.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,35866,23)),"next/dist/client/components/not-found-error"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,73881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(r.bind(r,32029)),"/Users/gokulakrishnanr/Documents/zynoflix_ott/ott-web/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,35866,23)),"next/dist/client/components/not-found-error"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,73881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],u=["/Users/gokulakrishnanr/Documents/zynoflix_ott/ott-web/src/app/(default)/chat/page.tsx"],d="/(default)/chat/page",x={require:r,loadChunk:()=>Promise.resolve()},p=new s.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/(default)/chat/page",pathname:"/chat",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},6060:(e,t,r)=>{Promise.resolve().then(r.bind(r,11858))},39389:(e,t,r)=>{Promise.resolve().then(r.bind(r,85673))},35303:()=>{},35047:(e,t,r)=>{"use strict";var s=r(77389);r.o(s,"useRouter")&&r.d(t,{useRouter:function(){return s.useRouter}}),r.o(s,"useSearchParams")&&r.d(t,{useSearchParams:function(){return s.useSearchParams}})},11858:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>u});var s=r(10326),a=r(65783),n=r(43964),i=r(72018),l=r(35047);r(17577);var o=r(2994),c=r(85999);let u=()=>{let e=(0,l.useRouter)(),t=async()=>{let t=await i.Z.get("/chat/");return 200!==t.status&&c.Am.error(t.data.error),e.push("/chat/"+t?.data?.[0]?.roomId),t.data},{data:r,isLoading:u,isError:d,refetch:x}=(0,o.useQuery)("chat",()=>{t()});return u?s.jsx("div",{children:"Loading..."}):d?s.jsx("div",{children:"Error fetching messages"}):s.jsx("div",{children:s.jsx(n.a,{roomId:"23",children:s.jsx("div",{className:"",children:s.jsx("div",{className:"",children:s.jsx(a.default,{})})})})})}},85673:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>l});var s=r(10326),a=r(17577),n=r.n(a),i=r(2994);function l({children:e}){let[t]=n().useState(()=>new i.QueryClient);return s.jsx("div",{className:"bg-body text-white",children:s.jsx(i.QueryClientProvider,{client:t,children:e})})}},65783:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>m});var s=r(10326),a=r(72018),n=r(17577),i=r.n(n),l=r(2994),o=r(43964),c=r(34541),u=r(51223),d=r(46226),x=r(3236),p=r(40169);let h=async e=>(await a.Z.get("/message/"+e)).data,m=()=>{let[e,t]=i().useState(""),{roomId:r,socket:a,isOpen:n}=(0,o.R)(),{data:m,isLoading:f,isError:g,refetch:v}=(0,l.useQuery)(["message",r],()=>h(r),{refetchInterval:5e3}),w=()=>{let s=c.xS;a.emit("send-message",{content:e,roomId:r,sender:s}),t(""),v(),v()};return f?s.jsx("div",{children:"Loading..."}):g?s.jsx("div",{children:"Error fetching messages"}):(0,s.jsxs)("div",{className:(0,u.cn)("flex-1 flex flex-col w-full p-6 relative bg-gray-900 rounded-3xl mx-6"),children:[0===m.length&&s.jsx("div",{className:"flex items-center justify-center absolute top-[40%] left-[45%]",children:s.jsx("p",{className:"text-white",children:"No messages yet"})}),s.jsx(x.x,{className:(0,u.cn)("w-full h-[75vh]  mb-4",n?"hidden":"w-full"),children:s.jsx("div",{className:"w-full",children:m&&m?.map((e,t)=>s.jsx("div",{className:u.cn("col-end-8 p-3 rounded-lg",e.sender===c.xS?"col-start-6":"col-start-1"),children:s.jsxs("div",{className:u.cn("flex items-center gap-3",e.sender===c.xS?"flex-row-reverse":"flex-row"),children:[s.jsxs("div",{className:"flex items-center gap-3",children:[s.jsx("div",{className:"flex items-center gap-3",children:s.jsx(d.default,{className:"flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0",src:e?.userId?.profilePic,alt:"profile-pic",width:"30",height:"30"})}),s.jsx("div",{className:"relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl",children:s.jsx("div",{children:e.content})})]}),s.jsx("div",{className:"text-white",children:s.jsx("p",{children:p.lE(e.createdAt)})})]})},t))})}),(0,s.jsxs)("div",{className:(0,u.cn)("flex flex-row items-center h-16 rounded-xl bg-white w-full px-4",n?"lg:block hidden":"w-full lg:w-auto"),children:[s.jsx("div",{className:"flex-grow ml-4",children:s.jsx("div",{className:"relative w-full",children:s.jsx("input",{value:e,onKeyDown:e=>{"Enter"===e.key&&w()},onChange:e=>t(e.target.value),type:"text",className:"flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"})})}),s.jsx("div",{className:"ml-4",children:(0,s.jsxs)("button",{onClick:w,className:"flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0",children:[s.jsx("span",{children:"Send"}),s.jsx("span",{className:"ml-2",children:s.jsx("svg",{className:"w-4 h-4 transform rotate-45 -mt-px",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:s.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 19l9 2-9-18-9 18 9-2zm0 0v-8"})})})]})})]})]})}},43964:(e,t,r)=>{"use strict";r.d(t,{R:()=>u,a:()=>c});var s=r(10326),a=r(34541),n=r(17577),i=r.n(n),l=r(68848);let o=(0,n.createContext)({roomId:null,socket:null,isOpen:!1,setIsOpen:()=>{}}),c=({children:e,roomId:t})=>{let r=a.xS,[c,u]=i().useState(!1),[d,x]=(0,n.useState)(null);return(0,n.useEffect)(()=>{let e=(0,l.ZP)("https://chat.zynoflixott.com");return x(e),()=>{e.disconnect()}},[]),(0,n.useEffect)(()=>{d&&d.emit("join-room",{roomId:t,userId:[r,"666ff6eab2e260249caa5445"],name:"name"})},[d,t,r]),s.jsx(o.Provider,{value:{socket:d,roomId:t,isOpen:c,setIsOpen:u},children:e})},u=()=>{let e=(0,n.useContext)(o);if(!e)throw Error("useChat must be used within a ChatProvider");return e}},24413:(e,t,r)=>{"use strict";r.r(t),r.d(t,{$$typeof:()=>i,__esModule:()=>n,default:()=>l});var s=r(68570);let a=(0,s.createProxy)(String.raw`/Users/gokulakrishnanr/Documents/zynoflix_ott/ott-web/src/app/(default)/chat/page.tsx`),{__esModule:n,$$typeof:i}=a;a.default;let l=(0,s.createProxy)(String.raw`/Users/gokulakrishnanr/Documents/zynoflix_ott/ott-web/src/app/(default)/chat/page.tsx#default`)},3588:(e,t,r)=>{"use strict";r.r(t),r.d(t,{$$typeof:()=>i,__esModule:()=>n,default:()=>l});var s=r(68570);let a=(0,s.createProxy)(String.raw`/Users/gokulakrishnanr/Documents/zynoflix_ott/ott-web/src/app/(default)/layout.tsx`),{__esModule:n,$$typeof:i}=a;a.default;let l=(0,s.createProxy)(String.raw`/Users/gokulakrishnanr/Documents/zynoflix_ott/ott-web/src/app/(default)/layout.tsx#default`)},69778:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>c});var s=r(19510),a=r(55761),n=r(62386),i=r(29712),l=r(16636);r.n(l)().config(),console.log("http://localhost:8080","api"),i.Z.create({baseURL:"https://api.zynoflixott.com/api",headers:{"Content-Type":"application/json",Authorization:"Bearer null"}}),r(71159);let o=({className:e})=>(0,s.jsxs)("div",{role:"status",className:function(...e){return(0,n.m6)((0,a.W)(e))}(e,""),children:[(0,s.jsxs)("svg",{"aria-hidden":"true",className:"w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600",viewBox:"0 0 100 101",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[s.jsx("path",{d:"M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z",fill:"currentColor"}),s.jsx("path",{d:"M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z",fill:"currentFill"})]}),s.jsx("span",{className:"sr-only",children:"Loading..."})]}),c=()=>s.jsx("div",{className:"text-white",children:s.jsx(o,{className:"flex items-center justify-center mx-auto h-screen w-full"})})},73881:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>a});var s=r(66621);let a=e=>[{type:"image/x-icon",sizes:"16x16",url:(0,s.fillMetadataSegment)(".",e.params,"favicon.ico")+""}]}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[948,395,621,170,848,789],()=>r(66883));module.exports=s})();