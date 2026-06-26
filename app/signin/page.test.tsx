import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import SignInPage from "./page";

describe("Sign in page", () => {
  it("renders", () => {
    const { container } = render(<SignInPage />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
