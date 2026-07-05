import type { EndpointParam } from '../types';

function inputType(param: EndpointParam): React.HTMLInputTypeAttribute {
  if (param.in === 'formData' && param.type === 'file') return 'file';
  if (param.type === 'integer' || param.type === 'number') return 'number';
  if (param.type === 'boolean') return 'checkbox';
  return 'text';
}

export default function Param({ param, value, onChange, isTryOut }: {
  param: EndpointParam;
  value?: string;
  onChange?: (v: string) => void;
  isTryOut: boolean;
}) {
  const type = inputType(param);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'checkbox') onChange?.(e.target.checked ? 'true' : 'false');
    else if (type === 'file') onChange?.(e.target.files?.[0]?.name ?? '');
    else onChange?.(e.target.value);
  };

  return (
    <li className="flex items-center gap-3 rounded-lg bg-surface-muted px-3 py-2 text-sm">
      <div className="w-44 shrink-0">
        <p className="font-semibold">
          {param.name}
          {param.required && <span className="text-method-delete">*</span>}
          {param.type && <span className="font-normal italic text-muted">: {param.type}</span>}
        </p>
        <span className="text-xs text-muted">{param.in}</span>
      </div>
      {isTryOut && (
        type === 'checkbox' ? (
          <input
            type="checkbox"
            checked={value === 'true'}
            onChange={handleChange}
            className="size-4 accent-foreground"
          />
        ) : type === 'file' ? (
          <input
            type="file"
            onChange={handleChange}
            className="min-w-0 flex-1 cursor-pointer rounded-md border border-border bg-white p-1 text-xs text-muted"
          />
        ) : (
          <input
            type={type}
            placeholder={param.description ?? param.name}
            value={value ?? ''}
            onChange={handleChange}
            className="min-w-0 flex-1 rounded-md border border-border bg-surface px-3 py-1.5 outline-none placeholder:text-muted/60 focus:border-foreground/30"
          />
        )
      )}
      {!isTryOut && param.description && (
        <span className="text-xs text-muted">{param.description}</span>
      )}
    </li>
  );
}
