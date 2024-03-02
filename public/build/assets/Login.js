import{j as e,W as p,r as f,d as h}from"./app.js";import{G as j}from"./GuestLayout.js";import{I as m,T as n,a as l}from"./TextInput.js";import{P as b}from"./PrimaryButton.js";import"./ApplicationLogo.js";import"./clsx.js";import"./transition.js";function y({className:r="",...t}){return e.jsx("input",{...t,type:"checkbox",className:"rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800 "+r})}function F({status:r,canResetPassword:t,...u}){const{data:o,setData:d,post:c,processing:a,errors:i,reset:x}=p({id_user:"",password:"",remember:!1});f.useEffect(()=>()=>{x("password")},[]);const g=s=>{s.preventDefault(),c(route("login"))};return e.jsxs(j,{data:u.data,title:"Log in",children:[r&&e.jsx("div",{className:"mb-4 font-medium text-sm text-green-600",children:r}),e.jsxs("form",{onSubmit:g,children:[e.jsxs("div",{children:[e.jsx(m,{htmlFor:"id_user",value:"Username or Email"}),e.jsx(n,{id:"id_user",type:"text",name:"id_user",value:o.id_user,className:"mt-1 block w-full",autoComplete:"id_user",isFocused:!0,disabled:a,onChange:s=>d("id_user",s.target.value)}),e.jsx(l,{message:i.id_user,className:"mt-2"})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx(m,{htmlFor:"password",value:"Password"}),e.jsx(n,{id:"password",type:"password",name:"password",value:o.password,className:"mt-1 block w-full",autoComplete:"current-password",disabled:a,onChange:s=>d("password",s.target.value)}),e.jsx(l,{message:i.password,className:"mt-2"})]}),e.jsx("div",{className:"block mt-4",children:e.jsxs("label",{className:"flex items-center",children:[e.jsx(y,{name:"remember",checked:o.remember,onChange:s=>d("remember",s.target.checked)}),e.jsx("span",{className:"ms-2 text-sm text-gray-600 dark:text-gray-400",children:"Remember me"})]})}),e.jsxs("div",{className:"flex items-center justify-end mt-4",children:[t&&e.jsx(h,{href:route("password.request"),className:"underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800",children:"Forgot your password?"}),e.jsx(b,{className:"ms-4",disabled:a,loading:a,children:"Log in"})]})]})]})}export{F as default};
