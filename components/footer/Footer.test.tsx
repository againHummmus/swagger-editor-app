import type { ReactNode } from "react";
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@test/intl";
import Footer from "./Footer";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("Footer", () => {
  it("renders the copyright notice", () => {
    renderWithIntl(<Footer />);
    expect(screen.getByText(/swagger editor app/i)).toBeInTheDocument();
  });

  it("links to the about page", () => {
    renderWithIntl(<Footer />);
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about",
    );
  });
});
