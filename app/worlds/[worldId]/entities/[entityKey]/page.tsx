import {EntityDossier} from "@/components/views";
export default async function Page({params}:{params:Promise<{worldId:string;entityKey:string}>}){const{worldId,entityKey}=await params;return <EntityDossier worldId={Number(worldId)} entityKey={decodeURIComponent(entityKey)}/>}
