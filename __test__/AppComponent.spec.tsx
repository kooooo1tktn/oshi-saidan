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
  useParams: jest.fn(() => ({ id: '1' })),
  useNavigate: () => jest.fn(),
}));

// Supabaseのモック
jest.mock("../src/supabase/supabaseFunctions.ts", () => ({
  getPosts: jest.fn(() => Promise.resolve([])),
  getPostById: jest.fn(() => Promise.resolve({id: 1, description: "test"})),
  getImageUrl: jest.fn(() => Promise.resolve([])),
}));

describe("title", () => {
  it("should render title", async () => {
    render(
      <App />
    );

    const titleElement = await screen.findByText("推し祭壇");
    expect(titleElement).toBeInTheDocument();
  });
});
