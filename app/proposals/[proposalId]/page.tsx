import {ProposalReview} from "@/components/views";
export default async function Page({params}:{params:Promise<{proposalId:string}>}){const{proposalId}=await params;return <ProposalReview proposalId={Number(proposalId)}/>}
