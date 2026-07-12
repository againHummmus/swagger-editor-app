export default function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="overflow-x-auto rounded p-3 text-xs text-black/80 leading-relaxed">
      {children}
    </pre>
  );
}
