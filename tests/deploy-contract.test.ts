import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const deployScript = readFileSync(
  resolve(import.meta.dirname, "../scripts/spartaco-deploy.sh"),
  "utf8",
);

describe("Spartaco deploy contract", () => {
  it("captures and restores the previous release when a public gate fails", () => {
    expect(deployScript).toContain("PREVIOUS_IMAGE=");
    expect(deployScript).toContain("PREVIOUS_VERSION=");
    expect(deployScript).toContain("PREVIOUS_REVISION=");
    expect(deployScript).toContain("trap rollback_on_failure EXIT");
    expect(deployScript).toContain("trap 'exit 143' TERM");
    expect(deployScript).toContain("kubectl apply -f -\" < \"$PREVIOUS_CONFIG");
    expect(deployScript).toContain("rollout undo deployment/atlarium-mcp");
    expect(deployScript).toContain("set image deployment/atlarium-mcp");
    expect(deployScript).toContain("mcp:monitor:public");
    expect(deployScript).toContain("mcp:validate:public");
    expect(deployScript).toContain("mcp:conformance:public");
    expect(deployScript).toContain('verify_version_endpoint "public health" "$PACKAGE_VERSION"');
    expect(deployScript).toContain('verify_deployment_state "$IMAGE:$TAG"');
    expect(deployScript).toContain("-l app.kubernetes.io/name=atlarium-mcp -o json");
    expect(deployScript).not.toContain("-l app=atlarium-mcp");
    expect(deployScript.indexOf("ROLLBACK_ARMED=false\ncleanup_temp")).toBeGreaterThan(
      deployScript.indexOf("mcp:conformance:public"),
    );
    expect(deployScript.indexOf("directories:submit -- --check")).toBeGreaterThan(
      deployScript.indexOf("ROLLBACK_ARMED=false\ncleanup_temp"),
    );
    expect(deployScript).not.toMatch(/kubectl kustomize[^\n]*\|/);
    expect(deployScript).not.toMatch(/get secret[^\n]*\|/);
  });
});
