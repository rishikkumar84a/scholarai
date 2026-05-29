import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase SSR module
vi.mock("@supabase/ssr", () => ({
  createBrowserClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { access_token: "test-token-123" } },
      }),
    },
  })),
}));

describe("lib/supabase", () => {
  it("createClient returns a Supabase client", async () => {
    const { createClient } = await import("@/lib/supabase");
    const client = createClient();
    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
  });

  it("getSupabaseClient returns a singleton", async () => {
    const { getSupabaseClient } = await import("@/lib/supabase");
    const client1 = getSupabaseClient();
    const client2 = getSupabaseClient();
    expect(client1).toBe(client2);
  });
});

describe("lib/api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    });
  });

  it("api.get calls fetch with GET method", async () => {
    const { api } = await import("@/lib/api");
    await api.get("/test");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/test"),
      expect.objectContaining({ method: "GET" })
    );
  });

  it("api.post calls fetch with POST method and body", async () => {
    const { api } = await import("@/lib/api");
    await api.post("/test", { key: "value" });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/test"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ key: "value" }),
      })
    );
  });

  it("api attaches Authorization header from Supabase session", async () => {
    const { api } = await import("@/lib/api");
    await api.get("/test");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-token-123",
        }),
      })
    );
  });

  it("api.get throws on non-ok response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      text: vi.fn().mockResolvedValue("Not found"),
    });
    const { api } = await import("@/lib/api");
    await expect(api.get("/missing")).rejects.toThrow("API Error 404");
  });
});
