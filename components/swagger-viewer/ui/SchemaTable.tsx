import type { SchemaField } from '../types';

export default function SchemaTable({ fields }: { fields: SchemaField[] }) {
  if (fields.length === 0) return null;

  return (
    <ul className="flex flex-col gap-1">
      {fields.map((field) => (
        <li key={field.name} className="flex flex-col gap-0.5 rounded-lg bg-surface-muted px-3 py-2 text-sm">
          <p className="font-semibold">
            {field.name}
            {field.required && <span className="text-method-delete">*</span>}
            {field.type && <span className="font-normal italic text-muted">: {field.type}</span>}
          </p>
          {field.description && <span className="text-xs text-muted">{field.description}</span>}
        </li>
      ))}
    </ul>
  );
}
