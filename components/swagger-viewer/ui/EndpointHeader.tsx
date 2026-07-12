import { ChevronDown } from 'lucide-react';
import type { Endpoint } from '../types';

const METHOD_CLASS: Record<string, string> = {
  get: 'bg-method-get',
  post: 'bg-method-post',
  put: 'bg-method-put',
  delete: 'bg-method-delete',
};

export default function EndpointHeader({ endpoint, open, onToggle }: {
  endpoint: Endpoint;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="cursor-pointer flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-foreground/3"
    >
      <span
        className={`shrink-0 rounded px-2 py-0.5 text-xs font-bold uppercase text-surface ${METHOD_CLASS[endpoint.method] ?? 'bg-muted'}`}
      >
        {endpoint.method}
      </span>
      <span className="font-mono text-sm">{endpoint.path}</span>
      {endpoint.summary && (
        <span className="truncate text-sm text-muted">{endpoint.summary}</span>
      )}
      <ChevronDown
        className={`ml-auto size-4 shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      />
    </button>
  );
}
