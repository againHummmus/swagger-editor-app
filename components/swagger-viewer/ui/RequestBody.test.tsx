import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RequestBody from "./RequestBody";

describe("RequestBody", () => {
  it("shows a read-only example when no onChange is isTryOut = flase", () => {
    render(<RequestBody example={{ name: "doggie" }} isTryOut={false} />);
    expect(screen.getByText(/"name": "doggie"/)).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("shows an editable textarea and reports changes", () => {
    const onChange = vi.fn();
    render(<RequestBody example={{}} isTryOut value='{"a":1}' onChange={onChange} />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue('{"a":1}');
    fireEvent.change(textarea, { target: { value: '{"a":2}' } });
    expect(onChange).toHaveBeenCalledWith('{"a":2}');
  });
});
