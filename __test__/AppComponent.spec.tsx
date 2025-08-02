import App from "../src/App";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

// React Routerのモック
jest.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Routes: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Route: ({ element }: { element: React.ReactNode }) => <div>{element}</div>,
}));

describe("title", () => {
  it("should render title", () => {
    render(<App />);
    expect(screen.getByText("推し祭壇")).toBeInTheDocument();
  });
});
