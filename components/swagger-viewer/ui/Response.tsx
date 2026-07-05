import type { ResponseDetail } from '../types';
import CodeBlock from './CodeBlock';

function statusBadgeClass(status: string): string {
  const code = parseInt(status, 10);
  if (code >= 200 && code < 300) return 'bg-method-post/15 text-method-post';
  if (code >= 300 && code < 400) return 'bg-method-get/15 text-method-get';
  if (code >= 400 && code < 500) return 'bg-method-put/15 text-method-put';
  if (code >= 500) return 'bg-method-delete/15 text-method-delete';
  return 'bg-surface-muted text-muted';
}

export default function Response({ response, statusText, ok, headers, body }: {
  response: ResponseDetail;
  statusText?: string;
  ok?: boolean;
  headers?: Record<string, string>;
  body?: string;
}) {
  return (
    <li className={`flex flex-col ${statusBadgeClass(response.status)}`}>
      <div className="flex items-center gap-2 p-1">
        <span className={`rounded px-1.5 py-0.5 font-mono text-xs font-bold`}>
          {response.status}
        </span>
        {statusText && <span className="text-xs font-semibold">{statusText}</span>}
        {response.description && <span className="text-xs font-bold">{response.description}</span>}
        {ok === false && <span className="border border-method-delete rounded-full px-2 text-xs font-semibold text-method-delete">Failed</span>}
      </div>
      {headers && Object.keys(headers).length > 0 && (
        <CodeBlock>{Object.entries(headers).map(([name, value]) => `${name}: ${value}`).join('\n')}</CodeBlock>
      )}
      {response.example != null && <CodeBlock>{JSON.stringify(response.example, null, 2)}</CodeBlock>}
      {body != null && body !== '' && <CodeBlock>{body}</CodeBlock>}
    </li>
  );
}
