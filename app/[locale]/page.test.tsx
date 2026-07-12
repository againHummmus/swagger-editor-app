import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import Home from "./page";

vi.mock('@/app/actions/schema', () => ({
  getSavedSchema: vi.fn().mockResolvedValue({ data: null, error: null }),
}));

vi.mock('@utils/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
  }),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string) => key,
  setRequestLocale: () => {},
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  hasLocale: () => true,
}));

describe("Home page", () => {
  it("renders", async () => {
    const ui = await Home({ params: Promise.resolve({ locale: "en" }) });
    const { container } = render(ui);
    expect(container.firstChild).toBeInTheDocument();
  });
});
