import { methodNotAllowed } from "@/app/lib/api/proxy";

// Mock the proxy module
jest.mock("@/app/lib/api/proxy", () => ({
  methodNotAllowed: jest.fn((method: string, allowed: string[]) => {
    return new Response(
      JSON.stringify({
        code: "METHOD_NOT_ALLOWED",
        message: `Method ${method} is not allowed. Use ${allowed.join(", ")}.`,
      }),
      {
        status: 405,
        headers: { Allow: allowed.join(", ") },
      }
    );
  }),
}));

jest.mock("@/app/lib/config", () => ({
  getApiBaseUrl: () => "http://localhost:4000",
}));

jest.mock("@/lib/apiErrorHandler", () => ({
  createApiErrorResponse: jest.fn((err, opts) => {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: opts?.status || 500,
      headers: { "Content-Type": "application/json" },
    });
  }),
}));

describe("GET /api/users/profile", () => {
  it("should reject POST with 405", async () => {
    const route = await import("@/app/api/users/profile/route");
    const response = await route.POST(new Request("http://localhost/api/users/profile", { method: "POST" }));
    expect(response.status).toBe(405);
    const body = await response.json();
    expect(body.code).toBe("METHOD_NOT_ALLOWED");
    expect(response.headers.get("Allow")).toBe("GET, PATCH");
  });

  it("should reject DELETE with 405", async () => {
    const route = await import("@/app/api/users/profile/route");
    const response = await route.DELETE(new Request("http://localhost/api/users/profile", { method: "DELETE" }));
    expect(response.status).toBe(405);
    const body = await response.json();
    expect(body.code).toBe("METHOD_NOT_ALLOWED");
    expect(response.headers.get("Allow")).toBe("GET, PATCH");
  });
});

describe("GET /api/users/stats", () => {
  it("should reject POST with 405", async () => {
    const route = await import("@/app/api/users/stats/route");
    const response = await route.POST(new Request("http://localhost/api/users/stats", { method: "POST" }));
    expect(response.status).toBe(405);
    const body = await response.json();
    expect(body.code).toBe("METHOD_NOT_ALLOWED");
    expect(response.headers.get("Allow")).toBe("GET");
  });
});

describe("GET /api/notifications", () => {
  it("should reject POST with 405", async () => {
    const route = await import("@/app/api/notifications/route");
    const response = await route.POST(new Request("http://localhost/api/notifications", { method: "POST" }));
    expect(response.status).toBe(405);
    const body = await response.json();
    expect(body.code).toBe("METHOD_NOT_ALLOWED");
    expect(response.headers.get("Allow")).toBe("GET");
  });
});
