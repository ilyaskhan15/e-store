import{c as n,j as t}from"./index-Bn5FNGp1.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r=n("Minus",[["path",{d:"M5 12h14",key:"1ays0h"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o=n("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);function l({value:e,onChange:s,min:a=1,max:i=99}){return t.jsxs("div",{className:"inline-flex items-center overflow-hidden rounded-full border border-navy/15 bg-white",children:[t.jsx("button",{type:"button",className:"px-3 py-2 text-navy transition hover:bg-surface",onClick:()=>s(Math.max(a,e-1)),children:t.jsx(r,{className:"h-4 w-4"})}),t.jsx("span",{className:"min-w-10 px-3 text-center font-semibold text-navy",children:e}),t.jsx("button",{type:"button",className:"px-3 py-2 text-navy transition hover:bg-surface",onClick:()=>s(Math.min(i,e+1)),children:t.jsx(o,{className:"h-4 w-4"})})]})}export{l as Q};
