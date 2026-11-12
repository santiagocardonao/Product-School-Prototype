import { describe, it, expect, vi, afterEach } from "vitest";
import { allow } from "./rateLimit";

afterEach(() => vi.useRealTimers());

describe("allow (rate limit)", () => {
  it("lets 5 requests through per minute and blocks the 6th", () => {
    const ip = "test-ip-six";
    const results = Array.from({ length: 6 }, () => allow(ip));
    expect(results).toEqual([true, true, true, true, true, false]);
  });

  it("counts each IP separately", () => {
    for (let i = 0; i < 5; i++) allow("ip-a");
    expect(allow("ip-a")).toBe(false);
    expect(allow("ip-b")).toBe(true);
  });

  it("allows requests again once the window has passed", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-12T12:00:00Z"));
    for (let i = 0; i < 5; i++) allow("ip-window");
    expect(allow("ip-window")).toBe(false);
    vi.setSystemTime(new Date("2026-11-12T12:01:01Z"));
    expect(allow("ip-window")).toBe(true);
  });
});
