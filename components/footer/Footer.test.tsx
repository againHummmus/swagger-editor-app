import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders the copyright notice", () => {
    render(<Footer />);
    expect(
      screen.getByText(/swagger editor app/i),
    ).toBeInTheDocument();
  });

  it("links to the about page", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about",
    );
  });
});
