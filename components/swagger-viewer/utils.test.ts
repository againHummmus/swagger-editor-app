import { describe, it, expect } from "vitest";
import { getBaseUrl, getEndpointGroups, buildCurl, groupParamsByLocation } from "./utils";
import type { ApiDocument, Endpoint, EndpointParam } from "./types";

describe('get baseUrl', () => {
  it('returns full url with no trailing slash for api with servers', () => {
    const apiWithServers = {
      servers: [{ url: 'https://api.example.com/' }],
    };
    expect(getBaseUrl(apiWithServers)).toBe('https://api.example.com');
  });

  it('returns full url with no trailing slash for api with hosts & basePath', () => {
    const apiWithHosts = {
      host: 'api.example.com',
      basePath: '/v1/'
    };
    expect(getBaseUrl(apiWithHosts)).toBe('https://api.example.com/v1');
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
                schema: {
                  type: "object",
                  required: ["name"],
                  properties: { name: { type: "string", description: "Pet name" } },
                },
              },
            },
          },
          post: {
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["name"],
                    properties: { name: { type: "string", description: "Pet name" } },
                  },
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
    expect(endpoints[0].responses[0].schemaFields).toEqual([
      { name: "name", type: "string", required: true, description: "Pet name" },
    ]);

    expect(endpoints[1].hasBody).toBe(true);
    expect(endpoints[1].requestBodyExample).toEqual({ name: "string" });
    expect(endpoints[1].requestBodyFields).toEqual([
      { name: "name", type: "string", required: true, description: "Pet name" },
    ]);
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

describe("groupParamsByLocation", () => {
  it("groups params by location, in a fixed order, skipping empty groups", () => {
    const parameters: EndpointParam[] = [
      { name: "verbose", in: "query", required: false, type: "boolean" },
      { name: "id", in: "path", required: true, type: "integer" },
      { name: "X-Token", in: "header", required: true, type: "string" },
    ];

    expect(groupParamsByLocation(parameters)).toEqual({
      path: [{ name: "id", in: "path", required: true, type: "integer" }],
      query: [{ name: "verbose", in: "query", required: false, type: "boolean" }],
      header: [{ name: "X-Token", in: "header", required: true, type: "string" }],
    });
  });

  it("returns an empty object when there are no parameters", () => {
    expect(groupParamsByLocation([])).toEqual({});
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
