from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
def sources():return "\n".join(p.read_text(errors="ignore") for ext in("*.ts","*.tsx") for p in ROOT.rglob(ext) if "node_modules" not in p.parts)
def test_no_backend():
 assert not(ROOT/"app/api").exists() and not(ROOT/"pages/api").exists();package=(ROOT/"package.json").read_text().lower()
 for word in["express","fastapi","supabase","firebase","mongodb","postgres","redis","@vercel/postgres"]:assert word not in package
def test_no_mock_datasource():
 s=sources().lower();assert "mockdatasource" not in s and "fixturedatasource" not in s
 for p in ROOT.rglob("*"):
  if p.is_file() and any(x in p.name.lower() for x in("mock-data","fixture-data","demo-data")):raise AssertionError(str(p))
def test_direct_contract_datasource():
 s=(ROOT/"lib/genlayer/data-source.ts").read_text().lower();assert "one application data source" in s and 'from "./contract"' in s
def test_wallet_finality_guards():
 w=(ROOT/"components/wallet-provider.tsx").read_text();c=(ROOT/"lib/genlayer/contract.ts").read_text().replace(" ","");assert "eth_requestAccounts" in w and "wallet_switchEthereumChain" in w and "accountsChanged" in w and "chainChanged" in w and "disconnect" in w;assert "TransactionStatus.FINALIZED" in c and 'execution.executionResult!=="SUCCESS"' in c and "value:0n" in c
def test_writes_confirm_authoritative_state_before_success():
 s=sources();assert 'stage: "confirming"' in s;assert "Authoritative contract state confirmed." in s;assert "was not uniquely confirmed on-chain" in s;assert "mutation was inconsistent with authoritative state" in s

def test_exact_state_confirmation_helpers_are_present():
 s=sources();assert "confirmWorldCreated" in s;assert "confirmBranchCreated" in s;assert "findSubmittedProposal" in s;assert "confirmReviewedProposal" in s
def test_routes():
 expected=["app/page.tsx","app/worlds/[worldId]/canon/page.tsx","app/worlds/[worldId]/entities/[entityKey]/page.tsx","app/worlds/[worldId]/timeline/page.tsx","app/worlds/[worldId]/branches/page.tsx","app/worlds/[worldId]/proposals/new/page.tsx","app/proposals/[proposalId]/page.tsx","app/receipts/[proposalId]/page.tsx","app/search/page.tsx"]
 for rel in expected:assert(ROOT/rel).exists(),rel
def test_visual_identity():
 css=(ROOT/"app/globals.css").read_text().replace(" ","").lower();assert "--paper:#f3ebdd" in css and "--vermilion:#b74432" in css and "--olive:#697255" in css and ".world-desk" in css and ".marginalia" in css and ".charter-block" in css
