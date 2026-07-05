export type HttpMethod = "get" | "post" | "put" | "delete" | "patch" | "options" | "head";
export type ParamLocation = "path" | "query" | "header" | "cookie" | "formData";

export type ApiDocument = {
  paths?: Record<string, unknown>;
  servers?: { url: string }[];
  host?: string;
  basePath?: string;
  schemes?: string[];
  [key: string]: unknown;
};

export type EndpointParam = {
  name: string;
  in: ParamLocation;
  required: boolean;
  description?: string;
  type?: string;
};

export type ResponseDetail = {
  status: string;
  description?: string;
  example?: unknown;
};

export type Endpoint = {
  method: HttpMethod;
  path: string;
  summary?: string;
  parameters: EndpointParam[];
  hasBody: boolean;
  requestBodyExample?: unknown;
  responses: ResponseDetail[];
};
