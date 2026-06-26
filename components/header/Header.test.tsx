import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
  it("renders the brand name linking home", () => {
    render(<Header />);
    const brand = screen.getByRole("link", { name: /swagger editor/i });
    expect(brand).toHaveAttribute("href", "/");
  });

  it("renders navigation links to the main routes", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about",
    );
    expect(screen.getByRole("link", { name: "Sign In" })).toHaveAttribute(
      "href",
      "/signin",
    );
    expect(screen.getByRole("link", { name: "Sign Up" })).toHaveAttribute(
      "href",
      "/signup",
    );
  });

  it("renders an accessible language switcher button", () => {
    render(<Header />);
    expect(
      screen.getByRole("button", { name: /change language/i }),
    ).toBeInTheDocument();
  });

  it("toggles the mobile menu when the menu button is clicked", () => {
    render(<Header />);
    const toggle = screen.getByRole("button", { name: /toggle menu/i });

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.getAllByRole("link", { name: "Sign Up" })).toHaveLength(1);

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("link", { name: "Sign Up" })).toHaveLength(2);
  });

  it.each(["About", "Sign In", "Sign Up"])(
    "closes the mobile menu when the %s link inside it is clicked",
    (name) => {
      render(<Header />);
      const toggle = screen.getByRole("button", { name: /toggle menu/i });

      fireEvent.click(toggle);
      expect(toggle).toHaveAttribute("aria-expanded", "true");

      const mobileLink = screen.getAllByRole("link", { name })[1];
      fireEvent.click(mobileLink);

      expect(toggle).toHaveAttribute("aria-expanded", "false");
      expect(screen.getAllByRole("link", { name })).toHaveLength(1);
    },
  );
});
