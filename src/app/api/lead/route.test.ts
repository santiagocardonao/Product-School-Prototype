import { describe, it, expect, vi } from "vitest";
import { POST } from "./route";

const post = (body: unknown) =>
  POST(new Request("http://test/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }));

describe("POST /api/lead", () => {
  it("accepts a valid lead, returns an id and logs it for the CRM", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const res = await post({ email: "vp@acme.com", source: "team_calculator", data: { seats: 12 } });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.leadId).toMatch(/[0-9a-f-]{36}/);
    expect(log).toHaveBeenCalledWith("[crm.createLead]", expect.stringContaining("vp@acme.com"));
    log.mockRestore();
  });

  it("rejects an invalid email with 400", async () => {
    const res = await post({ email: "not-an-email", source: "advisor" });
    expect(res.status).toBe(400);
  });

  it("rejects an unknown source with 400", async () => {
    const res = await post({ email: "a@b.co", source: "newsletter" });
    expect(res.status).toBe(400);
  });

  it("rejects a body that is not JSON with 400", async () => {
    const res = await POST(new Request("http://test/api/lead", { method: "POST", body: "{oops" }));
    expect(res.status).toBe(400);
  });
});
