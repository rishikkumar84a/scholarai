import { describe, it, expect, vi, beforeEach } from "vitest";
import { middleware } from "@/middleware";
import { NextRequest } from "next/server";

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: null },
      }),
    },
  })),
}));

describe("middleware", () => {
  it("redirects unauthenticated users from protected routes", async () => {
    const req = new NextRequest("http://localhost:3000/dashboard");
    const res = await middleware(req);
    
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/login?next=%2Fdashboard");
  });

  it("allows unauthenticated users to access public routes", async () => {
    const req = new NextRequest("http://localhost:3000/login");
    const res = await middleware(req);
    
    // Will not redirect (unless mocked as logged in, which we default to null above)
    // Next.js middleware returns a response with no location header if it passes through
    expect(res.headers.get("location")).toBeNull();
  });
});
