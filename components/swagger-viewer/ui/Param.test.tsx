import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Param from "./Param";
import type { EndpointParam } from "../types";

describe("Param", () => {
  it("shows the description when read-only", () => {
    const param: EndpointParam = { name: "id", in: "path", required: true, description: "Pet id", type: "integer" };
    render(<Param param={param} isTryOut={false} />);
    expect(screen.getByText("Pet id")).toBeInTheDocument();
  });

  it("calls onChange when text changes", () => {
    const onChange = vi.fn();
    const param: EndpointParam = { name: "q", in: "query", required: false, type: "string" };
    render(<Param param={param} isTryOut value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "hello" } });
    expect(onChange).toHaveBeenCalledWith("hello");
  });

  it("reports 'true'/'false' for a boolean param's checkbox", () => {
    const onChange = vi.fn();
    const param: EndpointParam = { name: "verbose", in: "query", required: false, type: "boolean" };
    render(<Param param={param} isTryOut value="false" onChange={onChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith("true");
  });
});
