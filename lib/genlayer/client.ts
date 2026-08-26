"use client";
import { createClient } from "genlayer-js";
import { chain, GENLAYER_ENDPOINT } from "./config";
export function createInjectedClient(address:`0x${string}`){const provider=typeof window!=="undefined"?window.ethereum:undefined;if(!provider)throw new Error("No injected wallet provider is available.");return createClient({chain,endpoint:GENLAYER_ENDPOINT,account:address,provider});}
declare global { interface Window { ethereum?: { request:(args:{method:string;params?:unknown[]})=>Promise<unknown>; on?:(event:string,listener:(...args:unknown[])=>void)=>void; removeListener?:(event:string,listener:(...args:unknown[])=>void)=>void; }; } }
