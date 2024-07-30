"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6280],{7138:function(e,t,o){o.d(t,{default:function(){return l.a}});var a=o(231),l=o.n(a)},7309:function(e,t,o){o.r(t),o.d(t,{default:function(){return v}});var a=o(7437),l=o(8378),s=o(7222),n=o(6690),c=o(9779),i=o(3711),r=o(9354);/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let d=(0,o(8030).Z)("Heart",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]]);var u=o(6648),h=o(7138),m=o(6463),x=o(2265),p=o(9555),f=o(7776);let g=async()=>{let e=await l.Z.get("/watch-later",{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(localStorage.getItem("accessToken"))}});if(200!==e.status)throw Error("Error loading watch later list");return e.data};var v=e=>{var t,o,v;let{video:j,index:w,hiddenNew:N}=e,[b,y]=(0,x.useState)(null),{data:_,isLoading:M,refetch:k}=(0,p.useQuery)("watch-later",g),E=(0,m.useRouter)(),A=async e=>{if(i.bg){f.Am.warning("You need to login to add comment. Please login to add comment"),E.push("/login");return}200!==(await l.Z.post("/watch-later/".concat(e),{video_id:e},{headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(localStorage.getItem("accessToken"))}})).status&&f.Am.error(" Login to add video to watch later list"),k(),f.Am.success("Video added to watch later list")},T="string"==typeof(null==j?void 0:j.language[0])?j.language[0].split(",")[0]:"Unknown";return(0,a.jsx)("div",{className:"relative w-[180px] lg:w-[219px] h-full ",onMouseEnter:()=>y(w),onMouseLeave:()=>y(null),children:(0,a.jsxs)("div",{className:"h-auto",children:[(0,a.jsx)("button",{onClick:()=>A(j._id),className:"absolute top-2 lg:top-4 z-50 right-2 lg:right-4",children:(0,a.jsx)(d,{className:"text-red-500",size:24,fill:(null==_?void 0:_.some(e=>e.video_id===j._id))?"fill":"none",stroke:"red",color:(null==_?void 0:_.some(e=>e.video_id===j._id))?"red":"white"})}),!N&&(0,a.jsx)("div",{className:"absolute top-2 lg:top-2 z-50 left-2 lg:left-2",children:(0,a.jsxs)("div",{className:"border-cut shadow-2xl flex items-center flex-col rounded-t-md bg-[#00ffff] px-1  lg:px-2 py-2 lg:py-3",children:[(0,a.jsx)("span",{className:"text-black text-xs lg:text-sm font-bold",children:"NEW"}),(0,a.jsx)("span",{className:"text-black text-[10px] lg:text-xs font-extrabold",children:j.certification})]})}),(0,a.jsxs)(h.default,{href:"/video/".concat(null==j?void 0:j._id),className:"",children:[(0,a.jsx)("div",{className:"duration-300",children:(0,a.jsxs)("div",{className:"relative",children:[b===w?(0,a.jsxs)("video",{preload:"auto",playsInline:!0,autoPlay:!0,loop:!0,muted:!0,poster:(0,n._)(j.processedImages.medium.path),className:(0,r.cn)("object-cover rounded-xl ",s.y),controls:!1,children:[(0,a.jsx)("source",{src:j.preview_video,type:"video/mp4"}),"Your browser does not support the video tag."]}):(0,a.jsx)(u.default,{className:(0,r.cn)("rounded-xl object-cover",s.y),src:(0,n._)(j.processedImages.medium.path),alt:j.title,width:310,height:194}),(0,a.jsx)("div",{className:"video-overlay !opacity-45"}),(0,a.jsx)("div",{className:(0,r.cn)("absolute bottom-3 left-0 right-0"),children:(0,a.jsxs)("div",{className:"px-2",children:[(0,a.jsxs)("div",{className:"flex items-center",children:[(0,a.jsx)("div",{className:"bg-red-500 w-8 rounded-3xl h-1 rotate-90"}),(0,a.jsx)("h5",{className:"lg:text-xs text-[10px] font-bold uppercase",children:j.category})]}),(0,a.jsx)("h1",{className:"line-clamp-1 text-sm mt-3 font-bold",children:j.title})]})})]})}),(0,a.jsxs)("div",{className:"",children:[(0,a.jsxs)("div",{className:"flex items-center mt-2 gap-4",children:[(0,a.jsx)("img",{className:"lg:w-10 lg:h-10 h-7 w-7 rounded-full",src:null==j?void 0:null===(t=j.user)||void 0===t?void 0:t.profilePic,alt:null==j?void 0:null===(o=j.user)||void 0===o?void 0:o.full_name}),(0,a.jsxs)("div",{className:"font-medium dark:text-white",children:[(0,a.jsx)("div",{className:"lg:text-sm line-clamp-1 text-xs ",children:null==j?void 0:null===(v=j.user)||void 0===v?void 0:v.full_name}),(0,a.jsxs)("div",{className:"text-sm text-gray-500 dark:text-gray-400",children:[j.followerCount," followers"]})]})]}),(0,a.jsxs)("div",{className:"text-white capitalize gap-1 lg:gap-2 pt-2 flex flex-wrap text-[10px] lg:text-xs font-bold",children:[(0,a.jsx)("span",{children:T})," ",(0,a.jsx)("span",{children:"|"})," ",(0,a.jsx)("span",{children:(0,c.iB)(null==j?void 0:j.duration,!0)})," ",(0,a.jsx)("span",{children:"|"}),(0,a.jsx)("span",{className:"text-xs font-bold",children:(0,c.lE)(null==j?void 0:j.createdAt)})]})]})]})]})},w)}},7222:function(e,t,o){o.d(t,{q:function(){return l},y:function(){return a}});let a=" lg:h-[275px] h-[250px] w-[180px] lg:w-[219px]",l="rzp_test_6ekQHQJiqUSuBF"},6690:function(e,t,o){o.d(t,{_:function(){return a}});function a(e){return"https://etubees.s3.us-east-1.amazonaws.com/thumbnail_ott/compressed/".concat(e)}},9779:function(e,t,o){function a(e){e instanceof Date||console.log("publishedAt is not a Date object");let t=new Date(e),o=Math.floor((Date.now()-t.getTime())/1e3);return o<60?"".concat(o," sec ago"):o<3600?"".concat(Math.floor(o/60)," min ago"):o<86400?"".concat(Math.floor(o/3600)," hour ago"):o<2592e3?"".concat(Math.floor(o/86400)," day ago"):"".concat(Math.floor(o/2592e3)," month ago")}function l(e,t){if(e<0)throw Error("Negative values are not allowed.");let o=Math.round(60*e),a=Math.floor(o/3600),l=o%3600,s=Math.floor(l/60),n=l%60;if(t)return e<1?"".concat(o," second").concat(1!==o?"s":""):"".concat(Math.round(e)," min").concat(1!==Math.round(e)?"s":"");let c="";return a>0&&(c+="".concat(a," hour").concat(a>1?"s":""),(s>0||n>0)&&(c+=" ")),s>0&&(c+="".concat(s," min").concat(s>1?"s":""),n>0&&(c+=" ")),(n>0||""===c)&&(c+="".concat(n," second").concat(n>1?"s":"")),c}function s(e){let t=new Date(e);isNaN(t.getTime())&&console.log("isMembership",t),console.log("isMembership",t);let o=new Date().getTime()-t.getTime();console.log("isMembership",o);let a=o/864e5;return console.log("isMembership",a),a>=30}o.d(t,{Eb:function(){return s},iB:function(){return l},lE:function(){return a}})}}]);