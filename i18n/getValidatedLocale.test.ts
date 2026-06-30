import { describe, it, expect, vi, beforeEach } from "vitest";

const { notFoundMock } = vi.hoisted(() => ({ notFoundMock: vi.fn() }));

vi.mock("next/navigation", () => ({
  notFound: notFoundMock,
}));

import { ensureLocale } from "./getValidatedLocale";

describe("ensureLocale", () => {
  beforeEach(() => {
    notFoundMock.mockClear();
  });

  it("returns a supported locale unchanged", () => {
    expect(ensureLocale("en")).toBe("en");
    expect(ensureLocale("ru")).toBe("ru");
    expect(notFoundMock).not.toHaveBeenCalled();
  });

  it("calls notFound for an unsupported locale", () => {
    ensureLocale("de");
    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });
});
