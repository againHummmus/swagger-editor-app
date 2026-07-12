import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SectionLabel from "./SectionLabel";

describe("SectionLabel", () => {
  it("renders its children", () => {
    render(<SectionLabel>Parameters</SectionLabel>);
    expect(screen.getByText("Parameters")).toBeInTheDocument();
  });
});
