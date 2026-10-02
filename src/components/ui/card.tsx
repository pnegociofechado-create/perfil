import type { HTMLAttributes } from "react";
export function Card({className="",...props}:HTMLAttributes<HTMLDivElement>){return <div className={"flex flex-col rounded-xl border bg-[#FFFDF9] shadow-sm "+className} {...props}/>;}
export function CardContent({className="",...props}:HTMLAttributes<HTMLDivElement>){return <div className={"px-6 "+className} {...props}/>;}