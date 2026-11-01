import type { ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Home } from "../src/pages/Home";
import { New } from "../src/pages/New";
import { createPosts, getPosts } from "../src/supabase/supabaseFunctions";

// ページの表示・送信制御を検証する。実際の.envやSupabaseには接続しない。
const mockDemoSettings = { enabled: false };
const mockNavigate = jest.fn();
jest.mock("../src/config/demo", () => ({
  get isDemoMode() {
    return mockDemoSettings.enabled;
  },
}));
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));
jest.mock("../src/supabase/supabaseFunctions", () => ({
  createPosts: jest.fn(),
  getPosts: jest.fn(),
  getImageUrl: jest.fn(() => "https://example.com/sample.jpg"),
}));

const modes = [
  { label: "デモ", enabled: true },
  { label: "通常", enabled: false },
];

function expectNotice(enabled: boolean) {
  const notice = screen.queryByRole("complementary", { name: "公開デモのご案内" });
  if (enabled) {
    expect(notice).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /自分の保存先で使う/ })).toHaveAttribute(
      "href", "https://github.com/kooooo1tktn/oshi-saidan#setup",
    );
  } else {
    expect(notice).not.toBeInTheDocument();
  }
}

describe.each(modes)("$labelモード：一覧の状態と案内", ({ enabled }) => {
  let queryClient: QueryClient;

  beforeEach(() => {
    mockDemoSettings.enabled = enabled;
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    jest.mocked(getPosts).mockReset();
  });

  afterEach(() => {
    cleanup();
    queryClient.clear();
  });

  function renderHome() {
    return render(
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <Home />
        </QueryClientProvider>
      </ChakraProvider>,
    );
  }

  it("読み込み中も共通の画面を返す", () => {
    jest.mocked(getPosts).mockImplementation(() => new Promise(() => {}));
    renderHome();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expectNotice(enabled);
  });

  it("取得失敗時にエラーを表示する", async () => {
    jest.mocked(getPosts).mockRejectedValue(new Error("取得テスト失敗"));
    renderHome();
    expect(await screen.findByText(/投稿の取得に失敗しました: 取得テスト失敗/)).toBeInTheDocument();
    expectNotice(enabled);
  });

  it("投稿0件時に空状態を表示する", async () => {
    jest.mocked(getPosts).mockResolvedValue([]);
    renderHome();
    expect(await screen.findByText("まだ投稿がありません ✦")).toBeInTheDocument();
    expectNotice(enabled);
  });

  it("投稿ありではカードと詳細へのリンクを表示する", async () => {
    jest.mocked(getPosts).mockResolvedValue([
      { id: 1, description: "サンプル投稿", image_url: "sample.jpg" },
    ]);
    renderHome();
    expect(await screen.findByRole("link", { name: /サンプル投稿/ })).toHaveAttribute("href", "/posts/1");
    expectNotice(enabled);
  });
});

describe.each(modes)("$labelモード：入力と送信", ({ enabled }) => {
  beforeEach(() => {
    mockDemoSettings.enabled = enabled;
    mockNavigate.mockReset();
    jest.mocked(createPosts).mockReset().mockResolvedValue({
      id: "test-upload", path: "posts/test", fullPath: "post-images/posts/test",
    });
    URL.createObjectURL = jest.fn(() => "blob:preview-test");
  });

  async function fillForm() {
    const user = userEvent.setup();
    const { container } = render(<ChakraProvider><New /></ChakraProvider>);
    // 現在のファイル入力には関連付けられたlabelがないため、typeで取得する。
    const input = container.querySelector<HTMLInputElement>('input[type="file"]')!;
    const file = new File(["test image"], "demo.png", { type: "image/png" });
    await user.upload(input, file);
    await user.type(screen.getByRole("textbox"), "入力体験テスト");
    await user.tab();
    return { user, container, file };
  }

  it("画像プレビューと文章入力を残し、モードに応じて投稿ボタンを制御する", async () => {
    const { user, container, file } = await fillForm();
    expectNotice(enabled);
    expect(screen.getByRole("textbox")).toHaveValue("入力体験テスト");
    expect(URL.createObjectURL).toHaveBeenCalledWith(file);
    expect(container.querySelector("img")).toHaveAttribute("src", "blob:preview-test");
    const submitButton = screen.getByRole("button", { name: /投稿する/ });
    if (enabled) {
      expect(submitButton).toBeDisabled();
      await user.click(submitButton);
    } else {
      await waitFor(() => expect(submitButton).toBeEnabled());
    }
    // 画像選択だけでは保存処理を開始しない。
    expect(createPosts).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("ボタンを経由しない有効なフォーム送信もモードに従う", async () => {
    const { container, file } = await fillForm();
    // disabledの有無とは独立に、実際のRHF検証とonSubmitを通す。
    // actをawaitし、非同期のフォーム処理が終わってから未呼び出しを判定する。
    await act(async () => {
      fireEvent.submit(container.querySelector("form")!);
    });
    if (enabled) {
      expect(createPosts).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(screen.getByRole("textbox")).toHaveValue("入力体験テスト");
    } else {
      // 同じ入力で通常時に呼ばれることが、入力不備による停止でない証拠になる。
      expect(createPosts).toHaveBeenCalledTimes(1);
      expect(createPosts).toHaveBeenCalledWith(file, "入力体験テスト");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    }
  });
});
