import {useEffect,useState} from "react";
import ProfessionalProfilePage from "./ProfessionalProfilePage";
import type {ProfessionalProfile} from "../data/professionalProfiles";

export default function LeadProfilePage({slug}:{slug:string}){
 const [profile,setProfile]=useState<ProfessionalProfile|null>(null); const [error,setError]=useState(false);
 useEffect(()=>{fetch(`/api/profiles/${encodeURIComponent(slug)}`).then(r=>r.ok?r.json():Promise.reject()).then(setProfile).catch(()=>setError(true))},[slug]);
 if(error)return <main className="min-h-screen grid place-items-center bg-[#F5F1E9] text-[#0B3047]"><div className="text-center"><h1 className="font-display text-5xl">Perfil não encontrado</h1><a className="mt-6 inline-block rounded-full bg-[#0B3047] px-5 py-3 text-white" href="/#/criar-perfil">Criar meu perfil</a></div></main>;
 if(!profile)return <main className="min-h-screen grid place-items-center bg-[#F5F1E9] text-[#0B3047]">Carregando perfil...</main>;
 return <ProfessionalProfilePage profile={profile}/>;
}
