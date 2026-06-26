import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import AboutPage from "./page";

describe("About page", () => {
  it("renders", () => {
    const { container } = render(<AboutPage />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
