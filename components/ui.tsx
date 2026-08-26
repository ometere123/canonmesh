import Link from "next/link";
import type {ReadResult} from "@/lib/types";
export function LedgerRule({label,value}:{label:string;value?:React.ReactNode}){return <div className="ledger-rule"><span>{label}</span><strong>{value??"—"}</strong></div>}
export function StatusMark({status}:{status:string}){return <span className="status-mark" data-status={status.toLowerCase().replaceAll("_","-")}>{status.replaceAll("_"," ")}</span>}
export function EmptyPage({eyebrow,title,children}:{eyebrow:string;title:string;children:React.ReactNode}){return <section className="empty-state"><div className="folio-number">00</div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><div className="empty-copy">{children}</div></section>}
export function ReadState<T>({result,children}:{result:ReadResult<T>|undefined;children:(value:T)=>React.ReactNode}){if(!result)return <div className="loading-sheet"><span className="ink-pulse"/> Reading the contract…</div>;if(result.kind==="UNAVAILABLE")return <div className="unavailable-sheet" role="alert"><strong>Live state unavailable</strong><p>{result.reason}</p></div>;if(result.kind==="NOT_FOUND")return <div className="unavailable-sheet"><strong>Not found</strong><p>This record does not exist.</p></div>;return <>{children(result.value)}</>}
export function HashRef({label,value}:{label:string;value:string}){return value?<div className="hash-ref"><span>{label}</span><code>{value}</code></div>:null}
export function BackLink({href,children}:{href:string;children:React.ReactNode}){return <Link className="back-link" href={href}>← {children}</Link>}
