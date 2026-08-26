import {createAccount,createClient} from "genlayer-js";
import {studionet} from "genlayer-js/chains";
import requiredMethods from "../lib/genlayer/required-methods.json" with {type:"json"};
const address=process.env.NEXT_PUBLIC_CANONMESH_CONTRACT;if(!address)throw new Error("NEXT_PUBLIC_CANONMESH_CONTRACT is required");const endpoint=process.env.NEXT_PUBLIC_GENLAYER_ENDPOINT??"https://studio.genlayer.com/api";const client=createClient({chain:studionet,endpoint,account:createAccount()});const schema=await client.getContractSchema(address);const missing=requiredMethods.filter(name=>!schema?.methods?.[name]);if(missing.length)throw new Error(`Deployed schema is missing: ${missing.join(", ")}`);console.log(`schema PASS: ${requiredMethods.length} required methods present at ${address}`);
