import { describe, expect, it, vi } from "vitest";

import {
  assertContract,
  ContractValidationError,
  publicProbeRetryOptions,
  transientToolResultError,
  withTransientRetries,
} from "../scripts/public-probe-retry.mjs";

describe("public probe retries", () => {
  it("recovers from transient failures with bounded exponential delays", async () => {
    const operation = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("fetch failed"))
      .mockRejectedValueOnce(new Error("upstream timed out"))
      .mockResolvedValue("ok");
    const sleep = vi.fn().mockResolvedValue(undefined);

    await expect(
      withTransientRetries(operation, { attempts: 3, delayMs: 25, sleep }),
    ).resolves.toBe("ok");
    expect(operation).toHaveBeenCalledTimes(3);
    expect(sleep).toHaveBeenNthCalledWith(1, 25);
    expect(sleep).toHaveBeenNthCalledWith(2, 50);
  });

  it("fails immediately for contract regressions", async () => {
    const operation = vi.fn(() => assertContract(false, "missing public tool"));
    const sleep = vi.fn().mockResolvedValue(undefined);

    await expect(
      withTransientRetries(operation, { attempts: 3, sleep }),
    ).rejects.toBeInstanceOf(ContractValidationError);
    expect(operation).toHaveBeenCalledTimes(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it("preserves the sanitized MCP tool error in the terminal failure", async () => {
    const operation = vi.fn(() => {
      throw transientToolResultError("suggest_species_for_tank", {
        isError: true,
        content: [
          {
            type: "text",
            text: "atlarium_api_timeout: Atlarium public API timed out.",
          },
        ],
      });
    });

    await expect(
      withTransientRetries(operation, {
        attempts: 2,
        delayMs: 1,
        sleep: vi.fn().mockResolvedValue(undefined),
      }),
    ).rejects.toThrow(
      "suggest_species_for_tank returned an MCP tool error: atlarium_api_timeout: Atlarium public API timed out.",
    );
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it("validates retry configuration before running a probe", () => {
    expect(
      publicProbeRetryOptions({
        MCP_PUBLIC_PROBE_ATTEMPTS: "4",
        MCP_PUBLIC_PROBE_RETRY_DELAY_MS: "250",
      }),
    ).toEqual({ attempts: 4, delayMs: 250 });
    expect(() =>
      publicProbeRetryOptions({ MCP_PUBLIC_PROBE_ATTEMPTS: "0" }),
    ).toThrow("MCP_PUBLIC_PROBE_ATTEMPTS must be an integer from 1 to 5");
    expect(() =>
      publicProbeRetryOptions({ MCP_PUBLIC_PROBE_RETRY_DELAY_MS: "30001" }),
    ).toThrow(
      "MCP_PUBLIC_PROBE_RETRY_DELAY_MS must be an integer from 1 to 30000",
    );
  });
});
