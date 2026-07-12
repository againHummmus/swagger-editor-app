import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SwaggerWrapper from './SwaggerWrapper';

vi.mock('@/components/swagger-editor/SwaggerEditor', () => ({
  default: () => <div data-testid="swagger-editor" />,
}));

vi.mock('@/components/swagger-viewer', () => ({
  default: () => <div data-testid="swagger-viewer" />,
}));

describe('SwaggerWrapper', () => {
  it('shows a loader when there is no validated schema', () => {
    render(<SwaggerWrapper savedSchema={null} initialApi={null} />);

    expect(
      screen.getByTestId('loader')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('swagger-viewer')).not.toBeInTheDocument();
  });

  it('renders SwaggerViewer when an api is provided', () => {
    render(
      <SwaggerWrapper savedSchema={null} initialApi={{ paths: {} }} />
    );

    expect(screen.getByTestId('swagger-viewer')).toBeInTheDocument();
  });
});
