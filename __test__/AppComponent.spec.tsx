import App from "../src/App";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("title", () => {
  it("should render title", () => {
    render(<App />);
    expect(screen.getByText("推し祭壇")).toBeInTheDocument();
  });
});
