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

export default function Response({ response }: { response: ResponseDetail }) {
  return (
    <li className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span className={`rounded px-1.5 py-0.5 font-mono text-xs font-bold ${statusBadgeClass(response.status)}`}>
          {response.status}
        </span>
        {response.description && <span className="text-xs text-muted">{response.description}</span>}
      </div>
      {response.example != null && <CodeBlock>{JSON.stringify(response.example, null, 2)}</CodeBlock>}
    </li>
  );
}
