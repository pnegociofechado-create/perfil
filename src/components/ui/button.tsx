import type { ButtonHTMLAttributes } from "react";
export function Button({className="",variant="default",...props}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:"default"|"outline"|"ghost"}) {
 const base="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition";
 const styles=variant==="outline"?"border border-[#d7d0c4] bg-transparent hover:bg-[#fffdf9]":variant==="ghost"?"hover:bg-white/10":"bg-[#0B3047] text-white hover:bg-[#163f59]";
 return <button className={base+" "+styles+" "+className} {...props}/>;
}