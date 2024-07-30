(()=>{var e={};e.id=665,e.ids=[665],e.modules={47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},39491:e=>{"use strict";e.exports=require("assert")},6113:e=>{"use strict";e.exports=require("crypto")},82361:e=>{"use strict";e.exports=require("events")},57147:e=>{"use strict";e.exports=require("fs")},13685:e=>{"use strict";e.exports=require("http")},95687:e=>{"use strict";e.exports=require("https")},22037:e=>{"use strict";e.exports=require("os")},71017:e=>{"use strict";e.exports=require("path")},12781:e=>{"use strict";e.exports=require("stream")},76224:e=>{"use strict";e.exports=require("tty")},57310:e=>{"use strict";e.exports=require("url")},73837:e=>{"use strict";e.exports=require("util")},59796:e=>{"use strict";e.exports=require("zlib")},75485:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>n.a,__next_app__:()=>m,originalPathname:()=>u,pages:()=>d,routeModule:()=>x,tree:()=>c}),s(63272),s(35866),s(32029);var r=s(23191),a=s(88716),o=s(37922),n=s.n(o),i=s(95231),l={};for(let e in i)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>i[e]);s.d(t,l);let c=["",{children:["(auth)",{children:["login",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,63272)),"/Users/gokulakrishnanr/Documents/zynoflix_ott/ott-web/src/app/(auth)/login/page.tsx"]}]},{}]},{"not-found":[()=>Promise.resolve().then(s.t.bind(s,35866,23)),"next/dist/client/components/not-found-error"],metadata:{icon:[async e=>(await Promise.resolve().then(s.bind(s,73881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(s.bind(s,32029)),"/Users/gokulakrishnanr/Documents/zynoflix_ott/ott-web/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,35866,23)),"next/dist/client/components/not-found-error"],metadata:{icon:[async e=>(await Promise.resolve().then(s.bind(s,73881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],d=["/Users/gokulakrishnanr/Documents/zynoflix_ott/ott-web/src/app/(auth)/login/page.tsx"],u="/(auth)/login/page",m={require:s,loadChunk:()=>Promise.resolve()},x=new r.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/(auth)/login/page",pathname:"/login",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},4393:(e,t,s)=>{Promise.resolve().then(s.bind(s,89554))},35047:(e,t,s)=>{"use strict";var r=s(77389);s.o(r,"useRouter")&&s.d(t,{useRouter:function(){return r.useRouter}}),s.o(r,"useSearchParams")&&s.d(t,{useSearchParams:function(){return r.useSearchParams}})},89554:(e,t,s)=>{"use strict";s.d(t,{default:()=>l});var r=s(10326),a=s(72018),o=s(35047),n=s(17577),i=s(85999);let l=({mode:e})=>{(0,o.useRouter)();let t={full_name:"signup"===e?"":void 0,email:"",password:"",confirmPassword:"signup"===e?"":void 0,contact:"signup"===e?"":void 0},[s,l]=(0,n.useState)(t),[c,d]=(0,n.useState)({full_name:"",email:"",password:"",confirmPassword:"",contact:""}),[u,m]=(0,n.useState)(!1);(0,n.useEffect)(()=>{l(t)},[e]);let x=e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)?"":"Invalid email address",p=e=>e.length>=6?"":"Password must be at least 6 characters",f=(e,t)=>e===t?"":"Passwords do not match",h=e=>e&&/^\d{10}$/.test(e)?"":"Invalid phone number",g=e=>{let{name:t,value:r}=e.target;l({...s,[t]:r})},w=async t=>{t.preventDefault();let r=x(s.email),o=p(s.password),n="signup"===e?f(s.password,s.confirmPassword):"",l="signup"===e?h(s.contact):"";if(r||o||n||l){d({full_name:"",email:r,password:o,confirmPassword:n,contact:l});return}d({email:"",password:"",confirmPassword:"",contact:"",full_name:""}),m(!0);try{let t=await a.Z.post(`/auth/${e}`,s);if(console.log(t.data),401===t.data.code){i.Am.error("Invalid password provided for login");return}if("User already exists"===t.data.error){i.Am.error("User already exists with the provided email so please login instead");return}if(console.log(t.data.errro),"User not found"===t.data.error){i.Am.error("User not found or invalid password provided for login");return}try{localStorage.setItem("accessToken",t.data.accessToken),localStorage.setItem("userId",t.data.user._id),localStorage.setItem("userRole",t.data.isProduction?"production":"user"),localStorage.setItem("isLogin","true")}catch(e){i.Am.error("Failed to save access token to local storage")}i.Am.success(`${"login"===e?"Login":"Signup"} form submitted`),window.location.href="/"}catch(e){console.error("Submission error",e),i.Am.error("Failed to submit form please try again")}finally{m(!1)}};return r.jsx("div",{className:"w-full text-white max-w-md mx-auto",children:(0,r.jsxs)("form",{onSubmit:w,noValidate:!0,children:["signup"===e&&(0,r.jsxs)("div",{className:"mb-4",children:[r.jsx("input",{className:`w-full px-8 py-4 rounded-lg font-medium  border-2 bg-transparent ${c.full_name?"border-red-500":"border-gray-200"} placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`,type:"text",name:"full_name",value:s.full_name,onChange:g,placeholder:"Full Name"}),c.full_name&&r.jsx("p",{className:"text-red-500 text-xs mt-2",children:c.full_name})]}),(0,r.jsxs)("div",{className:"mb-4",children:[r.jsx("input",{className:`w-full px-8 py-4 rounded-lg font-medium  bg-transparent  border-2 ${c.email?"border-red-500":"border-gray-200"} text-sm focus:outline-none `,type:"email",name:"email",value:s.email,onChange:g,placeholder:"Email"}),c.email&&r.jsx("p",{className:"text-red-500 text-xs mt-2",children:c.email})]}),(0,r.jsxs)("div",{className:"mb-4",children:[r.jsx("input",{className:`w-full px-8 py-4 rounded-lg font-medium bg-transparent  border-2 ${c.password?"border-red-500":"border-gray-200"}  text-sm focus:outline-none  mt-5`,type:"password",name:"password",value:s.password,onChange:g,placeholder:"Password"}),c.password&&r.jsx("p",{className:"text-red-500 text-xs mt-2",children:c.password})]}),"signup"===e&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)("div",{className:"mb-4",children:[r.jsx("input",{className:`w-full px-8 py-4 rounded-lg font-medium  border-2 bg-transparent ${c.confirmPassword?"border-red-500":"border-gray-200"}  text-sm focus:outline-none  mt-5`,type:"password",name:"confirmPassword",value:s.confirmPassword,onChange:g,placeholder:"Confirm Password"}),c.confirmPassword&&r.jsx("p",{className:"text-red-500 text-xs mt-2",children:c.confirmPassword})]}),(0,r.jsxs)("div",{className:"mb-4",children:[r.jsx("input",{className:`w-full px-8 py-4 rounded-lg font-medium  border-2 bg-transparent ${c.contact?"border-red-500":"border-gray-200"}  text-sm focus:outline-none  mt-5`,type:"tel",name:"contact",value:s.contact,onChange:g,placeholder:"Phone Number"}),c.contact&&r.jsx("p",{className:"text-red-500 text-xs mt-2",children:c.contact})]})]}),r.jsx("button",{className:"mt-5 tracking-wide font-semibold bg-green-500 text-black w-full py-4 rounded-lg hover:bg-green-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none",type:"submit",disabled:u,children:u?(0,r.jsxs)("svg",{className:"w-6 h-6 animate-spin",fill:"none",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:[r.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),r.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0l4 4-4 4V5a7 7 0 100 14v-3l4 4-4 4v-2a8 8 0 01-8-8z"})]}):(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)("svg",{className:"w-6 h-6 -ml-2",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round",children:[r.jsx("path",{d:"M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"}),r.jsx("circle",{cx:"8.5",cy:7,r:4}),r.jsx("path",{d:"M20 8v6M23 11h-6"})]}),r.jsx("span",{className:"ml-3",children:"login"===e?"Login":"Sign Up"})]})})]})})}},63272:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>o});var r=s(19510),a=s(39185);s(71159);let o=()=>r.jsx("div",{children:(0,r.jsxs)("div",{className:"min-h-screen text-gray-900 flex justify-center relative",children:[r.jsx("div",{className:"hero-bg-gradient "}),r.jsx("div",{className:"max-w-screen-xl   z-50 m-0 sm:m-10 rounded-3xl flex justify-center flex-1 ",children:r.jsx("div",{className:"lg:w-1/2 xl:w-5/12 p-6  rounded-3xl sm:p-12",children:(0,r.jsxs)("div",{className:"mt-12 flex flex-col items-center",children:[r.jsx("h1",{className:"text-2xl xl:text-3xl font-extrabold text-white",children:"Login"}),(0,r.jsxs)("div",{className:"w-full flex-1 mt-8",children:[r.jsx("div",{className:"flex flex-col items-center",children:(0,r.jsxs)("button",{className:"w-full max-w-xs font-bold shadow-sm rounded-lg py-3   bg-indigo-100 text-gray-800   border-0 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline",children:[r.jsx("div",{className:" p-2 rounded-full",children:(0,r.jsxs)("svg",{className:"w-4",viewBox:"0 0 533.5 544.3",children:[r.jsx("path",{d:"M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z",fill:"#4285f4"}),r.jsx("path",{d:"M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z",fill:"#34a853"}),r.jsx("path",{d:"M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z",fill:"#fbbc04"}),r.jsx("path",{d:"M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z",fill:"#ea4335"})]})}),r.jsx("span",{className:"ml-4",children:"Sign Up with Google"})]})}),r.jsx("div",{className:"my-12 text-center",children:r.jsx("div",{className:"leading-none px-2 inline-block text-sm text-gray-100 tracking-wide font-medium transform translate-y-1/2",children:"Or sign up with e-mail"})}),(0,r.jsxs)("div",{className:"mx-auto max-w-xs",children:[r.jsx(a.ZP,{mode:"login"}),(0,r.jsxs)("p",{className:"mt-6 text-xs text-gray-100 text-center",children:["I agree to abide by templatanas",r.jsx("a",{href:"#",className:"border-b border-gray-500 border-dotted",children:"Terms of Service"}),"and its",r.jsx("a",{href:"#",className:"border-b border-gray-500 border-dotted",children:"Privacy Policy"})]})]}),(0,r.jsxs)("div",{className:"flex mt-3 text-sm justify-center text-white text-center items-center",children:[r.jsx("span",{children:"create new Account "}),r.jsx("a",{href:"/signup",className:"text-indigo-400 ml-2",children:"Signup"})]})]})]})})})]})})},39185:(e,t,s)=>{"use strict";s.d(t,{ZP:()=>i});var r=s(68570);let a=(0,r.createProxy)(String.raw`/Users/gokulakrishnanr/Documents/zynoflix_ott/ott-web/src/components/form/signup-form.tsx`),{__esModule:o,$$typeof:n}=a;a.default;let i=(0,r.createProxy)(String.raw`/Users/gokulakrishnanr/Documents/zynoflix_ott/ott-web/src/components/form/signup-form.tsx#default`)},73881:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>a});var r=s(66621);let a=e=>[{type:"image/x-icon",sizes:"16x16",url:(0,r.fillMetadataSegment)(".",e.params,"favicon.ico")+""}]}};var t=require("../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[948,395,621,789],()=>s(75485));module.exports=r})();