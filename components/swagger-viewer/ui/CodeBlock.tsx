export default function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="overflow-x-auto rounded bg-foreground/5 p-3 text-xs leading-relaxed">
      {children}
    </pre>
  );
}
