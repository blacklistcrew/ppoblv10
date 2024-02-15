import{r as s,j as e,a as j,y as $}from"./app-zG4up2OY.js";import{A as M}from"./AuthenticatedLayout-KagFa5dD.js";import{C as V}from"./Card-vP5jYToF.js";import{T as F,I as O}from"./TextInput-WrpmY6zO.js";import{P as R}from"./PrimaryButton-MSz8POA2.js";import{S as q}from"./SelectInput-Hr0xqvHd.js";import z from"./Product-oTQ6pTan.js";import{f as G}from"./BaseHelper-6NPqXJkh.js";import H from"./ProductSelectedDesc-BuKb9X32.js";import"./clsx-Zbgk8kpT.js";import"./ApplicationLogo-M-cTcxWL.js";import"./transition-DPY1_IGr.js";import"./keyboard-hFqIR8aE.js";function nt({auth:N,category:l,brands:y,csrf_token:J}){const[r,c]=s.useState(""),[C,v]=s.useState(!1),[k,I]=s.useState(""),[n,m]=s.useState(!1),[u,f]=s.useState(!1),[o,E]=s.useState(0),[i,p]=s.useState(0),[_,x]=s.useState(""),[h,g]=s.useState([]),b=new AbortController,A=b.signal,B=async()=>{if(o>0){m(!0),x("");const t=await j.get(`/transaction/list-product?id_category=${l.id}&id_brand=${o}`,{signal:A});g(t.data),m(!1)}else g([])},D=async()=>{var a,P,w,S;f(!0);const t=await j.post("/transaction/prepaid",{id_product:i,target:r});(P=(a=t==null?void 0:t.data)==null?void 0:a.data)!=null&&P.id&&(p(0),c(""),$.get(`/history/${(S=(w=t==null?void 0:t.data)==null?void 0:w.data)==null?void 0:S.id}`)),f(!1)};s.useEffect(()=>(d(r,0),B(),()=>{b.abort()}),[o]);const d=(t,a)=>{p(a),c(t),v(t.length>=10&&a>0)},L=t=>{const a=G(t);I(a.length<10?"Number too short, minimim 10 number":""),d(a,i)},T=t=>{x(t.desc),d(r,t.id)};return e.jsx(M,{auth:N,title:"Transaction",children:e.jsxs(V,{className:"flex flex-col px-10 gap-y-3 py-3",children:[e.jsx("h3",{className:"text-3xl font-medium mb-5 dark:text-white",children:l.name}),e.jsx(F,{title:"Phone Number/ID Customer",errorMessage:k,value:r,disabled:n||u,isFocused:!0,onChange:t=>L(t.target.value),className:"w-full md:w-1/3"}),e.jsx(O,{children:"Provider/Operator"}),e.jsx(q,{widthClass:"w-full md:w-1/3",data:y,value:o,onChange:E}),h.length>0&&e.jsx("label",{className:"dark:text-white",children:"Nominal"}),e.jsx("div",{className:"flex-wrap inline-flex min-w-full gap-8 max-h-96 overflow-y-auto rounded-sm",children:n?e.jsx("div",{className:"w-full text-center dark:text-white",children:"Processing..."}):h.map((t,a)=>e.jsx(z,{data:t,idProduct:i,onClick:()=>t.status&&T(t)},a))}),e.jsx(H,{description:_}),e.jsx("div",{className:"w-full text-right my-5",children:e.jsx(R,{disabled:!C||n||u,onClick:()=>D(),children:"Process"})})]})})}export{nt as default};