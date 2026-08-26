"""Minimal genuine GenLayer Direct Mode probe for CanonMesh."""


def test_canonmesh_deploys_and_creates_world(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/canonmesh.py")
    direct_vm.sender = direct_alice

    world_id = contract.create_world(
        "Vesper Archive",
        "Canon entries must be evidence-bound and branch-scoped.",
        "",
        "",
    )

    assert int(world_id) == 1
    world = contract.get_world(world_id)
    assert int(world["branch_count"]) == 1
    root = contract.get_branch(1)
    assert int(root["world_id"]) == 1
    assert int(root["parent_branch_id"]) == 0
    assert root["name"] == "main"
