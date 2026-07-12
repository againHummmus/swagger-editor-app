import type { ReactNode } from "react";
import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithIntl } from "@test/intl";
import LanguageSwitcher from "./LanguageSwitcher";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    locale,
    children,
    onClick,
  }: {
    href: string;
    locale?: string;
    children: ReactNode;
    onClick?: () => void;
  }) => (
    <a href={href} data-locale={locale} onClick={onClick}>
      {children}
    </a>
  ),
  usePathname: () => "/about",
}));

describe("LanguageSwitcher", () => {
  it("renders a trigger to change language, closed by default", () => {
    renderWithIntl(<LanguageSwitcher />);

    const trigger = screen.getByRole("button", { name: /change language/i });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent("EN");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("opens the dropdown and lists both locales", () => {
    renderWithIntl(<LanguageSwitcher />);

    fireEvent.click(screen.getByRole("button", { name: /change language/i }));

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "EN" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "RU" })).toBeInTheDocument();
  });

  it("targets the current pathname for each locale", () => {
    renderWithIntl(<LanguageSwitcher />);

    fireEvent.click(screen.getByRole("button", { name: /change language/i }));

    const ruLink = screen.getByRole("link", { name: "RU" });
    expect(ruLink).toHaveAttribute("href", "/about");
    expect(ruLink).toHaveAttribute("data-locale", "ru");
  });

  it("closes the dropdown when clicking outside", () => {
    renderWithIntl(<LanguageSwitcher />);

    fireEvent.click(screen.getByRole("button", { name: /change language/i }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
