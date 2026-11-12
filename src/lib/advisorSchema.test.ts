import { describe, it, expect } from "vitest";
import { AdvisorResult, SAMPLE_RESULT, SYSTEM_PROMPT } from "./advisorSchema";
import { CATALOG } from "@/data/catalog";

const valid = structuredClone(SAMPLE_RESULT);

describe("AdvisorResult schema", () => {
  it("accepts the sample path", () => {
    expect(AdvisorResult.safeParse(valid).success).toBe(true);
  });

  it("rejects a course that is not in the catalog", () => {
    const invented = { ...valid, path: [...valid.path.slice(0, 1), { courseSlug: "blockchain-for-pms", why: "x" }] };
    expect(AdvisorResult.safeParse(invented).success).toBe(false);
  });

  it("rejects a path with fewer than 2 courses", () => {
    expect(AdvisorResult.safeParse({ ...valid, path: valid.path.slice(0, 1) }).success).toBe(false);
  });

  it("rejects a path with more than 4 courses", () => {
    const five = CATALOG.slice(0, 5).map((c) => ({ courseSlug: c.slug, why: "x" }));
    expect(AdvisorResult.safeParse({ ...valid, path: five }).success).toBe(false);
  });

  it("rejects a plan that does not exist", () => {
    expect(AdvisorResult.safeParse({ ...valid, recommendedPlan: "free_trial" }).success).toBe(false);
  });
});

describe("SYSTEM_PROMPT", () => {
  it("lists every catalog course so the model can only pick real ones", () => {
    for (const c of CATALOG) expect(SYSTEM_PROMPT).toContain(c.slug);
  });

  it("states the public prices", () => {
    expect(SYSTEM_PROMPT).toContain("$2,999");
    expect(SYSTEM_PROMPT).toContain("$3,999");
    expect(SYSTEM_PROMPT).toContain("$4,999");
  });
});
