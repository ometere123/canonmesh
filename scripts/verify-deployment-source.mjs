import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync("DEPLOYMENT.json", "utf8"));
const digest = createHash("sha256").update(readFileSync("contracts/canonmesh.py")).digest("hex");
if (!manifest.contract_source_matches_deployment || digest !== manifest.deployed_contract_sha256 || digest !== manifest.current_contract_sha256) {
  console.error(`deployment source parity FAIL: local=${digest} deployed=${manifest.deployed_contract_sha256}`);
  process.exit(1);
}
console.log(`deployment source parity PASS: ${digest}`);
