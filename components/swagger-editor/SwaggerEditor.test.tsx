import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithIntl as render } from '@/test/intl';
import SwaggerEditor from './SwaggerEditor';
import SwaggerParser from '@apidevtools/swagger-parser';

vi.mock('@monaco-editor/react', () => ({
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string | undefined) => void;
  }) => (
    <textarea
      data-testid="monaco-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock('@/app/actions/schema', () => ({
  saveSchema: vi.fn(),
}));

vi.mock('@apidevtools/swagger-parser', () => ({
  default: {
    validate: vi.fn(),
  },
}));

describe('SwaggerEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders editor, toggle and validate buttons', () => {
    render(<SwaggerEditor onValidated={() => {}} onError={() => {}} savedSchema={{ content: '', format: 'yaml' }} />);
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /convert to/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /validate/i })).toBeInTheDocument();
  });

  it('initial format YAML', () => {
    render(<SwaggerEditor onValidated={() => {}} onError={() => {}} savedSchema={{ content: '', format: 'yaml' }} />);
    expect(screen.getByText('YAML')).toBeInTheDocument();
  });

  it('auto-detects YAML', () => {
    render(<SwaggerEditor onValidated={() => {}} onError={() => {}} savedSchema={{ content: '', format: 'yaml' }} />);
    const editor = screen.getByTestId('monaco-editor');

    fireEvent.change(editor, {
      target: {
        value: `
          openapi: 3.0.0
          info:
            title: Sample API
            version: 1.0.0
            description: A sample API to get started
          paths:
            /hello:
              get:
                summary: Say hello1111
                responses:
                  '200':
                    description: Successful response
    `,
      },
    });

    expect(screen.getByText('YAML')).toBeInTheDocument();
  });

  it('auto-detects JSON', async () => {
    render(<SwaggerEditor onValidated={() => {}} onError={() => {}} savedSchema={{ content: '', format: 'yaml' }} />);
    const editor = screen.getByTestId('monaco-editor');

    fireEvent.change(editor, {
      target: {
        value: `
        {
          "openapi": "3.0.0",
          "info": {
            "title": "Sample API",
            "version": "1.0.0",
            "description": "A sample API to get started"
          },
          "paths": {
            "/hello": {
              "get": {
                "summary": "Say hello1111",
                "responses": {
                  "200": {
                    "description": "Successful response"
                  }
                }
              }
            }
          }
        }
    `,
      },
    });

    await waitFor(() => {
      expect(screen.getByText('JSON')).toBeInTheDocument();
    });
  });

  it('invalid schema', () => {
    const onError = vi.fn();
    render(<SwaggerEditor onValidated={() => {}} onError={onError} savedSchema={{ content: '', format: 'yaml' }} />);
    const editor = screen.getByTestId('monaco-editor');

    fireEvent.change(editor, { target: { value: '{ invalid json' } });
    fireEvent.click(screen.getByRole('button', { name: /convert to/i }));

    expect(onError).toHaveBeenCalledWith(expect.stringMatching(/cannot convert/i));
  });

  it('valid schema is validated', async () => {
    vi.mocked(SwaggerParser.validate).mockResolvedValueOnce({} as never);
    const onValidated = vi.fn();
    render(
      <SwaggerEditor
        onValidated={onValidated}
        onError={() => {}}
        savedSchema={{ content: '', format: 'yaml' }}
      />
    );
    const editor = screen.getByTestId('monaco-editor');
    fireEvent.change(editor, {
      target: {
        value: `
          openapi: 3.0.0
          info:
            title: Sample API
            version: 1.0.0
            description: A sample API to get started
          paths:
            /hello:
              get:
                summary: Say hello1111
                responses:
                  '200':
                    description: Successful response
    `,
      },
    });

    await waitFor(
      () => expect(onValidated).toHaveBeenCalledWith(expect.anything()),
      { timeout: 3000 }
    );
  });
});