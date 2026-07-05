import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RequestBody from "./RequestBody";

describe("RequestBody", () => {
  it("shows an editable textarea and reports changes", () => {
    const onChange = vi.fn();
    render(<RequestBody value='{"a":1}' onChange={onChange} />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue('{"a":1}');
    fireEvent.change(textarea, { target: { value: '{"a":2}' } });
    expect(onChange).toHaveBeenCalledWith('{"a":2}');
  });

  it("renders the schema fields above the example", () => {
    render(
      <RequestBody
        fields={[{ name: "name", type: "string", required: true, description: "Pet name" }]}
        value="{}"
      />
    );
    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText(": string")).toBeInTheDocument();
    expect(screen.getByText("Pet name")).toBeInTheDocument();
  });
});
