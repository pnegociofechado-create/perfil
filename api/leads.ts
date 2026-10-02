import type { VercelRequest,VercelResponse } from "@vercel/node";
const supabaseUrl=process.env.SUPABASE_URL;const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;const adminKey=process.env.ADMIN_KEY;
function json(res:VercelResponse,status:number,body:unknown){res.status(status).setHeader("Content-Type","application/json").setHeader("Cache-Control","no-store").json(body)}
async function supabase(path:string,init:RequestInit={}){if(!supabaseUrl||!serviceKey)throw new Error("Banco não configurado");return fetch(`${supabaseUrl}/rest/v1/${path}`,{...init,headers:{apikey:serviceKey,Authorization:`Bearer ${serviceKey}`,"Content-Type":"application/json",...(init.headers||{})}})}
function clean(value:unknown,max=500){return String(value??"").trim().slice(0,max)}
function makeSlug(value:string){return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,70)}
function validEmail(value:string){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
function normalizeLinkedin(value:string){const v=value.trim();if(!v)return "";if(/^linkedin\.com\//i.test(v))return `https://www.${v}`;if(/^www\.linkedin\.com\//i.test(v))return `https://${v}`;return v}
function validUrl(value:string){if(!value)return true;try{const u=new URL(normalizeLinkedin(value));return u.protocol==="https:"||u.protocol==="http:"}catch{return false}}
async function uniqueSlug(base:string){let slug=base||"perfil";for(let i=1;i<=50;i++){const suffix=i===1?"":`-${i}`;const candidate=(slug.slice(0,80-suffix.length)+suffix);const r=await supabase(`professional_leads?slug=eq.${encodeURIComponent(candidate)}&select=id&limit=1`);if(!r.ok)throw new Error("Não foi possível verificar o endereço do perfil.");const rows=await r.json();if(!rows.length)return candidate}throw new Error("Não foi possível gerar um endereço único para o perfil.")}
export default async function handler(req:VercelRequest,res:VercelResponse){try{
 if(req.method==="POST"){const body=req.body||{};const name=clean(body.name,120),title=clean(body.title,120),city=clean(body.city,120),phone=clean(body.phone,40),email=clean(body.email,160).toLowerCase();
 const required=[name,title,city,phone,email];if(required.some(x=>!x))return json(res,400,{error:"Preencha todos os campos obrigatórios."});
 if(!validEmail(email))return json(res,400,{error:"Digite um e-mail válido."});
 const linkedin=normalizeLinkedin(clean(body.linkedin,300));if(!validUrl(linkedin))return json(res,400,{error:"O LinkedIn precisa ser um endereço válido."});
 const slug=await uniqueSlug(makeSlug(name));
 const rawProjects=Array.isArray(body.projects)?body.projects:[];
 const projects=rawProjects.slice(0,6).map((p:any,i:number)=>({title:clean(p?.title,120)||`Projeto ${i+1}`,location:clean(p?.location,120)||city,role:clean(p?.description??p?.role,600),result:clean(p?.result,300),images:Array.isArray(p?.images)?p.images.filter((x:any)=>typeof x==="string"&&x.startsWith("https://")).slice(0,2):[]})).filter((p:any)=>p.title||p.images.length);
 const legacy=Array.isArray(body.portfolioImages)?body.portfolioImages.filter((x:string)=>typeof x==="string"&&x.startsWith("https://")).slice(0,6):[];
 const finalProjects=projects.length?projects:legacy.map((url:string,i:number)=>({title:`Projeto ${i+1}`,location:city,role:"Trabalho apresentado no portfólio",images:[url]}));
 const skills=Array.isArray(body.skills)?body.skills.map((x:unknown)=>clean(x,80)).filter(Boolean).slice(0,20):clean(body.skills,1000).split(",").map(x=>x.trim()).filter(Boolean).slice(0,20);
 const profile={slug,name,initials:name.split(/\s+/).slice(0,2).map((x:string)=>x[0]).join("").toUpperCase(),title,location:city,registration:clean(body.registration,120)||"Perfil profissional",headline:clean(body.headline,180)||`${title} · Profissional no Negócio Fechado`,summary:clean(body.summary,2000),phone,email,linkedin,avatarUrl:typeof body.avatarUrl==="string"&&body.avatarUrl.startsWith("https://")?body.avatarUrl:"",skills,highlights:[],projects:finalProjects,experience:[]};
 const response=await supabase("professional_leads",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify({name,title,city,phone,email,registration:profile.registration,linkedin,slug,profile_json:profile,status:"novo"})});
 if(!response.ok)return json(res,response.status===409?409:500,{error:response.status===409?"Este cadastro entrou em conflito. Tente novamente.":"Não foi possível salvar o cadastro."});
 return json(res,201,{slug,profile});
 }
 if(req.method==="GET"){if(!adminKey||req.headers["x-admin-key"]!==adminKey)return json(res,401,{error:"Não autorizado."});const response=await supabase("professional_leads?select=id,created_at,name,title,city,phone,email,slug,status&order=created_at.desc");if(!response.ok)return json(res,500,{error:"Não foi possível carregar os leads."});return json(res,200,await response.json())}
 return json(res,405,{error:"Método não permitido."});
}catch(error){return json(res,500,{error:error instanceof Error?error.message:"Erro interno."})}}