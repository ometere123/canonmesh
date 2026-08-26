import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync("DEPLOYMENT.json", "utf8"));
// Deployment evidence was captured on Windows; normalize line endings so the
// same Git source hashes identically on Windows and Linux CI.
const source = readFileSync("contracts/canonmesh.py", "utf8").replace(/\r\n?/g, "\n");
const digest = createHash("sha256").update(source, "utf8").digest("hex");
if (!manifest.contract_source_matches_deployment || digest !== manifest.deployed_contract_sha256_normalized || digest !== manifest.current_contract_sha256) {
  console.error(`deployment source parity FAIL: local=${digest} deployed-normalized=${manifest.deployed_contract_sha256_normalized}`);
  process.exit(1);
}
console.log(`deployment source parity PASS: ${digest}`);
