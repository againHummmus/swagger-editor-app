import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import EndpointHeader from "./EndpointHeader";
import type { Endpoint } from "../types";

const mockEndpoint: Endpoint = {
  method: "get",
  path: "/pets/{id}",
  summary: "Get pet",
  parameters: [],
  hasBody: false,
  responses: [],
};

describe("EndpointHeader", () => {
  it("shows the method, path and summary", () => {
    render(<EndpointHeader endpoint={mockEndpoint} open={false} onToggle={() => {}} />);
    expect(screen.getByText("get")).toBeInTheDocument();
    expect(screen.getByText("/pets/{id}")).toBeInTheDocument();
    expect(screen.getByText("Get pet")).toBeInTheDocument();
  });

  it("calls onToggle when clicked", () => {
    const onToggle = vi.fn();
    render(<EndpointHeader endpoint={mockEndpoint} open={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
