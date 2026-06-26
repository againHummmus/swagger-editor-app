import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import SignUpPage from "./page";

describe("Sign up page", () => {
  it("renders", () => {
    const { container } = render(<SignUpPage />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
