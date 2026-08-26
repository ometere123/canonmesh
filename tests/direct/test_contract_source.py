from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[2];SOURCE=(ROOT/"contracts/canonmesh.py").read_text()
def test_vecdb_model():assert "genlayer_embeddings.VecDB" in SOURCE and "typing.Literal[384]" in SOURCE and 'SentenceTransformer("all-MiniLM-L6-v2")' in SOURCE and "vectors.knn" in SOURCE and "vectors.insert" in SOURCE
def test_independent_consensus():assert "gl.vm.run_nondet_unsafe(leader_fn, validator_fn)" in SOURCE and "gl.nondet.exec_prompt" in SOURCE and "own = leader_fn()" in SOURCE and 'leader.get("decision") != own.get("decision")' in SOURCE
def test_evidence_digest_fail_closed():assert "hashlib.sha256(body).hexdigest()" in SOURCE and "[DIGEST_MISMATCH]" in SOURCE and "Required digest-bound public evidence could not be independently verified" in SOURCE
def test_retcon_branch_isolation():assert "target.branch_id != proposal.branch_id" in SOURCE and "branch_override_flags" in SOURCE and "_shadowed_for_branch" in SOURCE and "branch override must target active inherited canon" in SOURCE
def test_accepted_only_insertion():
 insertion=SOURCE.index("self.vectors.insert(self._embed(self._entry_embedding_text(entry))");gate=SOURCE.index("if int(proposal.status) in FINAL_ACCEPTED");assert insertion>gate and SOURCE.count("self.vectors.insert")==1
def test_stale_lineage():assert "_lineage_snapshot" in SOURCE and "_lineage_fresh" in SOURCE and "stale proposal; branch lineage changed" in SOURCE and "proposal branch is inactive" in SOURCE
def test_substantial_surface():
 writes=re.findall(r"@gl\.public\.write\s+def\s+([a-zA-Z0-9_]+)",SOURCE);views=re.findall(r"@gl\.public\.view\s+def\s+([a-zA-Z0-9_]+)",SOURCE);assert len(writes)>=8 and len(views)>=15
 for name in["create_world","set_editor","create_branch","submit_proposal","review_proposal","search_canon","preview_related","stats"]:assert name in writes+views
def test_no_backend_money_secrets():
 lower=SOURCE.lower()
 for word in["transfer(","send_value","private_key","mnemonic","supabase","postgres","redis","cloudflare"]:assert word not in lower
