import type { ReactNode } from "react";
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "../../test/intl";
import LanguageSwitcher from "./LanguageSwitcher";

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
  usePathname: () => "/about",
}));

describe("LanguageSwitcher", () => {
  it("renders a labelled language group with both locales", () => {
    renderWithIntl(<LanguageSwitcher />);
    expect(
      screen.getByRole("group", { name: /change language/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "EN" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "RU" })).toBeInTheDocument();
  });

  it("targets the current pathname for each locale", () => {
    renderWithIntl(<LanguageSwitcher />);
    expect(screen.getByRole("link", { name: "RU" })).toHaveAttribute(
      "href",
      "/about",
    );
    expect(screen.getByRole("link", { name: "RU" })).toHaveAttribute(
      "data-locale",
      "ru",
    );
  });
});
