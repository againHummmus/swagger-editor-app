import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CodeBlock from "./CodeBlock";

describe("CodeBlock", () => {
  it("renders its children inside a <pre>", () => {
    render(<CodeBlock>{'{"a":1}'}</CodeBlock>);
    expect(screen.getByText('{"a":1}').tagName).toBe("PRE");
  });
});
