import { describe, it, expect } from "vitest";
import { getBaseUrl, getEndpointGroups, buildCurl } from "./utils";
import type { ApiDocument, Endpoint, EndpointParam } from "./types";

describe("getBaseUrl", () => {
  it("uses the first OpenAPI 3 server url", () => {
    const api: ApiDocument = { servers: [{ url: "https://api.example.com/v1/" }] };
    expect(getBaseUrl(api)).toBe("https://api.example.com/v1");
  });

  it("builds a url from Swagger 2 host/schemes/basePath", () => {
    const api: ApiDocument = { host: "petstore.swagger.io", basePath: "/v2", schemes: ["http"] };
    expect(getBaseUrl(api)).toBe("http://petstore.swagger.io/v2");
  });

  it("returns an empty string when neither is present", () => {
    expect(getBaseUrl({})).toBe("");
  });
});

describe("getEndpointGroups", () => {
  it("groups endpoints by path and generates response/request examples", () => {
    const api: ApiDocument = {
      paths: {
        "/pets/{id}": {
          get: {
            summary: "Get pet",
            parameters: [{ name: "id", in: "path", required: true, type: "integer" }],
            responses: {
              "200": {
                description: "OK",
                schema: { type: "object", properties: { name: { type: "string" } } },
              },
            },
          },
          post: {
            requestBody: {
              content: {
                "application/json": {
                  schema: { type: "object", properties: { name: { type: "string" } } },
                },
              },
            },
            responses: { "201": { description: "Created" } },
          },
        },
      },
    };

    const groups = getEndpointGroups(api);
    expect(groups).toHaveLength(1);

    const [path, endpoints] = groups[0];
    expect(path).toBe("/pets/{id}");
    expect(endpoints.map((e) => e.method)).toEqual(["get", "post"]);

    expect(endpoints[0].parameters).toMatchObject([{ name: "id", in: "path", required: true }]);
    expect(endpoints[0].responses[0].example).toEqual({ name: "string" });

    expect(endpoints[1].hasBody).toBe(true);
    expect(endpoints[1].requestBodyExample).toEqual({ name: "string" });
  });

  it("detects Swagger 2 body parameters", () => {
    const api: ApiDocument = {
      paths: {
        "/pets": {
          post: {
            parameters: [{ name: "body", in: "body", schema: { type: "object" } }],
            responses: {},
          },
        },
      },
    };

    const [, endpoints] = getEndpointGroups(api)[0];
    expect(endpoints[0].hasBody).toBe(true);
  });

  it("skips paths with no recognized http methods", () => {
    const api: ApiDocument = { paths: { "/x": { parameters: [] } } };
    expect(getEndpointGroups(api)).toEqual([]);
  });
});

describe("buildCurl", () => {
  const parameters: EndpointParam[] = [
    { name: "id", in: "path", required: true, type: "integer" },
    { name: "verbose", in: "query", required: false, type: "boolean" },
    { name: "X-Token", in: "header", required: true, type: "string" },
  ];

  const endpoint: Endpoint = {
    method: "post",
    path: "/pets/{id}",
    parameters,
    hasBody: true,
    responses: [],
  };

  it("substitutes path/query params and adds a JSON body", () => {
    const curl = buildCurl(endpoint, "https://api.example.com", { id: "42", verbose: "true" }, '{"a":1}');

    expect(curl).toContain("curl -X POST 'https://api.example.com/pets/42?verbose=true'");
    expect(curl).toContain("-H 'X-Token: <X-Token>'");
    expect(curl).toContain(`-d '{"a":1}'`);
  });

  it("uses form-data flags instead of a JSON body when a formData param is present", () => {
    const fileEndpoint: Endpoint = {
      ...endpoint,
      parameters: [...parameters, { name: "file", in: "formData", required: true, type: "file" }],
    };

    const curl = buildCurl(fileEndpoint, "https://api.example.com");

    expect(curl).toContain("-F 'file=@<path/to/file>'");
    expect(curl).not.toContain("Content-Type");
  });
});
