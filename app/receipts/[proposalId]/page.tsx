import {DecisionReceipt} from "@/components/views";
export default async function Page({params}:{params:Promise<{proposalId:string}>}){const{proposalId}=await params;return <DecisionReceipt proposalId={Number(proposalId)}/>}
