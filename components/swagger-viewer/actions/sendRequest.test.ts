import { describe, it, expect, vi, beforeEach } from "vitest";
import sendRequest from "./sendRequest";
import type { Endpoint } from "../types";

const baseEndpoint: Endpoint = {
  method: "get",
  path: "/pets",
  parameters: [],
  hasBody: false,
  responses: [],
};

describe("sendRequest", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null)));
  });

  it("builds the url and headers from params, and returns the parsed response", async () => {
    const endpoint: Endpoint = {
      ...baseEndpoint,
      path: "/pets/{id}",
      parameters: [
        { name: "id", in: "path", required: true, type: "integer" },
        { name: "verbose", in: "query", required: false, type: "boolean" },
        { name: "X-Token", in: "header", required: true, type: "string" },
      ],
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response('{"id":1}', {
          status: 201,
          statusText: "Created",
          headers: { "content-type": "application/json" },
        })
      )
    );

    const result = await sendRequest(endpoint, "https://api.example.com", {
      id: "42",
      verbose: "true",
      "X-Token": "secret",
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/pets/42?verbose=true",
      expect.objectContaining({ method: "GET" })
    );
    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect((init!.headers as Headers).get("X-Token")).toBe("secret");
    expect(result).toEqual({
      status: "201",
      statusText: "Created",
      ok: true,
      headers: { "content-type": "application/json" },
      body: '{"id":1}',
    });
  });

  it("sends a JSON body and content-type header when the endpoint has a body", async () => {
    const endpoint: Endpoint = { ...baseEndpoint, method: "post", hasBody: true };

    await sendRequest(endpoint, "https://api.example.com", {}, '{"name":"doggie"}');

    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect(init!.body).toBe('{"name":"doggie"}');
    expect((init!.headers as Headers).get("Content-Type")).toBe("application/json");
  });

  it("sends cookie params as a Cookie header", async () => {
    const endpoint: Endpoint = {
      ...baseEndpoint,
      parameters: [
        { name: "session", in: "cookie", required: true, type: "string" },
        { name: "theme", in: "cookie", required: false, type: "string" },
      ],
    };

    await sendRequest(endpoint, "https://api.example.com", { session: "abc123", theme: "dark" });

    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect((init!.headers as Headers).get("Cookie")).toBe("session=abc123; theme=dark");
  });

  it("sends formData params as a File or a string, skipping the JSON content-type", async () => {
    const endpoint: Endpoint = {
      ...baseEndpoint,
      method: "post",
      hasBody: true,
      parameters: [
        { name: "file", in: "formData", required: true, type: "file" },
        { name: "note", in: "formData", required: false, type: "string" },
      ],
    };
    const file = new File(["content"], "photo.png", { type: "image/png" });

    await sendRequest(endpoint, "https://api.example.com", { note: "hi" }, undefined, { file });

    const [, init] = vi.mocked(fetch).mock.calls[0];
    const formData = init!.body as FormData;
    expect(formData.get("file")).toBe(file);
    expect(formData.get("note")).toBe("hi");
    expect((init!.headers as Headers).has("Content-Type")).toBe(false);
  });
});
