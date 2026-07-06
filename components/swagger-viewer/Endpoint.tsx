import { useState } from 'react';
import EndpointHeader from './ui/EndpointHeader';
import SectionLabel from './ui/SectionLabel';
import Param from './ui/Param';
import RequestBody from './ui/RequestBody';
import Response from './ui/Response';
import Curl from './ui/Curl';
import { groupParamsByLocation } from './utils';
import type { Endpoint } from './types';
import sendRequest, { type SendRequestResult } from './actions/sendRequest';

export default function EndpointRow({ endpoint, baseUrl }: { endpoint: Endpoint; baseUrl: string }) {
  const [open, setOpen] = useState(false);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [fileValues, setFileValues] = useState<Record<string, File>>({});
  const [response, setResponse] = useState<SendRequestResult>()
  const [bodyValue, setBodyValue] = useState(() =>
    endpoint.requestBodyExample != null ? JSON.stringify(endpoint.requestBodyExample, null, 2) : '{}'
  );

  const setParam = (name: string, value: string) =>
    setParamValues((prev) => ({ ...prev, [name]: value }));

  const setFile = (name: string, file: File | null) =>
    setFileValues((prev) => {
      if (!file) {
        return Object.fromEntries(Object.entries(prev).filter(([key]) => key !== name));
      }
      return { ...prev, [name]: file };
    });

  const paramGroups = Object.entries(groupParamsByLocation(endpoint.parameters));

  const sendRequestClient = async () => {
    const res = await sendRequest(
      endpoint,
      baseUrl,
      paramValues,
      endpoint.requestBodyExample != null ? bodyValue : undefined,
      fileValues
    )
    setResponse(res)
  }

  return (
    <li className="overflow-hidden rounded-2xl border border-border">
      <EndpointHeader
        endpoint={endpoint}
        open={open}
        onToggle={() => setOpen((v) => !v)}
      />

      <div
        className={`grid transition-all duration-200 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4 border-t border-border p-4">
            {paramGroups.map(
              ([location, params]) => (
                <div key={location} className="flex flex-col gap-2">
                  <SectionLabel>
                    {location}
                  </SectionLabel>
                  <ul className="flex flex-col gap-1">
                    {params.map((param) => (
                      <Param
                        key={param.name}
                        param={param}
                        value={paramValues[param.name] ?? ''}
                        onChange={(v) => setParam(param.name, v)}
                        onFileChange={(file) => setFile(param.name, file)}
                      />
                    ))}
                  </ul>
                </div>
              )
            )}

            {endpoint.requestBodyExample != null && (
              <RequestBody
                fields={endpoint.requestBodyFields}
                value={bodyValue}
                onChange={setBodyValue}
              />
            )}

            {endpoint.responses.length > 0 && (
              <div className="flex flex-col gap-2">
                <SectionLabel>Responses</SectionLabel>
                <ul className="flex flex-col gap-3">
                  {endpoint.responses.map((response) => (
                    <Response key={response.status} response={response} />
                  ))}
                </ul>
              </div>
            )}

            <div className="w-full flex flex-col gap-1">
              <Curl
                endpoint={endpoint}
                baseUrl={baseUrl}
                values={paramValues}
                body={endpoint.requestBodyExample != null ? bodyValue : undefined}
              />
              <button
                className="py-2 cursor-pointer w-full bg-black text-white rounded-md hover:bg-black/90"
                onClick={sendRequestClient}
              >
                Execute!
              </button>
            </div>
            {response && (
              <div className="flex flex-col gap-2">
                <SectionLabel>Result</SectionLabel>
                <ul className="flex flex-col gap-3">
                  <Response
                    response={{ status: response.status }}
                    statusText={response.statusText}
                    ok={response.ok}
                    headers={response.headers}
                    body={response.body}
                  />
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
