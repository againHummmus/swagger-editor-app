import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import Home from "./page";

vi.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string) => key,
  setRequestLocale: () => {},
}));

describe("Home page", () => {
  it("renders", async () => {
    const ui = await Home({ params: Promise.resolve({ locale: "en" }) });
    const { container } = render(ui);
    expect(container.firstChild).toBeInTheDocument();
  });
});
