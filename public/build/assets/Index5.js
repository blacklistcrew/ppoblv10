import{r as l,t as b,j as t,y as B}from"./app.js";import{C as j}from"./Card.js";import{I as G}from"./ImagePreview.js";import{P as O}from"./PrimaryButton.js";import{T as K,a as R,p as z,S as Y}from"./SelectInput.js";import{T as g}from"./TextInput.js";import{A as H}from"./AuthenticatedLayout.js";import{A as Z}from"./Api.js";import{c as q}from"./clsx.js";import{U as N,y as P,l as J,C as _,o as k,p as Q,x as V}from"./transition.js";import{I as T,f as W,s as X,r as ee,o as $}from"./keyboard.js";import{G as te,w as ae}from"./description.js";import"./react-toastify.esm.js";import"./ApplicationLogo.js";let E=l.createContext(null);function D(){let c=l.useContext(E);if(c===null){let s=new Error("You used a <Label /> component, but it is not inside a relevant parent.");throw Error.captureStackTrace&&Error.captureStackTrace(s,D),s}return c}function re(){let[c,s]=l.useState([]);return[c.length>0?c.join(" "):void 0,l.useMemo(()=>function(e){let i=k(o=>(s(n=>[...n,o]),()=>s(n=>{let h=n.slice(),d=h.indexOf(o);return d!==-1&&h.splice(d,1),h}))),r=l.useMemo(()=>({register:i,slot:e.slot,name:e.name,props:e.props}),[i,e.slot,e.name,e.props]);return b.createElement(E.Provider,{value:r},e.children)},[s])]}let ne="label";function le(c,s){let e=T(),{id:i=`headlessui-label-${e}`,passive:r=!1,...o}=c,n=D(),h=P(s);J(()=>n.register(i),[i,n.register]);let d={ref:h,...n.props,id:i};return r&&("onClick"in d&&(delete d.htmlFor,delete d.onClick),"onClick"in o&&delete o.onClick),_({ourProps:d,theirProps:o,slot:n.slot||{},defaultTag:ne,name:n.name||"Label"})}let se=N(le),ie=Object.assign(se,{}),w=l.createContext(null);w.displayName="GroupContext";let oe=l.Fragment;function ce(c){var s;let[e,i]=l.useState(null),[r,o]=re(),[n,h]=ae(),d=l.useMemo(()=>({switch:e,setSwitch:i,labelledby:r,describedby:n}),[e,i,r,n]),f={},v=c;return b.createElement(h,{name:"Switch.Description"},b.createElement(o,{name:"Switch.Label",props:{htmlFor:(s=d.switch)==null?void 0:s.id,onClick(p){e&&(p.currentTarget.tagName==="LABEL"&&p.preventDefault(),e.click(),e.focus({preventScroll:!0}))}}},b.createElement(w.Provider,{value:d},_({ourProps:f,theirProps:v,defaultTag:oe,name:"Switch.Group"}))))}let de="button";function pe(c,s){let e=T(),{id:i=`headlessui-switch-${e}`,checked:r,defaultChecked:o=!1,onChange:n,name:h,value:d,form:f,...v}=c,p=l.useContext(w),x=l.useRef(null),a=P(x,s,p===null?null:p.setSwitch),[u,y]=K(r,n,o),C=k(()=>y==null?void 0:y(!u)),L=k(m=>{if(ee(m.currentTarget))return m.preventDefault();m.preventDefault(),C()}),I=k(m=>{m.key===$.Space?(m.preventDefault(),C()):m.key===$.Enter&&z(m.currentTarget)}),A=k(m=>m.preventDefault()),F=l.useMemo(()=>({checked:u}),[u]),M={id:i,ref:a,role:"switch",type:R(c,x),tabIndex:0,"aria-checked":u,"aria-labelledby":p==null?void 0:p.labelledby,"aria-describedby":p==null?void 0:p.describedby,onClick:L,onKeyUp:I,onKeyPress:A},U=Q();return l.useEffect(()=>{var m;let S=(m=x.current)==null?void 0:m.closest("form");S&&o!==void 0&&U.addEventListener(S,"reset",()=>{y(o)})},[x,y]),b.createElement(b.Fragment,null,h!=null&&u&&b.createElement(W,{features:X.Hidden,...V({as:"input",type:"checkbox",hidden:!0,readOnly:!0,form:f,checked:u,name:h,value:d})}),_({ourProps:M,theirProps:v,slot:F,defaultTag:de,name:"Switch"}))}let ue=N(pe),me=ce,he=Object.assign(ue,{Group:me,Label:ie,Description:te});function Pe({data:c,model:s}){const[e,i]=l.useState(s),[r,o]=l.useState(!1),[n,h]=l.useState(""),d=a=>{h(a.target.files[0])},f=a=>{i(u=>({...u,[a.target.name]:a.target.value}))},v=async()=>{o(!0);const a=new FormData;if(a.append("_method","PUT"),a.append("image",n),a.append("account_number",e.account_number),a.append("bank",e.bank),a.append("api_username",e.api_username),a.append("api_dev_key",e.api_dev_key),a.append("api_prod_key",e.api_prod_key),a.append("api_secret",e.api_secret),a.append("use_prod",`${e.use_prod}`),a.append("status",`${e.status}`),await Z.post("/admin/setting",a)){B.reload();return}o(!1)};let p="";switch(typeof n){case"object":p=URL.createObjectURL(n);break;case"string":e.logo&&(p=`/images/${e.logo}`);break}const x=!!e.status;return t.jsxs(H,{data:c,title:"Setting",children:[t.jsxs("div",{className:"flex justify-end gap-5",children:[t.jsx("span",{className:q("dark:text-white"),children:"Maintenance Mode"}),t.jsx(he,{checked:x,onChange:a=>i(u=>({...u,status:a?1:0})),className:`${x?"bg-blue-600":"bg-gray-700"} relative inline-flex h-6 w-11 items-center rounded-full`,children:t.jsx("span",{className:`${x?"translate-x-6":"translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition`})})]}),t.jsx(j,{className:"p-6 sm:px-8",children:t.jsxs("div",{className:"flex flex-col gap-y-5",children:[t.jsx("div",{className:"text-2xl dark:text-white",children:"App Logo"}),t.jsx(g,{type:"file",accept:"image/png",onChange:d,className:"max-w-xl"}),t.jsx("div",{id:"galleryID",children:p&&t.jsx(G,{src:p,height:150})})]})}),t.jsxs(j,{className:"p-6 sm:px-8 flex flex-col gap-y-5",children:[t.jsx("div",{className:"text-2xl dark:text-white",children:"Bank Transfer"}),t.jsxs("div",{className:"grid lg:grid-cols-2 gap-5",children:[t.jsx(g,{disabled:r,title:"Bank Name",name:"bank",value:e.bank,onChange:f}),t.jsx(g,{disabled:r,title:"Account Number",name:"account_number",value:e.account_number,onChange:f})]})]}),t.jsxs(j,{className:"p-6 sm:px-8 flex flex-col gap-y-5",children:[t.jsx("div",{className:"text-2xl dark:text-white",children:"API Digiflazz"}),t.jsxs("div",{className:"grid lg:grid-cols-2 gap-5",children:[t.jsx(Y,{title:"Mode",disabled:r,value:e.use_prod,data:[{id:0,name:"Development"},{id:1,name:"Production"}],onChange:a=>i(u=>({...u,use_prod:a?1:0})),widthClass:"w-full"}),t.jsx(g,{disabled:r,title:"Username",name:"api_username",value:e.api_username,onChange:f}),t.jsx(g,{disabled:r,title:"Development Key",name:"api_dev_key",value:e.api_dev_key,onChange:f}),t.jsx(g,{disabled:r,title:"Production Key",name:"api_prod_key",value:e.api_prod_key,onChange:f}),t.jsx(g,{disabled:r,title:"Secret Number",name:"api_secret",value:e.api_secret,onChange:f})]})]}),t.jsx("div",{className:"text-right",children:t.jsx(O,{disabled:r,loading:r,onClick:()=>v(),children:"Update"})})]})}export{Pe as default};
