import {CanonLedger} from "@/components/views";
export default async function Page({params}:{params:Promise<{worldId:string}>}){const{worldId}=await params;return <CanonLedger worldId={Number(worldId)}/>}
