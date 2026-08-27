"""Execution-level regression for global VecDB starvation."""

import json
from types import SimpleNamespace


def _submit(contract, world_id, branch_id, mode, title, statement, entity_keys):
    return contract.submit_proposal(world_id, branch_id, mode, title, statement, "", "", json.dumps(entity_keys), "year 1")


def _review(direct_vm, contract, proposal_id, decision, **extra):
    direct_vm.mock_llm(r".*", json.dumps({
        "decision": decision,
        "supersedes": extra.get("supersedes", []),
        "branch_overrides": extra.get("branch_overrides", []),
        "duplicate_of": 0,
        "rationale": "scoped fallback regression",
        "evidence_summary": "none",
    }))
    return contract.review_proposal(proposal_id)


def test_unrelated_global_knn_cannot_starve_entity_and_lineage_fallback(
    direct_vm, direct_deploy, direct_alice
):
    contract = direct_deploy("contracts/canonmesh.py", sdk_version="v0.2.16")
    direct_vm.sender = direct_alice
    world_a = contract.create_world("World A", "A charter", "", "")
    root_a = 1
    source = _submit(contract, world_a, root_a, "ADD", "A canon", "A relevant canon fact", ["a-entity"])
    assert _review(direct_vm, contract, source, "COMPATIBLE") == "COMPATIBLE"

    world_b = contract.create_world("World B", "B charter", "", "")
    source_b = _submit(contract, world_b, 2, "ADD", "B canon", "An unrelated closer vector", ["b-entity"])
    direct_vm.clear_mocks()
    assert _review(direct_vm, contract, source_b, "COMPATIBLE") == "COMPATIBLE"

    proposal = _submit(contract, world_a, root_a, "RETCON", "A replacement", "A replacement fact", ["a-entity"])

    def unrelated_knn(_proposal):
        return [SimpleNamespace(value=SimpleNamespace(entry_id=2, world_id=world_b, branch_id=2), distance=0.01)]

    direct_vm.clear_mocks()
    direct_vm.mock_llm(r".*", json.dumps({
        "decision": "RETCON_VALID", "supersedes": [1], "branch_overrides": [], "duplicate_of": 0,
        "rationale": "fallback target", "evidence_summary": "none",
    }))
    direct_vm.mock_llm(r".*", json.dumps({
        "decision": "RETCON_VALID", "supersedes": [1], "branch_overrides": [], "duplicate_of": 0,
        "rationale": "fallback target", "evidence_summary": "none",
    }))
    original_knn = contract._knn_hits
    contract._knn_hits = unrelated_knn
    try:
        related = contract.preview_related(proposal, 8)
        assert [item["entry_id"] for item in related] == [1]
        assert related[0]["retrieval_source"] == "ENTITY_SCOPE"
        assert _review(direct_vm, contract, proposal, "RETCON_VALID", supersedes=[1]) == "RETCON_VALID"
        result = contract.get_proposal(proposal)
        assert result["related_ids_json"] == "[1]"
        assert contract.get_entry(1)["superseded_by"] == result["resulting_entry_id"]
    finally:
        contract._knn_hits = original_knn


def test_lineage_fallback_is_bounded_and_excludes_other_branches(
    direct_vm, direct_deploy, direct_alice
):
    contract = direct_deploy("contracts/canonmesh.py", sdk_version="v0.2.16")
    direct_vm.sender = direct_alice
    world = contract.create_world("Scoped world", "Charter", "", "")
    root, child, sibling = 1, contract.create_branch(world, "child", 1), contract.create_branch(world, "sibling", 1)
    root_proposal = _submit(contract, world, root, "ADD", "Root fact", "Inherited fact", [])
    assert _review(direct_vm, contract, root_proposal, "COMPATIBLE") == "COMPATIBLE"
    child_proposal = _submit(contract, world, child, "BRANCH", "Child divergence", "Child fact", [])

    direct_vm.clear_mocks()
    original_knn = contract._knn_hits
    contract._knn_hits = lambda _proposal: []
    try:
        related = contract.preview_related(child_proposal, 8)
        assert len(related) <= 8
        assert related[0]["entry_id"] == 1
        assert related[0]["retrieval_source"] == "LINEAGE_SCOPE"
        assert all(item["branch_id"] != sibling for item in related)
    finally:
        contract._knn_hits = original_knn
