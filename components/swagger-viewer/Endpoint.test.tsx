import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import EndpointRow from "./Endpoint";
import type { Endpoint } from "./types";

const endpoint: Endpoint = {
  method: "post",
  path: "/pets",
  summary: "Add a pet",
  parameters: [{ name: "id", in: "path", required: true, type: "integer" }],
  hasBody: true,
  requestBodyExample: { name: "doggie" },
  responses: [{ status: "201", description: "Created" }],
};

describe("EndpointRow", () => {
  it("renders parameters, request body and responses", () => {
    render(<EndpointRow endpoint={endpoint} baseUrl="https://api.example.com" />);
    expect(screen.getByText("Parameters")).toBeInTheDocument();
    expect(screen.getByText("Request Body")).toBeInTheDocument();
    expect(screen.getByText("Responses")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /generate cURL/i })).not.toBeInTheDocument();
  });

  it("shows the try-it-out form and curl generator when toggled", () => {
    render(<EndpointRow endpoint={endpoint} baseUrl="https://api.example.com" />);
    fireEvent.click(screen.getByRole("button", { name: "Try it out!" }));

    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generate cURL!" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("id")).toBeInTheDocument();
  });

  it("changes param values when tryOut===true", () => {
    render(<EndpointRow endpoint={endpoint} baseUrl="https://api.example.com" />)
    fireEvent.click(screen.getByRole("button", { name: "Try it out!" }));
    const id = screen.getByPlaceholderText("id");
    fireEvent.change(id, { target: { value: "3" }})
    expect(id).toHaveValue(3);
  })

  it("toggles when user clicks on EndpointHeader", () => {
    render(<EndpointRow endpoint={endpoint} baseUrl="https://api.example.com" />)
    fireEvent.click(screen.getByRole("button", { name: /pets/i }));
    expect(screen.getByText("Parameters")).toBeInTheDocument();
  })
});
