import{W as d,j as e}from"./app-Bu5qAY3h.js";import{G as u}from"./GuestLayout-FDBkMStI.js";import{T as c,a as p}from"./TextInput-CiG5bZCT.js";import{P as x}from"./PrimaryButton-nmJZB-UY.js";import"./ApplicationLogo-D2vjWGdC.js";import"./clsx-B-dksMZM.js";import"./transition-DaRqfOr-.js";function N({status:t,...a}){const{data:r,setData:o,post:m,processing:i,errors:l}=d({email:""}),n=s=>{s.preventDefault(),m(route("password.email"))};return e.jsxs(u,{data:a.data,title:"Forgot Password",children:[e.jsx("div",{className:"mb-4 text-sm text-gray-600 dark:text-gray-400",children:"Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one."}),t&&e.jsx("div",{className:"mb-4 font-medium text-sm text-green-600 dark:text-green-400",children:t}),e.jsxs("form",{onSubmit:n,children:[e.jsx(c,{id:"email",type:"email",name:"email",value:r.email,className:"mt-1 block w-full",isFocused:!0,onChange:s=>o("email",s.target.value)}),e.jsx(p,{message:l.email,className:"mt-2"}),e.jsx("div",{className:"flex items-center justify-end mt-4",children:e.jsx(x,{className:"ms-4",disabled:i,children:"Email Password Reset Link"})})]})]})}export{N as default};