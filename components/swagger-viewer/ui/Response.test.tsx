import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Response from "./Response";
import type { ResponseDetail } from "../types";

describe("Response", () => {
  it("renders the status and description", () => {
    const response: ResponseDetail = { status: "200", description: "OK" };
    render(<Response response={response} />);
    expect(screen.getByText("200")).toBeInTheDocument();
    expect(screen.getByText("OK")).toBeInTheDocument();
  });
});
