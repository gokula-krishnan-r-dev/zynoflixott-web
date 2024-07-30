"use strict";exports.id=45,exports.ids=[45,345],exports.modules={35047:(e,t,s)=>{var a=s(77389);s.o(a,"useRouter")&&s.d(t,{useRouter:function(){return a.useRouter}}),s.o(a,"useSearchParams")&&s.d(t,{useSearchParams:function(){return a.useSearchParams}})},62045:(e,t,s)=>{s.r(t),s.d(t,{default:()=>j});var a=s(10326),l=s(72018),r=s(51354),o=s(10330),i=s(40169),d=s(34541),c=s(51223);/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let n=(0,s(62881).Z)("Heart",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]]);var x=s(46226),u=s(90434),m=s(35047),h=s(17577),p=s(2994),g=s(85999);let f=async()=>{let e=await l.Z.get("/watch-later",{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Bearer false"}});if(200!==e.status)throw Error("Error loading watch later list");return e.data},j=({video:e,index:t,hiddenNew:s})=>{let[j,v]=(0,h.useState)(null),{data:N,isLoading:w,refetch:y}=(0,p.useQuery)("watch-later",f),b=(0,m.useRouter)(),_=async e=>{if(d.bg){g.Am.warning("You need to login to add comment. Please login to add comment"),b.push("/login");return}200!==(await l.Z.post(`/watch-later/${e}`,{video_id:e},{headers:{"Content-Type":"application/json",Authorization:"Bearer false"}})).status&&g.Am.error(" Login to add video to watch later list"),y(),g.Am.success("Video added to watch later list")},k="string"==typeof e?.language[0]?e.language[0].split(",")[0]:"Unknown";return a.jsx("div",{className:"relative w-[180px] lg:w-[219px] h-full ",onMouseEnter:()=>v(t),onMouseLeave:()=>v(null),children:(0,a.jsxs)("div",{className:"h-auto",children:[a.jsx("button",{onClick:()=>_(e._id),className:"absolute top-2 lg:top-4 z-50 right-2 lg:right-4",children:a.jsx(n,{className:"text-red-500",size:24,fill:N?.some(t=>t.video_id===e._id)?"fill":"none",stroke:"red",color:N?.some(t=>t.video_id===e._id)?"red":"white"})}),!s&&a.jsx("div",{className:"absolute top-2 lg:top-2 z-50 left-2 lg:left-2",children:(0,a.jsxs)("div",{className:"border-cut shadow-2xl flex items-center flex-col rounded-t-md bg-[#00ffff] px-1  lg:px-2 py-2 lg:py-3",children:[a.jsx("span",{className:"text-black text-xs lg:text-sm font-bold",children:"NEW"}),a.jsx("span",{className:"text-black text-[10px] lg:text-xs font-extrabold",children:e.certification})]})}),(0,a.jsxs)(u.default,{href:`/video/${e?._id}`,className:"",children:[a.jsx("div",{className:"duration-300",children:(0,a.jsxs)("div",{className:"relative",children:[j===t?(0,a.jsxs)("video",{preload:"auto",playsInline:!0,autoPlay:!0,loop:!0,muted:!0,poster:(0,o._)(e.processedImages.medium.path),className:(0,c.cn)("object-cover rounded-xl ",r.y),controls:!1,children:[a.jsx("source",{src:e.preview_video,type:"video/mp4"}),"Your browser does not support the video tag."]}):a.jsx(x.default,{className:(0,c.cn)("rounded-xl object-cover",r.y),src:(0,o._)(e.processedImages.medium.path),alt:e.title,width:310,height:194}),a.jsx("div",{className:"video-overlay !opacity-45"}),a.jsx("div",{className:(0,c.cn)("absolute bottom-3 left-0 right-0"),children:(0,a.jsxs)("div",{className:"px-2",children:[(0,a.jsxs)("div",{className:"flex items-center",children:[a.jsx("div",{className:"bg-red-500 w-8 rounded-3xl h-1 rotate-90"}),a.jsx("h5",{className:"lg:text-xs text-[10px] font-bold uppercase",children:e.category})]}),a.jsx("h1",{className:"line-clamp-1 text-sm mt-3 font-bold",children:e.title})]})})]})}),(0,a.jsxs)("div",{className:"",children:[(0,a.jsxs)("div",{className:"flex items-center mt-2 gap-4",children:[a.jsx("img",{className:"lg:w-10 lg:h-10 h-7 w-7 rounded-full",src:e?.user?.profilePic,alt:e?.user?.full_name}),(0,a.jsxs)("div",{className:"font-medium dark:text-white",children:[a.jsx("div",{className:"lg:text-sm line-clamp-1 text-xs ",children:e?.user?.full_name}),(0,a.jsxs)("div",{className:"text-sm text-gray-500 dark:text-gray-400",children:[e.followerCount," followers"]})]})]}),(0,a.jsxs)("div",{className:"text-white capitalize gap-1 lg:gap-2 pt-2 flex flex-wrap text-[10px] lg:text-xs font-bold",children:[a.jsx("span",{children:k})," ",a.jsx("span",{children:"|"})," ",a.jsx("span",{children:(0,i.iB)(e?.duration,!0)})," ",a.jsx("span",{children:"|"}),a.jsx("span",{className:"text-xs font-bold",children:(0,i.lE)(e?.createdAt)})]})]})]})]})},t)}},51354:(e,t,s)=>{s.d(t,{q:()=>l,y:()=>a});let a=" lg:h-[275px] h-[250px] w-[180px] lg:w-[219px]",l="rzp_test_6ekQHQJiqUSuBF"}};