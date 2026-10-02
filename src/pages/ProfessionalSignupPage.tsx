import {useState} from "react";
import {Button} from "../components/ui/button";
import {Card,CardContent} from "../components/ui/card";
import {Input} from "../components/ui/input";
import {Label} from "../components/ui/label";
import {Textarea} from "../components/ui/textarea";

export default function ProfessionalSignupPage(){
  const [form,setForm]=useState({name:"",title:"",city:"",phone:"",email:"",registration:"",linkedin:"",headline:"",summary:"",skills:""});
  const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  const set=(key:string,value:string)=>setForm(x=>({...x,[key]:value}));
  async function submit(e:React.FormEvent){
    e.preventDefault(); setError(""); setLoading(true);
    try{
      const r=await fetch("/api/leads",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      const data=await r.json();
      if(!r.ok) throw new Error(data.error||"Não foi possível cadastrar.");
      location.href=`/perfil/${data.slug}`;
    }catch(e){setError(e instanceof Error?e.message:"Erro ao cadastrar.");setLoading(false)}
  }
  return <main className="min-h-screen bg-[#F5F1E9] text-[#0B3047]"><div className="bg-[#0B3047] px-5 py-2 text-center font-mono text-[10px] uppercase tracking-[.16em] text-white">Negócio Fechado · Cadastro profissional</div>
    <div className="mx-auto max-w-3xl px-5 py-12 md:py-20"><p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#F15A24]">Seu espaço profissional</p><h1 className="mt-3 font-display text-6xl font-semibold leading-none md:text-7xl">Crie seu perfil profissional.</h1><p className="mt-5 max-w-2xl text-lg leading-7 text-[#5E6870]">Apresente seu trabalho, serviços e contatos em uma página profissional gratuita do Negócio Fechado.</p>
      <Card className="mt-10 rounded-3xl border-[#D7D0C4] shadow-none bg-[#FFFDF9]"><CardContent className="p-6 md:p-9"><form onSubmit={submit} className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2"><Field label="Nome completo *" value={form.name} onChange={v=>set("name",v)} /><Field label="Profissão / especialidade *" value={form.title} onChange={v=>set("title",v)} /><Field label="Cidade / região *" value={form.city} onChange={v=>set("city",v)} /><Field label="WhatsApp *" value={form.phone} onChange={v=>set("phone",v)} /><Field label="E-mail *" type="email" value={form.email} onChange={v=>set("email",v)} /><Field label="Registro profissional" value={form.registration} onChange={v=>set("registration",v)} /></div>
        <Field label="LinkedIn" value={form.linkedin} onChange={v=>set("linkedin",v)} /><Field label="Frase de apresentação" value={form.headline} onChange={v=>set("headline",v)} />
        <div><Label>Sobre você</Label><Textarea className="mt-2 min-h-32" value={form.summary} onChange={e=>set("summary",e.target.value)} placeholder="Conte brevemente sobre sua experiência e atuação." /></div>
        <div><Label>Competências</Label><Input className="mt-2" value={form.skills} onChange={e=>set("skills",e.target.value)} placeholder="Ex.: orçamento, obras, elétrica, projetos" /></div>
        {error&&<p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full bg-[#F15A24] py-3">{loading?"Publicando...":"Criar meu perfil grátis"}</Button>
        <p className="text-center text-xs text-[#5E6870]">Ao enviar, você concorda em fornecer seus dados para criação e gestão do perfil profissional.</p>
      </form></CardContent></Card>
    </div></main>
}
function Field({label,value,onChange,type="text"}:{label:string;value:string;onChange:(v:string)=>void;type?:string}){return <div><Label>{label}</Label><Input type={type} className="mt-2" value={value} onChange={e=>onChange(e.target.value)} required={label.includes("*")}/></div>}
