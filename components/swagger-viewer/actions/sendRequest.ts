'use server'

import { groupParamsByLocation } from "../utils";
import type { Endpoint } from "../types";

export type SendRequestResult = {
  status: string;
  statusText: string;
  ok: boolean;
  headers: Record<string, string>;
  body: string;
};

export default async function sendRequest(
  endpoint: Endpoint,
  baseUrl: string,
  values: Record<string, string> = {},
  body?: string,
  files: Record<string, File> = {}
): Promise<SendRequestResult> {
  const value = (name: string) => values[name] ?? "";
  const {
    path: pathParams = [],
    query: queryParams = [],
    header: headerParams = [],
    cookie: cookieParams = [],
    formData: formDataParams = [],
  } = groupParamsByLocation(endpoint.parameters);

  const path = pathParams.reduce(
    (path, param) => path.replace(`{${param.name}}`, value(param.name)),
    endpoint.path
  );

  const url = new URL(`${baseUrl}${path}`);
  for (const param of queryParams) {
    url.searchParams.set(param.name, value(param.name));
  }

  const headers = new Headers();
  for (const param of headerParams) {
    headers.set(param.name, value(param.name));
  }
  if (cookieParams.length > 0) {
    headers.set("Cookie", cookieParams.map((param) => `${param.name}=${value(param.name)}`).join("; "));
  }

  let requestBody: BodyInit | undefined;
  if (formDataParams.length > 0) {
    const formData = new FormData();
    for (const param of formDataParams) {
      const file = files[param.name];
      formData.set(param.name, file ?? value(param.name));
    }
    requestBody = formData;
  } else if (endpoint.hasBody) {
    headers.set("Content-Type", "application/json");
    requestBody = body ?? "{}";
  }

  const res = await fetch(url.toString(), {
    method: endpoint.method.toUpperCase(),
    headers,
    body: requestBody,
  });

  return {
    status: res.status.toString(),
    statusText: res.statusText,
    ok: res.ok,
    headers: Object.fromEntries(res.headers.entries()),
    body: await res.text(),
  };
}
