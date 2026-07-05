import { useState } from 'react';
import EndpointHeader from './ui/EndpointHeader';
import SectionLabel from './ui/SectionLabel';
import Param from './ui/Param';
import RequestBody from './ui/RequestBody';
import Response from './ui/Response';
import Curl from './ui/Curl';
import type { Endpoint } from './types';

export default function EndpointRow({ endpoint, baseUrl }: { endpoint: Endpoint; baseUrl: string }) {
  const [open, setOpen] = useState(false);
  const [tryOut, setTryOut] = useState(false);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [bodyValue, setBodyValue] = useState(() =>
    endpoint.requestBodyExample != null ? JSON.stringify(endpoint.requestBodyExample, null, 2) : '{}'
  );

  const setParam = (name: string, value: string) =>
    setParamValues((prev) => ({ ...prev, [name]: value }));

  return (
    <li className="overflow-hidden rounded-2xl border border-border">
      <EndpointHeader endpoint={endpoint} open={open} onToggle={() => setOpen((v) => !v)} />

      <div
        className={`grid transition-all duration-200 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4 border-t border-border p-4">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setTryOut((v) => !v)}
                className="cursor-pointer rounded bg-black text-white px-3 py-1 text-base font-bold transition-colors hover:bg-black/80"
              >
                {tryOut ? 'Cancel' : 'Try it out!'}
              </button>
            </div>

            {endpoint.parameters.length > 0 && (
              <div className="flex flex-col gap-2">
                <SectionLabel>Parameters</SectionLabel>
                <ul className="flex flex-col gap-1">
                  {endpoint.parameters.map((param) => (
                    <Param
                      key={param.in + param.name}
                      param={param}
                      isTryOut={tryOut}
                      value={tryOut ? (paramValues[param.name] ?? '') : undefined}
                      onChange={tryOut ? (v) => setParam(param.name, v) : undefined}
                    />
                  ))}
                </ul>
              </div>
            )}

            {endpoint.requestBodyExample != null && (
              <RequestBody
                example={endpoint.requestBodyExample}
                isTryOut={tryOut}
                value={tryOut ? bodyValue : undefined}
                onChange={tryOut ? setBodyValue : undefined}
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

            {tryOut && (
              <Curl
                endpoint={endpoint}
                baseUrl={baseUrl}
                values={paramValues}
                body={endpoint.requestBodyExample != null ? bodyValue : undefined}
              />
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
