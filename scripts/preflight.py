from pathlib import Path
import ast,json,sys
ROOT=Path(__file__).resolve().parents[1];contract=ROOT/"contracts/canonmesh.py"
try:ast.parse(contract.read_text())
except SyntaxError as exc:print(f"contract syntax: FAIL: {exc}");sys.exit(1)
required=json.loads((ROOT/"lib/genlayer/required-methods.json").read_text());source=contract.read_text();missing=[n for n in required if f"def {n}(" not in source];forbidden=[p for p in["app/api","pages/api","services","backend"] if(ROOT/p).exists()]
if missing or forbidden:
 print("preflight: FAIL");print("missing:",missing);print("forbidden:",forbidden);sys.exit(1)
print(f"preflight: PASS ({len(required)} required contract methods; no backend paths)")
