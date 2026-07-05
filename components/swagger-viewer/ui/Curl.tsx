import { useState } from 'react';
import SectionLabel from './SectionLabel';
import CodeBlock from './CodeBlock';
import { buildCurl } from '../utils';
import type { Endpoint } from '../types';

export default function Curl({ endpoint, baseUrl, values, body }: {
  endpoint: Endpoint;
  baseUrl: string;
  values: Record<string, string>;
  body?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [curl, setCurl] = useState('');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(curl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      {curl && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <SectionLabel>cURL</SectionLabel>
            <button type="button" onClick={handleCopy} className="text-xs text-muted transition-colors hover:text-foreground">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <CodeBlock>{curl}</CodeBlock>
        </div>
      )}
      <button
        type="button"
        onClick={() => setCurl(buildCurl(endpoint, baseUrl, values, body))}
        className="block cursor-pointer rounded-xs border border-border transition-all hover:bg-border/30"
      >
        {curl ? 'Regenerate' : 'Generate'} cURL!
      </button>
    </>
  );
}
