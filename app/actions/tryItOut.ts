'use server'

import { groupParamsByLocation } from "@/components/swagger-viewer/utils";
import type { Endpoint } from "@/components/swagger-viewer/types";
import { logRequest } from "./requestHistory";

export type SendRequestResult = {
  status: string;
  statusText: string;
  ok: boolean;
  headers: Record<string, string>;
  body: string;
};

export type RequestLog = {
  id: string;
  method: string;
  endpoint: string;
  url: string;
  status_code: number | null;
  duration_ms: number | null;
  request_size: number | null;
  response_size: number | null;
  error_details: string | null;
  created_at: string;
};

export type RequestLogEntry = Omit<RequestLog, 'id' | 'created_at'>;

const byteLength = (text: string) => new TextEncoder().encode(text).length;

export async function sendRequest(
  endpoint: Endpoint,
  baseUrl: string,
  paramValues: Record<string, string> = {},
  body?: string,
  files: Record<string, File> = {}
): Promise<SendRequestResult> {
  const paramValue = (name: string) => paramValues[name] ?? "";
  const {
    path: pathParams = [],
    query: queryParams = [],
    header: headerParams = [],
    cookie: cookieParams = [],
    formData: formDataParams = [],
  } = groupParamsByLocation(endpoint.parameters);

  const path = pathParams.reduce(
    (path, param) => path.replace(`{${param.name}}`, paramValue(param.name)),
    endpoint.path
  );

  const url = new URL(`${baseUrl}${path}`);
  for (const param of queryParams) {
    url.searchParams.set(param.name, paramValue(param.name));
  }

  const headers = new Headers();
  for (const param of headerParams) {
    headers.set(param.name, paramValue(param.name));
  }
  if (cookieParams.length > 0) {
    headers.set("Cookie", cookieParams.map((param) => `${param.name}=${paramValue(param.name)}`).join("; "));
  }

  let requestBody: BodyInit | undefined;
  let requestSize = 0;
  if (formDataParams.length > 0) {
    const formData = new FormData();
    for (const param of formDataParams) {
      const file = files[param.name];
      formData.set(param.name, file ?? paramValue(param.name));
      requestSize += file ? file.size : byteLength(paramValue(param.name));
    }
    requestBody = formData;
  } else if (endpoint.hasBody) {
    headers.set("Content-Type", "application/json");
    requestBody = body ?? "{}";
    requestSize = byteLength(requestBody);
  }

  const method = endpoint.method.toUpperCase();
  const startedAt = performance.now();

  try {
    const res = await fetch(url.toString(), {
      method,
      headers,
      body: requestBody,
    });
    const responseBody = await res.text();

    await logRequest({
      method,
      endpoint: endpoint.path,
      url: url.toString(),
      status_code: res.status,
      duration_ms: Math.round(performance.now() - startedAt),
      request_size: requestSize,
      response_size: byteLength(responseBody),
      error_details: res.ok ? null : `${res.status} ${res.statusText}`.trim(),
    });

    return {
      status: res.status.toString(),
      statusText: res.statusText,
      ok: res.ok,
      headers: Object.fromEntries(res.headers.entries()),
      body: responseBody,
    };
  } catch (e) {
    await logRequest({
      method,
      endpoint: endpoint.path,
      url: url.toString(),
      status_code: null,
      duration_ms: Math.round(performance.now() - startedAt),
      request_size: requestSize,
      response_size: 0,
      error_details: e instanceof Error ? e.message : "Request failed",
    });
    throw e;
  }
}
