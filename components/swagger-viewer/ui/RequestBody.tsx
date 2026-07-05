import SectionLabel from './SectionLabel';
import SchemaTable from './SchemaTable';
import type { SchemaField } from '../types';

export default function RequestBody({
  fields = [],
  value,
  onChange,
}: {
  fields?: SchemaField[];
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <SectionLabel>Request Body</SectionLabel>
      <SchemaTable fields={fields} />
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        rows={10}
        className="w-full rounded border border-border bg-foreground/5 p-3 font-mono text-xs leading-relaxed outline-none focus:border-foreground/30"
      />
    </div>
  );
}
