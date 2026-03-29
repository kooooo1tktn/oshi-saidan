import App from "../src/App";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
  Link: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
}));

// Supabaseのモック
jest.mock("../src/supabase/supabaseFunctions.ts", () => ({
  getPosts: jest.fn(() => Promise.resolve([{id: 1, description: "test", image_url: ""}])),
  getPostById: jest.fn(() => Promise.resolve({id: 1, description: "test"})),
  getImageUrl: jest.fn(() => Promise.resolve([])),
}));

describe("title", () => {
  it("should render title", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    );

    const titleElement = await screen.findByText("推し祭壇");
    expect(titleElement).toBeInTheDocument();
  });
});
