import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { New } from "../src/pages/New";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { createPosts } from "../src/supabase/supabaseFunctions";

// モック：React Router
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(() => mockNavigate),
}));

// モック：Supabase
jest.mock("../src/supabase/supabaseFunctions", () => ({
  createPosts: jest.fn(() => Promise.resolve()),
}));

// モック：URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => "mock-url");

describe("新規投稿ページ", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("投稿作成画面に投稿ボタンとキャンセルボタンがあること", () => {
    render(
      <ChakraProvider>
        <New />
      </ChakraProvider>,
    );

    expect(
      screen.getByRole("button", { name: /投稿する/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "キャンセル" }),
    ).toBeInTheDocument();
  });

  it("初期状態は投稿ボタンがdisabledであること", () => {
    render(
      <ChakraProvider>
        <New />
      </ChakraProvider>,
    );

    expect(screen.getByRole("button", { name: /投稿する/ })).toBeDisabled();
  });

  it("投稿画像未選択の場合、投稿ボタンがdisabledであること", () => {
    render(
      <ChakraProvider>
        <New />
      </ChakraProvider>,
    );

    const textarea = screen.getByRole("textbox");

    fireEvent.change(textarea, { target: { value: "説明文テスト入力" } });
    fireEvent.blur(textarea);

    expect(screen.getByRole("button", { name: /投稿する/ })).toBeDisabled();
  });

  it("説明文未入力の場合、投稿ボタンがdisabledであること", async () => {
    const { container } = render(
      <ChakraProvider>
        <New />
      </ChakraProvider>,
    );

    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const mockFile = new File(["dummy"], "test.jpeg", { type: "image/jpeg" });

    fireEvent.change(fileInput, { target: { files: [mockFile] } });
    fireEvent.blur(fileInput);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /投稿する/ })).toBeDisabled();
    });
  });

  it("投稿画像、説明文を入力すると投稿ボタンがenabledになること", async () => {
    const { container } = render(
      <ChakraProvider>
        <New />
      </ChakraProvider>,
    );

    const user = userEvent.setup();
    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const mockFile = new File(["dummy"], "test.jpeg", { type: "image/jpeg" });
    const textarea = screen.getByRole("textbox");

    await user.upload(fileInput, mockFile);
    fireEvent.blur(fileInput);
    fireEvent.change(textarea, { target: { value: "説明文テスト入力" } });
    fireEvent.blur(textarea);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /投稿する/ })).toBeEnabled();
    });
  });

  it("キャンセルボタンは常にenabledであること", () => {
    render(
      <ChakraProvider>
        <New />
      </ChakraProvider>,
    );

    expect(screen.getByRole("button", { name: "キャンセル" })).toBeEnabled();
  });

  it("バリデーションエラーメッセージが表示されること", async () => {
    const { container } = render(
      <ChakraProvider>
        <New />
      </ChakraProvider>,
    );

    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const textarea = screen.getByRole("textbox");

    fireEvent.blur(fileInput);
    fireEvent.blur(textarea);

    expect(await screen.findByText("画像は必須です")).toBeInTheDocument();
    expect(
      await screen.findByText("説明文の入力は必須です"),
    ).toBeInTheDocument();
  });

  it("キャンセルボタンで投稿一覧画面に戻れること", async () => {
    render(
      <ChakraProvider>
        <New />
      </ChakraProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "キャンセル" }));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("投稿成功後、一覧画面に遷移しフォームがリセットされること", async () => {
    const { container } = render(
      <ChakraProvider>
        <New />
      </ChakraProvider>,
    );

    const user = userEvent.setup();
    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const mockFile = new File(["dummy"], "test.jpeg", { type: "image/jpeg" });
    const textarea = screen.getByRole("textbox");

    await user.upload(fileInput, mockFile);
    fireEvent.blur(fileInput);
    fireEvent.change(textarea, { target: { value: "説明文テスト入力" } });
    fireEvent.blur(textarea);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /投稿する/ })).toBeEnabled();
    });
    await userEvent.click(screen.getByRole("button", { name: /投稿する/ }));

    await waitFor(() => {
      expect(textarea).toHaveValue("");
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("投稿失敗時、エラーメッセージが表示されること", async () => {
    (createPosts as jest.Mock).mockRejectedValueOnce(new Error("Not found"));

    const { container } = render(
      <ChakraProvider>
        <New />
      </ChakraProvider>,
    );

    const user = userEvent.setup();
    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const mockFile = new File(["dummy"], "test.jpeg", { type: "image/jpeg" });
    const textarea = screen.getByRole("textbox");

    await user.upload(fileInput, mockFile);
    fireEvent.blur(fileInput);
    fireEvent.change(textarea, { target: { value: "説明文テスト入力" } });
    fireEvent.blur(textarea);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /投稿する/ })).toBeEnabled();
    });
    await userEvent.click(screen.getByRole("button", { name: /投稿する/ }));

    expect(await screen.findByText(/投稿に失敗しました。/)).toBeInTheDocument();
  });
});
