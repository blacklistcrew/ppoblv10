import{W as p,r as l,j as s}from"./app.js";import{G as c}from"./GuestLayout.js";import{I as u,T as f,a as x}from"./TextInput.js";import{P as w}from"./PrimaryButton.js";import"./ApplicationLogo.js";import"./clsx.js";import"./transition.js";function P(a){const{data:e,setData:t,post:o,processing:i,errors:m,reset:n}=p({password:""});l.useEffect(()=>()=>{n("password")},[]);const d=r=>{r.preventDefault(),o(route("password.confirm"))};return s.jsxs(c,{data:a.data,title:"Confirm Password",children:[s.jsx("div",{className:"mb-4 text-sm text-gray-600 dark:text-gray-400",children:"This is a secure area of the application. Please confirm your password before continuing."}),s.jsxs("form",{onSubmit:d,children:[s.jsxs("div",{className:"mt-4",children:[s.jsx(u,{htmlFor:"password",value:"Password"}),s.jsx(f,{id:"password",type:"password",name:"password",value:e.password,className:"mt-1 block w-full",isFocused:!0,onChange:r=>t("password",r.target.value)}),s.jsx(x,{message:m.password,className:"mt-2"})]}),s.jsx("div",{className:"flex items-center justify-end mt-4",children:s.jsx(w,{className:"ms-4",disabled:i,children:"Confirm"})})]})]})}export{P as default};
