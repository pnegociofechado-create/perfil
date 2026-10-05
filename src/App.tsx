import {useEffect,useState} from "react";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileEditPage from "./pages/ProfileEditPage";
import ProfessionalProfilePage from "./pages/ProfessionalProfilePage";
import ProfileKitPage from "./pages/ProfileKitPage";
import ProfessionalSignupPage from "./pages/ProfessionalSignupPage";
import LeadProfilePage from "./pages/LeadProfilePage";
import LeadsAdminPage from "./pages/LeadsAdminPage";
import {getProfessionalProfile} from "./data/professionalProfiles";
function path(){const h=location.hash.replace(/^#/,"");const q=location.search;if(h.includes("access_token=")||h.includes("refresh_token=")||q.includes("token_hash=")||q.includes("access_token="))return "/perfil/editar";return h||location.pathname||"/"}
export default function App(){const[p,setP]=useState(path());useEffect(()=>{const f=()=>setP(path());addEventListener("hashchange",f);addEventListener("popstate",f);return()=>{removeEventListener("hashchange",f);removeEventListener("popstate",f)}},[]);if(p==="/")return <LandingPage/>;if(p==="/perfil"||p==="/perfil/diego-silva")return <ProfilePage/>;if(p==="/criar-perfil")return <ProfessionalSignupPage/>;if(p==="/admin/leads")return <LeadsAdminPage/>;if(p==="/perfil/editar"||p==="/meu-perfil")return <ProfileEditPage/>;const kit=p.match(/^\/perfil\/([^/]+)\/kit$/);if(kit){const profile=getProfessionalProfile(kit[1]);return profile?<ProfileKitPage profile={profile}/>:<LeadKitFallback/>}const m=p.match(/^\/perfil\/([^/]+)$/);if(m){const profile=getProfessionalProfile(m[1]);return profile?<ProfessionalProfilePage profile={profile}/>:<LeadProfilePage slug={m[1]}/>}return <NotFound/>}
function LeadKitFallback(){return <main className="min-h-screen grid place-items-center bg-[#F5F1E9] text-[#0B3047]"><p>Kit disponível em breve para este perfil.</p></main>}
function NotFound(){return <main className="min-h-screen grid place-items-center bg-[#F5F1E9] text-[#0B3047]"><div className="text-center"><h1 className="font-display text-6xl">404</h1><p className="mt-2">Página não encontrada.</p><a className="mt-6 inline-block rounded-full bg-[#0B3047] px-5 py-3 text-white" href="/#/criar-perfil">Criar perfil profissional</a></div></main>}