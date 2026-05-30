import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import { Home } from "../src/pages/Home";
import { getPosts } from "../src/supabase/supabaseFunctions";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// モック：React Router
jest.mock("react-router-dom", () => ({
  Link: ({ children }: { children: React.ReactNode }) => (
    <a href="/">{children}</a>
  ),
}));

// モック：Supabase
jest.mock("../src/supabase/supabaseFunctions", () => ({
  getPosts: jest.fn(() =>
    Promise.resolve([
      { id: 1, description: "test1", image_url: "test-image.jpg" },
    ]),
  ),
  getImageUrl: jest.fn(() => "https://example.com/test-image.jpg"),
}));

describe("投稿一覧ページ", () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    (getPosts as jest.Mock).mockImplementation(() =>
      Promise.resolve([
        { id: 1, description: "test1", image_url: "test-image.jpg" },
      ]),
    );
  });

  it("ローディング表示が出ること", async () => {
    (getPosts as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <Home />
        </QueryClientProvider>
      </ChakraProvider>,
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("投稿一覧が表示されること", async () => {
    render(
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <Home />
        </QueryClientProvider>
      </ChakraProvider>,
    );

    expect(await screen.findByText("test1")).toBeInTheDocument();
  });

  it("投稿が０件の場合、空状態のメッセージが表示されること", async () => {
    (getPosts as jest.Mock).mockImplementation(() => Promise.resolve([]));

    render(
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <Home />
        </QueryClientProvider>
      </ChakraProvider>,
    );

    expect(
      await screen.findByText("まだ投稿がありません ✦"),
    ).toBeInTheDocument();
  });

  it("各投稿がクリック可能なリンクであること", async () => {
    render(
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <Home />
        </QueryClientProvider>
      </ChakraProvider>,
    );

    expect(await screen.findAllByRole("link")).toHaveLength(1);
  });

  it("投稿一覧に画像サムネイルが表示されていること", async () => {
    render(
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <Home />
        </QueryClientProvider>
      </ChakraProvider>,
    );

    const img = await screen.findByRole("img", { name: "投稿画像" });
    expect(img).toHaveAttribute("src", "https://example.com/test-image.jpg");
  });
});
