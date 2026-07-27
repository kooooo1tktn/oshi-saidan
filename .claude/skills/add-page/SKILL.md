---
name: add-page
description: 新しいページを追加する。ルーティング登録とテスト作成まで含めて漏れなく行う。使い方は /add-page プロフィール
disable-model-invocation: true
---

追加するページ: $ARGUMENTS

ページ追加は「作って終わり」になりがちで、ルータ登録とテストのモック更新を忘れると
静かに壊れる。以下を全部やること。

## 1. ページコンポーネントを作る

`src/pages/<Name>.tsx` に作る。

```tsx
export const Name = () => {
  return <Box>...</Box>;
};
```

- **named arrow function の export**（default export にしない）
- Props が必要なら直上に `type Props = { ... }` を定義する
- スタイルは Chakra の props で書く。**Chakra は v2**
- カード類のグラスモーフィズムは
  `bg="rgba(255,255,255,0.72)"` + `style={{ backdropFilter: "blur(12px)" }}` + `borderRadius="2xl"`
- 色はテーマに無いのでハードコードする（`#FF6EB4` / `#DD3888` / `#6650A0` / `#1A0840`）
- UI の文言は日本語
- import は相対パス（パスエイリアスは無い）

## 2. データが必要なら supabaseFunctions に足す

**コンポーネントから直接 `supabase` を触らない。**
`src/supabase/supabaseFunctions.ts` に関数を追加し、ページ側は `useQuery` で呼ぶ。
エラーは throw させ、`isError` / `error.message` で拾って表示する。

画像を出す場合、`image_url` は Storage のパスなので**必ず `getImageUrl()` を通す**。

## 3. ルータに登録する

`src/routes/Router.tsx` の `<Route element={<Layout />}>` の中に追加する。
`Layout` の外に置くとサイドバーと背景が消えるので注意。

```tsx
<Route path="/name" element={<Name />} />
```

ナビゲーションから辿れるようにするなら `src/components/Sidebar.tsx` にもリンクを足す。

## 4. テストを作る

`__test__/<Name>Component.spec.tsx` を作る。既存の `HomeComponent.spec.tsx` が手本。

- `describe` / `it` のタイトルは**日本語**
- `ChakraProvider` + `QueryClientProvider`（`retry: false`）でラップする
- `supabaseFunctions` を `jest.mock` する
- **ページで使うルータの API を `jest.mock("react-router-dom", ...)` のファクトリに
  すべて列挙する。** `Link` / `useNavigate` / `useParams` など、足りないと
  `is not a function` で落ちる

## 5. 検証する

`/verify` を実行して緑にする。
