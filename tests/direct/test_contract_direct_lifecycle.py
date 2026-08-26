"""Execution-level CanonMesh invariants in GenLayer Direct Mode."""

import json

import pytest


def _new_contract(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/canonmesh.py")
    direct_vm.sender = direct_alice
    world_id = contract.create_world(
        "Vesper Archive",
        "Facts for the Vesper continuity archive.",
        "",
        "",
    )
    return contract, world_id, 1


def _submit(contract, world_id, branch_id, mode, title, statement):
    return contract.submit_proposal(
        world_id,
        branch_id,
        mode,
        title,
        statement,
        "",
        "",
        json.dumps(["vesper"], separators=(",", ":")),
        "year 1",
    )


def _review_as(contract, direct_vm, proposal_id, decision, **extra):
    payload = {
        "decision": decision,
        "supersedes": extra.get("supersedes", []),
        "branch_overrides": extra.get("branch_overrides", []),
        "rationale": "Direct Mode deterministic review",
        "evidence_summary": "No external evidence supplied",
    }
    direct_vm.mock_llm(r".*", json.dumps(payload))
    return contract.review_proposal(proposal_id)


def test_real_lifecycle_retcon_and_branch_shadowing(
    direct_vm, direct_deploy, direct_alice
):
    contract, world_id, root_id = _new_contract(direct_vm, direct_deploy, direct_alice)
    child_id = contract.create_branch(world_id, "field-notes", root_id)

    initial = _submit(
        contract,
        world_id,
        root_id,
        "ADD",
        "The archive opens at dusk",
        "The Vesper Archive opens at dusk on the first day.",
    )
    assert _review_as(contract, direct_vm, initial, "COMPATIBLE") == "COMPATIBLE"
    first_entry = contract.get_proposal(initial)
    assert int(first_entry["resulting_entry_id"]) == 1
    assert contract.search_canon(world_id, root_id, "archive opens dusk", 8)

    compatible = _submit(
        contract,
        world_id,
        root_id,
        "ADD",
        "The archive bell is bronze",
        "The archive bell is bronze and sounds once at opening.",
    )
    direct_vm.clear_mocks()
    assert _review_as(contract, direct_vm, compatible, "COMPATIBLE") == "COMPATIBLE"
    assert int(contract.get_proposal(compatible)["resulting_entry_id"]) == 2

    retcon = _submit(
        contract,
        world_id,
        root_id,
        "RETCON",
        "The archive opens before sunset",
        "The Vesper Archive opens before sunset on the first day.",
    )
    direct_vm.clear_mocks()
    assert _review_as(contract, direct_vm, retcon, "RETCON_VALID", supersedes=[1]) == "RETCON_VALID"
    retcon_result = contract.get_proposal(retcon)
    assert retcon_result["supersedes_json"] == "[1]"
    assert int(contract.get_entry(1)["superseded_by"]) == int(retcon_result["resulting_entry_id"])
    assert contract.get_entry(1)["status"] == "COMPATIBLE"

    branch_proposal = _submit(
        contract,
        world_id,
        child_id,
        "BRANCH",
        "Field notes contradict the opening time",
        "Field notes record the archive opening at midnight instead.",
    )
    direct_vm.clear_mocks()
    assert _review_as(
        contract,
        direct_vm,
        branch_proposal,
        "BRANCH_ONLY",
        branch_overrides=[2],
    ) == "BRANCH_ONLY"
    child_result = contract.get_proposal(branch_proposal)
    assert child_result["branch_overrides_json"] == "[2]"

    # Parent canon and unrelated sibling lineage remain unaffected.
    assert contract.search_canon(world_id, root_id, "archive bell bronze", 8)
    child_results = contract.search_canon(world_id, child_id, "archive bell bronze", 8)
    assert all(int(item["entry_id"]) != 2 for item in child_results)
    sibling_id = contract.create_branch(world_id, "public-record", root_id)
    sibling_results = contract.search_canon(world_id, sibling_id, "archive bell bronze", 8)
    assert any(int(item["entry_id"]) == 2 for item in sibling_results)


def test_authorization_validation_and_fail_closed_paths(
    direct_vm, direct_deploy, direct_alice, direct_bob
):
    contract, world_id, root_id = _new_contract(direct_vm, direct_deploy, direct_alice)

    direct_vm.sender = direct_bob
    with pytest.raises(Exception, match="world steward|editor"):
        contract.create_branch(world_id, "unauthorized", root_id)

    direct_vm.sender = direct_alice
    with pytest.raises(Exception, match="proposal mode"):
        _submit(contract, world_id, root_id, "INVALID", "Bad", "Bad mode")
    with pytest.raises(Exception, match="search limit"):
        contract.search_canon(world_id, root_id, "anything", 9)

    pending = _submit(
        contract,
        world_id,
        root_id,
        "ADD",
        "Evidence-bound fact",
        "This fact has an unavailable evidence endpoint.",
    )
    # Missing URL/digest is explicitly allowed for optional evidence, but the
    # semantic review must still fail closed instead of creating a fact when
    # the mocked validator returns insufficient context.
    assert _review_as(contract, direct_vm, pending, "INSUFFICIENT_CONTEXT") == "INSUFFICIENT_CONTEXT"
    result = contract.get_proposal(pending)
    assert int(result["resulting_entry_id"]) == 0
    assert contract.stats()["entry_count"] == 0
