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

// Mock config and utils
jest.mock("@/app/lib/config", () => ({
  getApiBaseUrl: () => "http://localhost:4000",
}));

jest.mock("@/app/lib/utils/requestId", () => ({
  getOrCreateRequestId: () => "test-request-id",
  requestIdResponseHeaders: () => ({}),
}));

jest.mock("@/lib/apiErrorHandler", () => ({
  createApiErrorResponse: jest.fn((err, opts) => {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: opts?.status || 500,
      headers: { "Content-Type": "application/json" },
    });
  }),
}));

jest.mock("@/app/lib/utils/normalizeConfession", () => ({
  normalizeConfession: (d: any) => d,
}));

describe("POST /api/confessions", () => {
  beforeAll(() => {
    // Ensure the module has the handlers
    jest.isolateModules(() => {
      require("@/app/api/confessions/route");
    });
  });

  it("should reject PUT with 405", async () => {
    // Import the route module
    const route = await import("@/app/api/confessions/route");
    const response = await route.PUT(new Request("http://localhost/api/confessions", { method: "PUT" }));
    expect(response.status).toBe(405);
    const body = await response.json();
    expect(body.code).toBe("METHOD_NOT_ALLOWED");
    expect(response.headers.get("Allow")).toBe("POST, GET");
  });

  it("should reject DELETE with 405", async () => {
    const route = await import("@/app/api/confessions/route");
    const response = await route.DELETE(new Request("http://localhost/api/confessions", { method: "DELETE" }));
    expect(response.status).toBe(405);
    const body = await response.json();
    expect(body.code).toBe("METHOD_NOT_ALLOWED");
    expect(response.headers.get("Allow")).toBe("POST, GET");
  });

  it("should reject PATCH with 405", async () => {
    const route = await import("@/app/api/confessions/route");
    const response = await route.PATCH(new Request("http://localhost/api/confessions", { method: "PATCH" }));
    expect(response.status).toBe(405);
    const body = await response.json();
    expect(body.code).toBe("METHOD_NOT_ALLOWED");
    expect(response.headers.get("Allow")).toBe("POST, GET");
  });
});

describe("GET /api/confessions/[id]", () => {
  it("should reject POST with 405", async () => {
    const route = await import("@/app/api/confessions/[id]/route");
    const response = await route.POST(
      new Request("http://localhost/api/confessions/123", { method: "POST" }),
      { params: Promise.resolve({ id: "123" }) }
    );
    expect(response.status).toBe(405);
    const body = await response.json();
    expect(body.code).toBe("METHOD_NOT_ALLOWED");
    expect(response.headers.get("Allow")).toBe("GET");
  });

  it("should reject PUT with 405", async () => {
    const route = await import("@/app/api/confessions/[id]/route");
    const response = await route.PUT(
      new Request("http://localhost/api/confessions/123", { method: "PUT" }),
      { params: Promise.resolve({ id: "123" }) }
    );
    expect(response.status).toBe(405);
    const body = await response.json();
    expect(body.code).toBe("METHOD_NOT_ALLOWED");
    expect(response.headers.get("Allow")).toBe("GET");
  });

  it("should reject DELETE with 405", async () => {
    const route = await import("@/app/api/confessions/[id]/route");
    const response = await route.DELETE(
      new Request("http://localhost/api/confessions/123", { method: "DELETE" }),
      { params: Promise.resolve({ id: "123" }) }
    );
    expect(response.status).toBe(405);
    const body = await response.json();
    expect(body.code).toBe("METHOD_NOT_ALLOWED");
    expect(response.headers.get("Allow")).toBe("GET");
  });
});
