import type { ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { cleanup, render, screen } from "@testing-library/react";
import { PostCard } from "../src/components/PostCard";
import type { Post } from "../src/types";

// 接続部分とモードだけを置き換え、実際の対応表・カード・バッジを検証する。
const mockDemoSettings = { enabled: false };
jest.mock("../src/config/demo", () => ({
  get isDemoMode() {
    return mockDemoSettings.enabled;
  },
}));
jest.mock("../src/supabase/supabaseFunctions", () => ({
  getImageUrl: (path: string) => `https://example.test/${path}`,
}));
jest.mock("react-router-dom", () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

const registeredPaths = [
  { path: "demo/01-how-to.png", label: "使い方", alt: "薄紫の机に、羽のあるミント色のマスコットの写真、カメラ、白紙のノートを並べた様子。" },
  { path: "demo/02-sample-sorane.png", label: "サンプル", alt: "朝の光が差す棚に、星のランタンを持つ架空の人物のアクリルスタンドと缶バッジ、青いリボンを飾った様子。" },
  { path: "demo/03-sample-popo.png", label: "サンプル", alt: "暖かい灯りの横に、紫の冠羽と青い翼の小鳥のぬいぐるみ、同じ小鳥のチャームを並べた様子。" },
];

// 同じ投稿の画像パスだけを変え、IDや文章に依存せず選べることも確認する。
function renderPostCard(path: string) {
  const post: Post = {
    id: 42,
    description: "飾った日の記録",
    image_url: path,
  };
  render(<ChakraProvider><PostCard post={post} /></ChakraProvider>);
  return post;
}

// バッジの有無にかかわらず、投稿の内容と詳細リンクが残っていることを確認する。
function expectPostContent(post: Post, alt = "投稿画像") {
  expect(screen.getByText(post.description)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /飾った日の記録/ })).toHaveAttribute(
    "href", `/posts/${post.id}`,
  );
  expect(screen.getByRole("img", { name: alt })).toHaveAttribute(
    "src", `https://example.test/${post.image_url}`,
  );
}

describe.each([
  { mode: "デモ", enabled: true },
  { mode: "通常", enabled: false },
])("$modeモード：投稿カードのバッジ", ({ enabled }) => {
  beforeEach(() => {
    mockDemoSettings.enabled = enabled;
  });

  afterEach(cleanup);

  it.each(registeredPaths)(
    "登録済みの $path はモードに応じて $label を表示する",
    ({ path, label, alt }) => {
      const post = renderPostCard(path);

      if (enabled) {
        expect(screen.getByText(label)).toBeVisible();
        const otherLabel = label === "使い方" ? "サンプル" : "使い方";
        expect(screen.queryByText(otherLabel)).not.toBeInTheDocument();
      } else {
        expect(screen.queryByText("使い方")).not.toBeInTheDocument();
        expect(screen.queryByText("サンプル")).not.toBeInTheDocument();
      }
      expectPostContent(post, alt);
    },
  );

  it("未登録の画像パスではバッジを表示せず、投稿の内容と詳細リンクを残す", () => {
    const post = renderPostCard("test/unregistered.png");

    expect(screen.queryByText("使い方")).not.toBeInTheDocument();
    expect(screen.queryByText("サンプル")).not.toBeInTheDocument();
    expectPostContent(post);
  });
});
