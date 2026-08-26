from dataclasses import dataclass,field
@dataclass
class Entry:id:int;branch:int;statement:str;superseded_by:int=0;overrides:tuple[int,...]=()
@dataclass
class Branch:id:int;parent:int;version:int=1;active:bool=True
@dataclass
class Model:
 branches:dict[int,Branch]=field(default_factory=lambda:{1:Branch(1,0)});entries:dict[int,Entry]=field(default_factory=dict);branch_overrides:set[tuple[int,int]]=field(default_factory=set);memory:list[int]=field(default_factory=list);next_entry:int=1
 def fork(self,parent:int)->int:
  assert self.branches[parent].active;new=max(self.branches)+1;self.branches[new]=Branch(new,parent);return new
 def lineage(self,branch:int)->list[int]:
  out=[]
  while branch:out.append(branch);branch=self.branches[branch].parent
  return out
 def shadowed(self,branch:int,entry:int)->bool:return any((bid,entry) in self.branch_overrides for bid in self.lineage(branch))
 def active_context(self,branch:int)->list[int]:
  lineage=set(self.lineage(branch));return[e.id for e in self.entries.values() if e.branch in lineage and not e.superseded_by and not self.shadowed(branch,e.id)]
 def accept(self,branch:int,statement:str,decision:str,targets:tuple[int,...]=())->int|None:
  if decision in{"CONFLICT","INSUFFICIENT_CONTEXT"}:return None
  context=set(self.active_context(branch))
  if decision=="RETCON_VALID":assert targets and all(t in context and self.entries[t].branch==branch for t in targets)
  elif decision=="BRANCH_ONLY":
   assert self.branches[branch].parent and targets;ancestors=set(self.lineage(branch)[1:]);assert all(t in context and self.entries[t].branch in ancestors for t in targets)
  else:assert decision=="COMPATIBLE" and not targets
  eid=self.next_entry;self.next_entry+=1;self.entries[eid]=Entry(eid,branch,statement,overrides=targets if decision=="BRANCH_ONLY" else ());self.memory.append(eid)
  if decision=="RETCON_VALID":
   for t in targets:self.entries[t].superseded_by=eid
  if decision=="BRANCH_ONLY":
   for t in targets:self.branch_overrides.add((branch,t))
  self.branches[branch].version+=1;return eid
