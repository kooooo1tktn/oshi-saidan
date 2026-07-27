---
paths:
  - "__test__/**"
  - "jest.config.js"
  - "jest.setup.ts"
---

# テストの規約

Jest 30 + ts-jest + Testing Library（`jsdom` 環境）。`npm run test` = `jest`。

## 置き場所と命名

- **ディレクトリは `__test__`（単数形）。** `__tests__` を新設しないこと。
  Jest の既定 `testMatch` は両方拾うので、作っても動いてしまい、静かに二重管理になる。
- ファイル名は `<ComponentName>Component.spec.tsx`
  （例: `HomeComponent.spec.tsx`、`NewComponent.spec.tsx`）。
- **`describe` / `it` のタイトルは日本語。**
  例: `describe("投稿一覧ページ", ...)` / `it("ローディング表示が出ること", ...)`

## 必須のラッパー

`main.tsx` のプロバイダ構成を再現しないとレンダリングが落ちる。

```tsx
render(
  <ChakraProvider>
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  </ChakraProvider>,
);
```

`QueryClient` は `beforeEach` で毎回作り直し、**必ず `retry: false`** にする
（失敗系のテストがリトライ待ちでタイムアウトするため）。

```tsx
queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});
```

## react-router-dom はモジュール丸ごとモックする

```tsx
jest.mock("react-router-dom", () => ({
  Link: ({ children }: { children: React.ReactNode }) => (
    <a href="/">{children}</a>
  ),
}));
```

**ここが一番よく踏む落とし穴。** モックファクトリには「そのページが実際に使うものだけ」が
書かれている。ページに `useNavigate` や `useParams` を追加したら、
**対応するテストの `jest.mock` にも追加しないと `is not a function` で落ちる。**

## Supabase もモックする

```tsx
jest.mock("../src/supabase/supabaseFunctions", () => ({
  getPosts: jest.fn(() => Promise.resolve([...])),
  getImageUrl: jest.fn(() => "https://example.com/test-image.jpg"),
}));
```

全テストが `supabaseFunctions` をモックしているので、**テスト実行に `.env` は不要**
（`jest.setup.ts` が `dotenv/config` を読んでいるが、無くても落ちない）。

## 型チェック

`tsconfig.json` の `include` は `["src", "__test__"]` なので、
`npm run typecheck` はテストも型チェックする。`ts-jest` に個別の tsconfig 指定は無く、
root の `tsconfig.json`（`types: ["node", "jest", "@testing-library/jest-dom"]`）が使われる。

## モック用のスタイル・画像

`jest.config.js` の `moduleNameMapper` で、CSS は `identity-obj-proxy`、
画像は `jest-transform-stub` に差し替わる。新しいアセット種別を import するときは
ここに追記が必要。
