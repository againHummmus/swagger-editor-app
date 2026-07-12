import type { ReactNode } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

const messages: Record<string, string> = {
  copyright: "© 2026 Swagger Editor App.",
  about: "About",
};

vi.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string) => messages[key] ?? key,
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    locale,
    children,
  }: {
    href: string;
    locale?: string;
    children: ReactNode;
  }) => (
    <a href={href} data-locale={locale}>
      {children}
    </a>
  ),
}));

describe("Footer", () => {
  it("renders the copyright notice", async () => {
    render(await Footer({ locale: "en" }));
    expect(screen.getByText(/swagger editor app/i)).toBeInTheDocument();
  });

  it("links to the about page for the active locale", async () => {
    render(await Footer({ locale: "en" }));
    const link = screen.getByRole("link", { name: "About" });
    expect(link).toHaveAttribute("href", "/about");
    expect(link).toHaveAttribute("data-locale", "en");
  });
});
