"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8966,3294],{3274:function(t,e,i){i.d(e,{E:function(){return r},t:function(){return h}});var s=i(1001),a=i(2938);function h(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3e3,i=(0,s.f)();return setTimeout(()=>{let e=t();e&&i.reject(e)},e),i}class r{get iframe(){return this.Mb}setup(){(0,s.l)(window,"message",this.Yi.bind(this)),(0,s.l)(this.Mb,"load",this.hd.bind(this)),(0,s.e)(this.Nb.bind(this))}Nb(){let t=this.tc();if(!t.length){this.Mb.setAttribute("src","");return}let e=(0,s.p)(()=>this.ng());this.Mb.setAttribute("src",(0,a.c)(t,e))}te(t,e){var i;a.I||null===(i=this.Mb.contentWindow)||void 0===i||i.postMessage(JSON.stringify(t),null!=e?e:"*")}Yi(t){var e;let i=this.Ob();if((null===t.source||t.source===(null===(e=this.Mb)||void 0===e?void 0:e.contentWindow))&&(!(0,s.i)(i)||i===t.origin)){try{let e=JSON.parse(t.data);e&&this.ue(e,t);return}catch(t){}t.data&&this.ue(t.data,t)}}constructor(t){this.Mb=t,this.tc=(0,s.s)(""),this.referrerPolicy=null,t.setAttribute("frameBorder","0"),t.setAttribute("aria-hidden","true"),t.setAttribute("allow","autoplay; fullscreen; encrypted-media; picture-in-picture; accelerometer; gyroscope"),null!==this.referrerPolicy&&t.setAttribute("referrerpolicy",this.referrerPolicy)}}},3294:function(t,e,i){i.d(e,{getVimeoVideoInfo:function(){return n},resolveVimeoVideoId:function(){return r}});let s=/(?:https:\/\/)?(?:player\.)?vimeo(?:\.com)?\/(?:video\/)?(\d+)(?:\?hash=(.*))?/,a=new Map,h=new Map;function r(t){let e=t.match(s);return{videoId:null==e?void 0:e[1],hash:null==e?void 0:e[2]}}async function n(t,e){if(a.has(t))return a.get(t);if(h.has(t))return h.get(t);let i="https://vimeo.com/api/oembed.json?url=https://player.vimeo.com/video/".concat(t),s=window.fetch(i,{mode:"cors",signal:e.signal}).then(t=>t.json()).then(e=>{var i,s,h,r;let n=null==e?void 0:null===(s=e.thumbnail_url)||void 0===s?void 0:null===(i=s.match(/vimeocdn.com\/video\/(.*)?_/))||void 0===i?void 0:i[1],l={title:null!==(h=null==e?void 0:e.title)&&void 0!==h?h:"",duration:null!==(r=null==e?void 0:e.duration)&&void 0!==r?r:0,poster:n?"https://i.vimeocdn.com/video/".concat(n,"_1920x1080.webp"):"",pro:"basic"!==e.account_type};return a.set(t,l),l}).finally(()=>h.delete(t));return h.set(t,s),s}},8966:function(t,e,i){i.r(e),i.d(e,{VimeoProvider:function(){return l}});var s=i(1001),a=i(2938),h=i(3274),r=i(3294);i(2265);let n=["bufferend","bufferstart","durationchange","ended","enterpictureinpicture","error","fullscreenchange","leavepictureinpicture","loaded","playProgress","loadProgress","pause","play","playbackratechange","qualitychange","seeked","seeking","timeupdate","volumechange","waiting"];class l extends h.E{get c(){return this.b.delegate.c}get type(){return"vimeo"}get currentSrc(){return this.L}get videoId(){return this.ia()}get hash(){return this.we}get isPro(){return this.uc()}preconnect(){(0,a.p)(this.Ob())}setup(){super.setup(),(0,s.e)(this.xe.bind(this)),(0,s.e)(this._i.bind(this)),(0,s.e)(this.$i.bind(this)),this.c("provider-setup",this)}destroy(){this.A(),this.u("destroy")}async play(){let{paused:t}=this.b.$state;return this.J||(this.J=(0,h.t)(()=>{if(this.J=null,t())return"Timed out."}),this.u("play")),this.J.promise}async pause(){let{paused:t}=this.b.$state;return this.S||(this.S=(0,h.t)(()=>{if(this.S=null,!t())return"Timed out."}),this.u("pause")),this.S.promise}setMuted(t){this.u("setMuted",t)}setCurrentTime(t){this.u("seekTo",t),this.c("seeking",t)}setVolume(t){this.u("setVolume",t),this.u("setMuted",(0,s.p)(this.b.$state.muted))}setPlaybackRate(t){this.u("setPlaybackRate",t)}async loadSource(t){if(!(0,s.i)(t.src)){this.L=null,this.we=null,this.ia.set("");return}let{videoId:e,hash:i}=(0,r.resolveVimeoVideoId)(t.src);this.ia.set(null!=e?e:""),this.we=null!=i?i:null,this.L=t}xe(){this.A();let t=this.ia();if(!t){this.tc.set("");return}this.tc.set("".concat(this.Ob(),"/video/").concat(t)),this.c("load-start")}_i(){let t=this.ia();if(!t)return;let e=(0,s.f)(),i=new AbortController;return this.ve=e,(0,r.getVimeoVideoInfo)(t,i).then(t=>{e.resolve(t)}).catch(t=>{e.reject()}),()=>{e.reject(),i.abort()}}$i(){let t=this.uc(),{$state:e,qualities:i}=this.b;if(e.canSetPlaybackRate.set(t),i[a.L.Pd](!t),t)return(0,s.l)(i,"change",()=>{var t;if(i.auto)return;let e=null===(t=i.selected)||void 0===t?void 0:t.id;e&&this.u("setQuality",e)})}Ob(){return"https://player.vimeo.com"}ng(){let{keyDisabled:t}=this.b.$props,{playsInline:e,nativeControls:i}=this.b.$state,s=i();return{title:this.title,byline:this.byline,color:this.color,portrait:this.portrait,controls:s,h:this.hash,keyboard:s&&!t(),transparent:!0,playsinline:e(),dnt:!this.cookies}}lc(){this.u("getCurrentTime")}nc(t,e){if(this.kd&&0===t)return;let{realCurrentTime:i,realDuration:s,paused:a,bufferedEnd:h}=this.b.$state;if(i()===t)return;let r=i(),n={currentTime:t,played:this.vc(t)};this.c("time-update",n,e),Math.abs(r-t)>1.5&&(this.c("seeking",t,e),!a()&&h()<t&&this.c("waiting",void 0,e)),s()-t<.01&&(this.c("end",void 0,e),this.kd=!0,setTimeout(()=>{this.kd=!1},500))}vc(t){return this.ha>=t?this.ca:this.ca=new a.T(0,this.ha=t)}pb(t,e){this.c("seeked",t,e)}ub(t){var e;let i=this.ia();null===(e=this.ve)||void 0===e||e.promise.then(e=>{if(!e)return;let{title:i,poster:s,duration:a,pro:h}=e;this.uc.set(h),this.c("title-change",i,t),this.c("poster-change",s,t),this.c("duration-change",a,t),this.ld(a,t)}).catch(()=>{i===this.ia()&&(this.u("getVideoTitle"),this.u("getDuration"))})}ld(t,e){let{nativeControls:i}=this.b.$state,s=i();this.Ba=new a.T(0,t);let h={buffered:new a.T(0,0),seekable:this.Ba,duration:t};this.b.delegate.Ha(h,e),s||this.u("_hideOverlay"),this.u("getQualities"),this.u("getChapters")}aj(t,e,i){switch(t){case"getVideoTitle":this.c("title-change",e,i);break;case"getDuration":this.b.$state.canPlay()?this.c("duration-change",e,i):this.ld(e,i);break;case"getCurrentTime":this.nc(e,i);break;case"getBuffered":(0,s.g)(e)&&e.length&&this.og(e[e.length-1][1],i);break;case"setMuted":this.Oa((0,s.p)(this.b.$state.volume),e,i);break;case"getChapters":this.bj(e);break;case"getQualities":this.md(e,i)}}cj(){for(let t of n)this.u("addEventListener",t)}jb(t){var e;this.ga.aa(),this.c("pause",void 0,t),null===(e=this.S)||void 0===e||e.resolve(),this.S=null}hc(t){var e;this.ga.Ya(),this.c("play",void 0,t),null===(e=this.J)||void 0===e||e.resolve(),this.J=null}dj(t){let{paused:e}=this.b.$state;e()||this.kd||this.c("playing",void 0,t)}og(t,e){let i={buffered:new a.T(0,t),seekable:this.Ba};this.c("progress",i,e)}ej(t){this.c("waiting",void 0,t)}fj(t){let{paused:e}=this.b.$state;e()||this.c("playing",void 0,t)}fe(t){let{paused:e}=this.b.$state;e()&&this.c("play",void 0,t),this.c("waiting",void 0,t)}Oa(t,e,i){this.c("volume-change",{volume:t,muted:e},i)}bj(t){if(this.pg(),!t.length)return;let e=new a.b({kind:"chapters",default:!0}),{realDuration:i}=this.b.$state;for(let a=0;a<t.length;a++){var s;let h=t[a],r=t[a+1];e.addCue(new window.VTTCue(h.startTime,null!==(s=null==r?void 0:r.startTime)&&void 0!==s?s:i(),h.title))}this.jd=e,this.b.textTracks.add(e)}pg(){this.jd&&(this.b.textTracks.remove(this.jd),this.jd=null)}md(t,e){for(let i of(this.b.qualities[a.Q.Ja]=t.some(t=>"auto"===t.id)?()=>this.u("setQuality","auto"):void 0,t)){if("auto"===i.id)continue;let t=+i.id.slice(0,-1);isNaN(t)||this.b.qualities[a.L.ea]({id:i.id,width:16/9*t,height:t,codec:"avc1,h.264",bitrate:-1},e)}this._a(t.find(t=>t.active),e)}_a(){let{id:t}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1?arguments[1]:void 0;if(!t)return;let i="auto"===t,s=this.b.qualities.getById(t);i?(this.b.qualities[a.Q.Xa](i,e),this.b.qualities[a.L.fa](void 0,!0,e)):this.b.qualities[a.L.fa](null!=s?s:void 0,!0,e)}gj(t,e,i){switch(t){case"ready":this.cj();break;case"loaded":this.ub(i);break;case"play":this.hc(i);break;case"playProgress":this.dj(i);break;case"pause":this.jb(i);break;case"loadProgress":this.og(e.seconds,i);break;case"waiting":this.fe(i);break;case"bufferstart":this.ej(i);break;case"bufferend":this.fj(i);break;case"volumechange":this.Oa(e.volume,(0,s.p)(this.b.$state.muted),i);break;case"durationchange":this.Ba=new a.T(0,e.duration),this.c("duration-change",e.duration,i);break;case"playbackratechange":this.c("rate-change",e.playbackRate,i);break;case"qualitychange":this._a(e,i);break;case"fullscreenchange":this.c("fullscreen-change",e.fullscreen,i);break;case"enterpictureinpicture":this.c("picture-in-picture-change",!0,i);break;case"leavepictureinpicture":this.c("picture-in-picture-change",!1,i);break;case"ended":this.c("end",void 0,i);break;case"error":this.R(e,i);break;case"seek":case"seeked":this.pb(e.seconds,i)}}R(t,e){if("setPlaybackRate"===t.method&&this.uc.set(!1),"play"===t.method){var i;null===(i=this.J)||void 0===i||i.reject(t.message);return}}ue(t,e){t.event?this.gj(t.event,t.data,e):t.method&&this.aj(t.method,t.value,e)}hd(){}u(t,e){return this.te({method:t,value:e})}A(){this.ga.aa(),this.ha=0,this.ca=new a.T(0,0),this.Ba=new a.T(0,0),this.J=null,this.S=null,this.ve=null,this.Zi=null,this.uc.set(!1),this.pg()}constructor(t,e){super(t),this.b=e,this.$$PROVIDER_TYPE="VIMEO",this.scope=(0,s.d)(),this.ha=0,this.ca=new a.T(0,0),this.Ba=new a.T(0,0),this.J=null,this.S=null,this.ve=null,this.ia=(0,s.s)(""),this.uc=(0,s.s)(!1),this.we=null,this.L=null,this.Zi=null,this.ga=new a.R(this.lc.bind(this)),this.jd=null,this.cookies=!1,this.title=!0,this.byline=!0,this.portrait=!0,this.color="00ADEF",this.kd=!1}}}}]);