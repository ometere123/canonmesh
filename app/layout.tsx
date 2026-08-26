import type {Metadata} from "next";
import {Instrument_Sans,Source_Serif_4} from "next/font/google";
import {AppShell} from "@/components/app-shell";
import {WalletProvider} from "@/components/wallet-provider";
import "./globals.css";
const serif=Source_Serif_4({subsets:["latin"],variable:"--font-serif"});const sans=Instrument_Sans({subsets:["latin"],variable:"--font-sans"});
export const metadata:Metadata={title:"CanonMesh — Consensus story bible",description:"Versioned fictional canon with semantic memory and GenLayer consensus."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className={`${serif.variable} ${sans.variable}`}><WalletProvider><AppShell>{children}</AppShell></WalletProvider></body></html>}
