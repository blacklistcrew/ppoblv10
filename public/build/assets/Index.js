import{j as e,y as i}from"./app.js";import{A as m}from"./AuthenticatedLayout.js";import{C as s}from"./Card.js";import{P as n}from"./PaginateDataTable.js";import{P as c}from"./PrimaryButton.js";import{u as p}from"./BaseHelper.js";import"./clsx.js";import"./react-toastify.esm.js";import"./ApplicationLogo.js";import"./transition.js";import"./Api.js";function A({data:r,models:a}){const o=[{name:"Name",selector:t=>t.name},{name:"Status",selector:t=>t.status?"Active":"Inactive"},{name:"Type",selector:t=>p(t.type)},{selector:t=>e.jsx(c,{onClick:()=>i.get(`/admin/category/${t.id}/edit`),children:"Edit"})}];return e.jsx(m,{data:r,title:"Category",children:e.jsx(s,{className:"p-4",children:e.jsx(n,{title:"Category",columns:o,data:a})})})}export{A as default};