import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Home from "./page";

describe("Home page", () => {
  it("renders", () => {
    const { container } = render(<Home />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
