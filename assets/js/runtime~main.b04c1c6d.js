(()=>{var e,r,t,a,o,n,f,c,d,i={},b={};function u(e){var r=b[e];if(void 0!==r)return r.exports;var t=b[e]={id:e,loaded:!1,exports:{}};return i[e].call(t.exports,t,t.exports,u),t.loaded=!0,t.exports}u.m=i,u.c=b,e="function"==typeof Symbol?Symbol("webpack queues"):"__webpack_queues__",r="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",t="function"==typeof Symbol?Symbol("webpack error"):"__webpack_error__",a=e=>{e&&e.d<1&&(e.d=1,e.forEach((e=>e.r--)),e.forEach((e=>e.r--?e.r++:e())))},u.a=(o,n,f)=>{var c;f&&((c=[]).d=-1);var d,i,b,u=new Set,l=o.exports,s=new Promise(((e,r)=>{b=r,i=e}));s[r]=l,s[e]=e=>(c&&e(c),u.forEach(e),s.catch((e=>{}))),o.exports=s,n((o=>{var n;d=(o=>o.map((o=>{if(null!==o&&"object"==typeof o){if(o[e])return o;if(o.then){var n=[];n.d=0,o.then((e=>{f[r]=e,a(n)}),(e=>{f[t]=e,a(n)}));var f={};return f[e]=e=>e(n),f}}var c={};return c[e]=e=>{},c[r]=o,c})))(o);var f=()=>d.map((e=>{if(e[t])throw e[t];return e[r]})),i=new Promise((r=>{(n=()=>r(f)).r=0;var t=e=>e!==c&&!u.has(e)&&(u.add(e),e&&!e.d&&(n.r++,e.push(n)));d.map((r=>r[e](t)))}));return n.r?i:f()}),(e=>(e?b(s[t]=e):i(l),a(c)))),c&&c.d<0&&(c.d=0)},o=[],u.O=(e,r,t,a)=>{if(!r){var n=1/0;for(i=0;i<o.length;i++){r=o[i][0],t=o[i][1],a=o[i][2];for(var f=!0,c=0;c<r.length;c++)(!1&a||n>=a)&&Object.keys(u.O).every((e=>u.O[e](r[c])))?r.splice(c--,1):(f=!1,a<n&&(n=a));if(f){o.splice(i--,1);var d=t();void 0!==d&&(e=d)}}return e}a=a||0;for(var i=o.length;i>0&&o[i-1][2]>a;i--)o[i]=o[i-1];o[i]=[r,t,a]},u.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return u.d(r,{a:r}),r},f=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,u.t=function(e,r){if(1&r&&(e=this(e)),8&r)return e;if("object"==typeof e&&e){if(4&r&&e.__esModule)return e;if(16&r&&"function"==typeof e.then)return e}var t=Object.create(null);u.r(t);var a={};n=n||[null,f({}),f([]),f(f)];for(var o=2&r&&e;"object"==typeof o&&!~n.indexOf(o);o=f(o))Object.getOwnPropertyNames(o).forEach((r=>a[r]=()=>e[r]));return a.default=()=>e,u.d(t,a),t},u.d=(e,r)=>{for(var t in r)u.o(r,t)&&!u.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},u.f={},u.e=e=>Promise.all(Object.keys(u.f).reduce(((r,t)=>(u.f[t](e,r),r)),[])),u.u=e=>"assets/js/"+({48:"a94703ab",98:"a7bd4aaa",228:"215c24a1",235:"a7456010",256:"11b43341",423:"8f030830",580:"8d91250b",634:"c4f5d8e4",647:"5e95c892",739:"2dc45ced",742:"aba21aa0",795:"4856f5e5",845:"3b464fa6",869:"6b45e673",890:"b924f9ed"}[e]||e)+"."+{21:"d47a7db7",44:"cc07c734",48:"6484c0c7",98:"11c91663",228:"295c77d7",235:"797ce568",256:"76c687ee",349:"ccef04ed",416:"e9e7af6e",423:"46d7ef5b",497:"e4511e05",580:"b031585a",634:"44876476",647:"bfc8a7cf",648:"977fa5d9",739:"a9923d50",742:"80d9f188",790:"23ad28b5",795:"0489371c",845:"6e256831",863:"03025b87",865:"c15ef66a",869:"d070f77f",890:"14e39d85",964:"a49ee26b"}[e]+".js",u.miniCssF=e=>{},u.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),u.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),c={},d="@finos/perspective-docs:",u.l=(e,r,t,a)=>{if(c[e])c[e].push(r);else{var o,n;if(void 0!==t)for(var f=document.getElementsByTagName("script"),i=0;i<f.length;i++){var b=f[i];if(b.getAttribute("src")==e||b.getAttribute("data-webpack")==d+t){o=b;break}}o||(n=!0,(o=document.createElement("script")).charset="utf-8",o.timeout=120,u.nc&&o.setAttribute("nonce",u.nc),o.setAttribute("data-webpack",d+t),o.src=e),c[e]=[r];var l=(r,t)=>{o.onerror=o.onload=null,clearTimeout(s);var a=c[e];if(delete c[e],o.parentNode&&o.parentNode.removeChild(o),a&&a.forEach((e=>e(t))),r)return r(t)},s=setTimeout(l.bind(null,void 0,{type:"timeout",target:o}),12e4);o.onerror=l.bind(null,o.onerror),o.onload=l.bind(null,o.onload),n&&document.head.appendChild(o)}},u.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),u.p="/",u.gca=function(e){return e={a94703ab:"48",a7bd4aaa:"98","215c24a1":"228",a7456010:"235","11b43341":"256","8f030830":"423","8d91250b":"580",c4f5d8e4:"634","5e95c892":"647","2dc45ced":"739",aba21aa0:"742","4856f5e5":"795","3b464fa6":"845","6b45e673":"869",b924f9ed:"890"}[e]||e,u.p+u.u(e)},(()=>{u.b=document.baseURI||self.location.href;var e={354:0,250:0};u.f.j=(r,t)=>{var a=u.o(e,r)?e[r]:void 0;if(0!==a)if(a)t.push(a[2]);else if(/^(250|354)$/.test(r))e[r]=0;else{var o=new Promise(((t,o)=>a=e[r]=[t,o]));t.push(a[2]=o);var n=u.p+u.u(r),f=new Error;u.l(n,(t=>{if(u.o(e,r)&&(0!==(a=e[r])&&(e[r]=void 0),a)){var o=t&&("load"===t.type?"missing":t.type),n=t&&t.target&&t.target.src;f.message="Loading chunk "+r+" failed.\n("+o+": "+n+")",f.name="ChunkLoadError",f.type=o,f.request=n,a[1](f)}}),"chunk-"+r,r)}},u.O.j=r=>0===e[r];var r=(r,t)=>{var a,o,n=t[0],f=t[1],c=t[2],d=0;if(n.some((r=>0!==e[r]))){for(a in f)u.o(f,a)&&(u.m[a]=f[a]);if(c)var i=c(u)}for(r&&r(t);d<n.length;d++)o=n[d],u.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return u.O(i)},t=self.webpackChunk_finos_perspective_docs=self.webpackChunk_finos_perspective_docs||[];t.forEach(r.bind(null,0)),t.push=r.bind(null,t.push.bind(t))})()})();