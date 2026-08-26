import pytest
from reference_model import Model

def test_only_accepted_entries_enter_memory():
 m=Model();assert m.accept(1,"x","CONFLICT") is None;assert m.memory==[];e=m.accept(1,"x","COMPATIBLE");assert m.memory==[e]
def test_same_branch_retcon_preserves_history():
 m=Model();old=m.accept(1,"Orin","COMPATIBLE");new=m.accept(1,"Vale","RETCON_VALID",(old,));assert m.entries[old].superseded_by==new and old in m.entries and m.active_context(1)==[new]
def test_child_cannot_retcon_parent():
 m=Model();parent=m.accept(1,"Orin","COMPATIBLE");child=m.fork(1)
 with pytest.raises(AssertionError):m.accept(child,"Vale","RETCON_VALID",(parent,))
def test_branch_override_is_local():
 m=Model();parent=m.accept(1,"Orin","COMPATIBLE");child=m.fork(1);div=m.accept(child,"Vale","BRANCH_ONLY",(parent,));assert parent in m.active_context(1) and parent not in m.active_context(child) and div in m.active_context(child);sibling=m.fork(1);assert parent in m.active_context(sibling)
def test_override_inherited_by_descendants():
 m=Model();parent=m.accept(1,"Orin","COMPATIBLE");child=m.fork(1);m.accept(child,"Vale","BRANCH_ONLY",(parent,));grand=m.fork(child);assert parent not in m.active_context(grand)
def test_negative_decisions_do_not_bump_version():
 m=Model();v=m.branches[1].version;m.accept(1,"x","CONFLICT");m.accept(1,"y","INSUFFICIENT_CONTEXT");assert m.branches[1].version==v
