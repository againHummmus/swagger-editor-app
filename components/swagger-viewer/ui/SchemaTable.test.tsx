import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SchemaTable from "./SchemaTable";

describe("SchemaTable", () => {
  it("renders nothing when there are no fields", () => {
    const { container } = render(<SchemaTable fields={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders name, type, required marker and description", () => {
    render(
      <SchemaTable
        fields={[
          { name: "id", type: "integer", required: true, description: "Unique id" },
          { name: "tag", type: "string", required: false },
        ]}
      />
    );

    expect(screen.getByText("id")).toBeInTheDocument();
    expect(screen.getByText(": integer")).toBeInTheDocument();
    expect(screen.getByText("Unique id")).toBeInTheDocument();
    expect(screen.getByText("tag")).toBeInTheDocument();
    expect(screen.getByText(": string")).toBeInTheDocument();
  });
});
