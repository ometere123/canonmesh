import {SemanticSearch} from "@/components/views";
export default async function Page({searchParams}:{searchParams:Promise<{world?:string}>}){const{world}=await searchParams;return <SemanticSearch initialWorld={world?Number(world):undefined}/>}
