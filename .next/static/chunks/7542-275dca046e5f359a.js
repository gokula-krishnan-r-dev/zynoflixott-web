"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7542],{6600:function(e,t,n){n.d(t,{Z:function(){return o}});/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let o=(0,n(8030).Z)("Bell",[["path",{d:"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",key:"1qo2s2"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}]])},7138:function(e,t,n){n.d(t,{default:function(){return r.a}});var o=n(231),r=n.n(o)},2988:function(e,t,n){n.d(t,{Z:function(){return o}});function o(){return(o=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)({}).hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}).apply(null,arguments)}},4052:function(e,t,n){n.d(t,{VY:function(){return K},h_:function(){return z},fC:function(){return W},xz:function(){return j}});var o=n(2988),r=n(2265),u=n.t(r,2);function a(e,t,{checkForDefaultPrevented:n=!0}={}){return function(o){if(null==e||e(o),!1===n||!o.defaultPrevented)return null==t?void 0:t(o)}}function l(...e){return(0,r.useCallback)(function(...e){return t=>e.forEach(e=>{"function"==typeof e?e(t):null!=e&&(e.current=t)})}(...e),e)}var c=n(2800),i=n(589),s=n(3311),p=n(1336);let d=u["useId".toString()]||(()=>void 0),f=0;var v=n(4696),h=n(6935),g=n(2297),m=n(5171),C=n(3355),P=n(5137),E=n(8369),O=n(9219);let _="Popover",[b,w]=function(e,t=[]){let n=[],o=()=>{let t=n.map(e=>(0,r.createContext)(e));return function(n){let o=(null==n?void 0:n[e])||t;return(0,r.useMemo)(()=>({[`__scope${e}`]:{...n,[e]:o}}),[n,o])}};return o.scopeName=e,[function(t,o){let u=(0,r.createContext)(o),a=n.length;function l(t){let{scope:n,children:o,...l}=t,c=(null==n?void 0:n[e][a])||u,i=(0,r.useMemo)(()=>l,Object.values(l));return(0,r.createElement)(c.Provider,{value:i},o)}return n=[...n,o],l.displayName=t+"Provider",[l,function(n,l){let c=(null==l?void 0:l[e][a])||u,i=(0,r.useContext)(c);if(i)return i;if(void 0!==o)return o;throw Error(`\`${n}\` must be used within \`${t}\``)}]},function(...e){let t=e[0];if(1===e.length)return t;let n=()=>{let n=e.map(e=>({useScope:e(),scopeName:e.scopeName}));return function(e){let o=n.reduce((t,{useScope:n,scopeName:o})=>{let r=n(e)[`__scope${o}`];return{...t,...r}},{});return(0,r.useMemo)(()=>({[`__scope${t.scopeName}`]:o}),[o])}};return n.scopeName=t.scopeName,n}(o,...t)]}(_,[v.D7]),F=(0,v.D7)(),[R,D]=b(_),k=(0,r.forwardRef)((e,t)=>{let{__scopePopover:n,...u}=e,c=D("PopoverTrigger",n),i=F(n),s=l(t,c.triggerRef),p=(0,r.createElement)(m.WV.button,(0,o.Z)({type:"button","aria-haspopup":"dialog","aria-expanded":c.open,"aria-controls":c.contentId,"data-state":$(c.open)},u,{ref:s,onClick:a(e.onClick,c.onOpenToggle)}));return c.hasCustomAnchor?p:(0,r.createElement)(v.ee,(0,o.Z)({asChild:!0},i),p)}),x="PopoverPortal",[y,A]=b(x,{forceMount:void 0}),M="PopoverContent",Z=(0,r.forwardRef)((e,t)=>{let n=A(M,e.__scopePopover),{forceMount:u=n.forceMount,...a}=e,l=D(M,e.__scopePopover);return(0,r.createElement)(g.z,{present:u||l.open},l.modal?(0,r.createElement)(N,(0,o.Z)({},a,{ref:t})):(0,r.createElement)(I,(0,o.Z)({},a,{ref:t})))}),N=(0,r.forwardRef)((e,t)=>{let n=D(M,e.__scopePopover),u=(0,r.useRef)(null),c=l(t,u),i=(0,r.useRef)(!1);return(0,r.useEffect)(()=>{let e=u.current;if(e)return(0,E.Ry)(e)},[]),(0,r.createElement)(O.Z,{as:C.g7,allowPinchZoom:!0},(0,r.createElement)(S,(0,o.Z)({},e,{ref:c,trapFocus:n.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:a(e.onCloseAutoFocus,e=>{var t;e.preventDefault(),i.current||null===(t=n.triggerRef.current)||void 0===t||t.focus()}),onPointerDownOutside:a(e.onPointerDownOutside,e=>{let t=e.detail.originalEvent,n=0===t.button&&!0===t.ctrlKey,o=2===t.button||n;i.current=o},{checkForDefaultPrevented:!1}),onFocusOutside:a(e.onFocusOutside,e=>e.preventDefault(),{checkForDefaultPrevented:!1})})))}),I=(0,r.forwardRef)((e,t)=>{let n=D(M,e.__scopePopover),u=(0,r.useRef)(!1),a=(0,r.useRef)(!1);return(0,r.createElement)(S,(0,o.Z)({},e,{ref:t,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:t=>{var o,r;null===(o=e.onCloseAutoFocus)||void 0===o||o.call(e,t),t.defaultPrevented||(u.current||null===(r=n.triggerRef.current)||void 0===r||r.focus(),t.preventDefault()),u.current=!1,a.current=!1},onInteractOutside:t=>{var o,r;null===(o=e.onInteractOutside)||void 0===o||o.call(e,t),t.defaultPrevented||(u.current=!0,"pointerdown"!==t.detail.originalEvent.type||(a.current=!0));let l=t.target;(null===(r=n.triggerRef.current)||void 0===r?void 0:r.contains(l))&&t.preventDefault(),"focusin"===t.detail.originalEvent.type&&a.current&&t.preventDefault()}}))}),S=(0,r.forwardRef)((e,t)=>{let{__scopePopover:n,trapFocus:u,onOpenAutoFocus:a,onCloseAutoFocus:l,disableOutsidePointerEvents:p,onEscapeKeyDown:d,onPointerDownOutside:f,onFocusOutside:h,onInteractOutside:g,...m}=e,C=D(M,n),P=F(n);return(0,i.EW)(),(0,r.createElement)(s.M,{asChild:!0,loop:!0,trapped:u,onMountAutoFocus:a,onUnmountAutoFocus:l},(0,r.createElement)(c.XB,{asChild:!0,disableOutsidePointerEvents:p,onInteractOutside:g,onEscapeKeyDown:d,onPointerDownOutside:f,onFocusOutside:h,onDismiss:()=>C.onOpenChange(!1)},(0,r.createElement)(v.VY,(0,o.Z)({"data-state":$(C.open),role:"dialog",id:C.contentId},P,m,{ref:t,style:{...m.style,"--radix-popover-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-popover-content-available-width":"var(--radix-popper-available-width)","--radix-popover-content-available-height":"var(--radix-popper-available-height)","--radix-popover-trigger-width":"var(--radix-popper-anchor-width)","--radix-popover-trigger-height":"var(--radix-popper-anchor-height)"}}))))});function $(e){return e?"open":"closed"}let W=e=>{let{__scopePopover:t,children:n,open:o,defaultOpen:u,onOpenChange:a,modal:l=!1}=e,c=F(t),i=(0,r.useRef)(null),[s,h]=(0,r.useState)(!1),[g=!1,m]=function({prop:e,defaultProp:t,onChange:n=()=>{}}){let[o,u]=function({defaultProp:e,onChange:t}){let n=(0,r.useState)(e),[o]=n,u=(0,r.useRef)(o),a=(0,P.W)(t);return(0,r.useEffect)(()=>{u.current!==o&&(a(o),u.current=o)},[o,u,a]),n}({defaultProp:t,onChange:n}),a=void 0!==e,l=a?e:o,c=(0,P.W)(n);return[l,(0,r.useCallback)(t=>{if(a){let n="function"==typeof t?t(e):t;n!==e&&c(n)}else u(t)},[a,e,u,c])]}({prop:o,defaultProp:u,onChange:a});return(0,r.createElement)(v.fC,c,(0,r.createElement)(R,{scope:t,contentId:function(e){let[t,n]=r.useState(d());return(0,p.b)(()=>{n(e=>null!=e?e:String(f++))},[void 0]),t?`radix-${t}`:""}(),triggerRef:i,open:g,onOpenChange:m,onOpenToggle:(0,r.useCallback)(()=>m(e=>!e),[m]),hasCustomAnchor:s,onCustomAnchorAdd:(0,r.useCallback)(()=>h(!0),[]),onCustomAnchorRemove:(0,r.useCallback)(()=>h(!1),[]),modal:l},n))},j=k,z=e=>{let{__scopePopover:t,forceMount:n,children:o,container:u}=e,a=D(x,t);return(0,r.createElement)(y,{scope:t,forceMount:n},(0,r.createElement)(g.z,{present:n||a.open},(0,r.createElement)(h.h,{asChild:!0,container:u},o)))},K=Z}}]);