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
  requestBodyFields: [{ name: "name", type: "string", required: true }],
  responses: [{ status: "201", description: "Created" }],
};

describe("EndpointRow", () => {
  it("renders parameters, request body, responses and the curl generator", () => {
    render(<EndpointRow endpoint={endpoint} baseUrl="https://api.example.com" />);
    expect(screen.getByText("path", { selector: "p" })).toBeInTheDocument();
    expect(screen.getByText("Request Body")).toBeInTheDocument();
    expect(screen.getByText("Responses")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generate cURL!" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("id")).toBeInTheDocument();
  });

  it("renders schema fields for the request body", () => {
    render(<EndpointRow endpoint={endpoint} baseUrl="https://api.example.com" />);
    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText(": string")).toBeInTheDocument();
  });

  it("changes param values", () => {
    render(<EndpointRow endpoint={endpoint} baseUrl="https://api.example.com" />)
    const id = screen.getByPlaceholderText("id");
    fireEvent.change(id, { target: { value: "3" }})
    expect(id).toHaveValue(3);
  })

  it("toggles when user clicks on EndpointHeader", () => {
    render(<EndpointRow endpoint={endpoint} baseUrl="https://api.example.com" />)
    fireEvent.click(screen.getByRole("button", { name: /pets/i }));
    expect(screen.getByText("path", { selector: "p" })).toBeInTheDocument();
  })
});
