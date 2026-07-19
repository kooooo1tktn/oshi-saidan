import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import { Posts } from "../src/pages/Posts";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { getPostById } from "../src/supabase/supabaseFunctions";

// モック：React Router
jest.mock("react-router-dom", () => ({
  Link: ({ to, children }: {to: string, children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
  useParams: jest.fn(() => ({id: "1"})),
}));

// モック：Supabase
jest.mock("../src/supabase/supabaseFunctions", () => ({
  getPostById: jest.fn(
    () =>
      Promise.resolve({
        id: 1,
        description: "test1",
        image_url: "test-image.jpg",
      }),
  ),
  getImageUrl: jest.fn(() => "https://example.com/test-image.jpg"),
}));

describe("投稿詳細ページ", () => {
    let queryClient: QueryClient;
    beforeEach(() => {
      queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
        },
      });
    })

  it("投稿画像と説明文が表示されること", async () => {
    render(
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <Posts />
        </QueryClientProvider>
      </ChakraProvider>,
    );

    const img = await screen.findByRole("img", { name: "投稿画像" });
    expect(img).toHaveAttribute("src", "https://example.com/test-image.jpg");
    expect(await screen.findByText("test1")).toBeInTheDocument();
  });

  it("投稿一覧へ戻るボタンが表示されていること", async () => {
    render(
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <Posts />
        </QueryClientProvider>
      </ChakraProvider>,
    );

    expect(
      await screen.findByRole("link", { name: "← ホームへ戻る" }),
    ).toBeInTheDocument();
  });

  it("投稿一覧へ戻るボタンを押すと投稿一覧画面に遷移すること", async () => {
    render(
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <Posts />
        </QueryClientProvider>
      </ChakraProvider>,
    );

    const backButton = await screen.findByRole("link", { name: "← ホームへ戻る" });
    expect(backButton).toHaveAttribute("href", "/");
  });

  it("存在しない投稿IDの場合、エラーメッセージが表示されること", async () => {
    (getPostById as jest.Mock).mockRejectedValueOnce(new Error("Not found"));

    render(
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <Posts />
        </QueryClientProvider>
      </ChakraProvider>,
    );

    expect(
      await screen.findByText(/投稿の取得に失敗しました/),
    ).toBeInTheDocument();
  });
});
