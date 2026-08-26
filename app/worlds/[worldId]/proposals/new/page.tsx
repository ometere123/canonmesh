import {ProposalComposer} from "@/components/views";
export default async function Page({params}:{params:Promise<{worldId:string}>}){const{worldId}=await params;return <ProposalComposer worldId={Number(worldId)}/>}
