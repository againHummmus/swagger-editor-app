import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/test/intl";
import SwaggerViewer from "./index";
import type { ApiDocument } from "./types";

describe("SwaggerViewer", () => {
  it("shows a message when the schema has no endpoints", () => {
    render(<SwaggerViewer api={{}} />);
    expect(screen.getByText(/no endpoints found/i)).toBeInTheDocument();
  });

  it("renders a section per path with its endpoints", () => {
    const api: ApiDocument = {
      servers: [{ url: "https://api.example.com" }],
      paths: {
        "/pets": {
          get: { summary: "List pets", responses: {} },
        },
      },
    };

    render(<SwaggerViewer api={api} />);
    expect(screen.getByRole("heading", { name: "/pets" })).toBeInTheDocument();
    expect(screen.getByText("get")).toBeInTheDocument();
    expect(screen.getByText("List pets")).toBeInTheDocument();
  });
});
