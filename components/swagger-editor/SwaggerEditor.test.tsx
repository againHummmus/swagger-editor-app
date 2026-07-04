import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
    render(<SwaggerEditor savedSchema={{ content: '', format: 'yaml' }} />);
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /convert to/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /validate/i })).toBeInTheDocument();
  });

  it('initial format YAML', () => {
    render(<SwaggerEditor savedSchema={{ content: '', format: 'yaml' }} />);
    expect(screen.getByText('YAML')).toBeInTheDocument();
  });

  it('auto-detects YAML', () => {
    render(<SwaggerEditor savedSchema={{ content: '', format: 'yaml' }} />);
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
    render(<SwaggerEditor savedSchema={{ content: '', format: 'yaml' }} />);
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
    render(<SwaggerEditor savedSchema={{ content: '', format: 'yaml' }} />);
    const editor = screen.getByTestId('monaco-editor');

    fireEvent.change(editor, { target: { value: '{ invalid json' } });
    fireEvent.click(screen.getByRole('button', { name: /convert to/i }));

    expect(screen.getByText(/cannot convert/i)).toBeInTheDocument();
  });

  it('valid schema is validated', async () => {
    vi.mocked(SwaggerParser.validate).mockResolvedValueOnce({} as never);

    render(<SwaggerEditor savedSchema={{ content: '', format: 'yaml' }} />);
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

    fireEvent.click(screen.getByRole('button', { name: /validate/i }));

    await waitFor(() => {
      expect(screen.getByText(/schema is valid/i)).toBeInTheDocument();
    });
  });
});