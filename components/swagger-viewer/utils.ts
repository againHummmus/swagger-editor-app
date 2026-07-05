import type { HttpMethod, ParamLocation, EndpointParam, Endpoint, ApiDocument } from "./types";

const HTTP_METHODS: HttpMethod[] = ["get", "post", "put", "delete", "patch", "options", "head"];
const PARAM_LOCATIONS = new Set<string>(["path", "query", "header", "cookie", "formData"]);
const SCALAR_EXAMPLES: Record<string, unknown> = { integer: 0, number: 0, boolean: true };

type Schema = Record<string, unknown>;
type Param = { name: string; in: string; required?: boolean; description?: string; schema?: Schema; type?: string };
type Response = { description?: string; schema?: unknown; content?: Record<string, { schema?: unknown }> };
type Operation = {
  summary?: string;
  parameters?: Param[];
  requestBody?: { content?: Record<string, { schema?: unknown }> };
  responses?: Record<string, Response>;
};
type PathItem = { parameters?: Param[] } & Partial<Record<HttpMethod, Operation>>;

function generateExample(schema: unknown, depth = 0): unknown {
  if (depth > 8 || typeof schema !== "object" || schema === null) return null;
  const node = schema as Schema;

  if ("example" in node) return node.example;
  if (Array.isArray(node.enum)) return node.enum[0];

  const type = node.type as string | undefined;
  const properties = node.properties as Schema | undefined;

  if (properties || type === "object") {
    return Object.fromEntries(
      Object.entries(properties ?? {}).map(([key, value]) => [key, generateExample(value, depth + 1)])
    );
  }

  if (type === "array") return node.items != null ? [generateExample(node.items, depth + 1)] : [];
  return type !== undefined && type in SCALAR_EXAMPLES ? SCALAR_EXAMPLES[type] : "string";
}

function paramType({ schema, type }: Param): string | undefined {
  const schemaType = schema?.type;
  return Array.isArray(schemaType) ? schemaType.join(" | ") : typeof schemaType === "string" ? schemaType : type;
}

function toEndpoint(method: HttpMethod, path: string, item: PathItem, operation: Operation): Endpoint {
  const parameters: EndpointParam[] = [];
  let hasBody = Boolean(operation.requestBody);
  let bodySchema: unknown = Object.values(operation.requestBody?.content ?? {})[0]?.schema;

  for (const param of [...(item.parameters ?? []), ...(operation.parameters ?? [])]) {
    if (PARAM_LOCATIONS.has(param.in)) {
      parameters.push({
        name: param.name,
        in: param.in as ParamLocation,
        required: Boolean(param.required),
        description: param.description,
        type: paramType(param),
      });
    } else if (param.in === "body") {
      hasBody = true;
      bodySchema = param.schema;
    }
  }

  return {
    method,
    path,
    summary: operation.summary,
    parameters,
    hasBody,
    requestBodyExample: generateExample(bodySchema),
    responses: Object.entries(operation.responses ?? {}).map(([status, response]) => ({
      status,
      description: response.description,
      example: generateExample(response.schema ?? Object.values(response.content ?? {})[0]?.schema),
    })),
  };
}

export function getBaseUrl(api: ApiDocument): string {
  if ("servers" in api && api.servers?.length) return api.servers[0].url.replace(/\/$/, "");
  if ("host" in api && api.host) {
    const scheme = api.schemes?.[0] ?? "https";
    return `${scheme}://${api.host}${api.basePath ?? ""}`.replace(/\/$/, "");
  }
  return "";
}

export function getEndpointGroups(api: ApiDocument): [string, Endpoint[]][] {
  const groups: [string, Endpoint[]][] = [];

  for (const [path, raw] of Object.entries(api.paths ?? {})) {
    const item = raw as PathItem | undefined;
    if (!item) continue;

    const endpoints = HTTP_METHODS.flatMap((method) => {
      const operation = item[method];
      return operation ? [toEndpoint(method, path, item, operation)] : [];
    });

    if (endpoints.length > 0) groups.push([path, endpoints]);
  }

  return groups;
}

export function buildCurl(
  endpoint: Endpoint,
  baseUrl: string,
  values: Record<string, string> = {},
  body?: string
): string {
  const value = (name: string) => values[name] ?? `<${name}>`;

  const url = endpoint.parameters
    .filter((param) => param.in === "path")
    .reduce((url, param) => url.replace(`{${param.name}}`, value(param.name)), `${baseUrl}${endpoint.path}`);

  const query = endpoint.parameters
    .filter((param) => param.in === "query")
    .map((param) => `${param.name}=${value(param.name)}`)
    .join("&");

  const headerParts = endpoint.parameters
    .filter((param) => param.in === "header")
    .map((param) => `-H '${param.name}: ${value(param.name)}'`);

  const formDataParams = endpoint.parameters.filter((param) => param.in === "formData");
  const formDataParts = formDataParams.map((param) => {
    const fileValue = param.type === "file" ? `@${values[param.name] ?? `<path/to/${param.name}>`}` : value(param.name);
    return `-F '${param.name}=${fileValue}'`;
  });

  const parts = [
    `curl -X ${endpoint.method.toUpperCase()} '${url}${query ? `?${query}` : ""}'`,
    ...headerParts,
    ...formDataParts,
  ];

  if (endpoint.hasBody && formDataParams.length === 0) {
    parts.push(`-H 'Content-Type: application/json'`, `-d '${body ?? "{}"}'`);
  }

  return parts.join(" \\\n  ");
}
