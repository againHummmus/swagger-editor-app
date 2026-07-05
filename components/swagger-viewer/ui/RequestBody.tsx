import SectionLabel from './SectionLabel';
import CodeBlock from './CodeBlock';

export default function RequestBody({ example, value, onChange, isTryOut }: {
  example: unknown;
  value?: string;
  onChange?: (v: string) => void;
  isTryOut: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <SectionLabel>Request Body</SectionLabel>
      {isTryOut ? (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          rows={10}
          className="w-full rounded border border-border bg-foreground/5 p-3 font-mono text-xs leading-relaxed outline-none focus:border-foreground/30"
        />
      ) : (
        <CodeBlock>{JSON.stringify(example, null, 2)}</CodeBlock>
      )}
    </div>
  );
}
