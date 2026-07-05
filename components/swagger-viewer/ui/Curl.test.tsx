import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Curl from "./Curl";
import type { Endpoint } from "../types";

const endpoint: Endpoint = {
  method: "get",
  path: "/pets",
  parameters: [],
  hasBody: false,
  responses: [],
};

describe("Curl", () => {
  it("generates and displays the curl command on click", () => {
    render(<Curl endpoint={endpoint} baseUrl="https://api.example.com" values={{}} />);
    expect(screen.queryByText(/curl -X GET/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Generate cURL!" }));

    expect(screen.getByText(/curl -X GET 'https:\/\/api\.example\.com\/pets'/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Regenerate cURL!" })).toBeInTheDocument();
  });

  it("copies the generated command to the clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<Curl endpoint={endpoint} baseUrl="https://api.example.com" values={{}} />);
    fireEvent.click(screen.getByRole("button", { name: "Generate cURL!" }));
    fireEvent.click(screen.getByRole("button", { name: "Copy" }));

    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("curl -X GET"));
    expect(await screen.findByText("Copied!")).toBeInTheDocument();
  });
});
