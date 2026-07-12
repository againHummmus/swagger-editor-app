import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/test/intl";
import Response from "./Response";
import type { ResponseDetail } from "../types";

describe("Response", () => {
  it("renders the status and description", () => {
    const response: ResponseDetail = { status: "200", description: "OK" };
    render(<Response response={response} />);
    expect(screen.getByText("200")).toBeInTheDocument();
    expect(screen.getByText("OK")).toBeInTheDocument();
  });

  it("renders response from sendRequest", () => {
    const response: ResponseDetail = { status: "404" };
    render(
      <Response
        response={response}
        statusText="Not Found"
        ok={false}
        headers={{ "content-type": "application/json" }}
        body={'{"error":"missing"}'}
      />
    );

    expect(screen.getByText("Not Found")).toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();
    expect(screen.getByText("content-type: application/json")).toBeInTheDocument();
    expect(screen.getByText('{"error":"missing"}')).toBeInTheDocument();
  });
});
