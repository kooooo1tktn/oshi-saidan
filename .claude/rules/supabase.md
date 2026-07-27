---
paths:
  - "src/supabase/**"
  - "src/types/index.ts"
---

# Supabase アクセスの規約

## データアクセスは1箇所に集約する

**Supabase を触るコードは `src/supabase/supabaseFunctions.ts` にだけ書く。**
コンポーネントやページから `supabase` クライアントを直接 import しない。

現状のエクスポートはこの4つ。

| 関数                                        | 役割                                                |
| ------------------------------------------- | --------------------------------------------------- |
| `getPosts()`                                | `posts` テーブルの全件取得                          |
| `getPostById(id: string)`                   | ID 指定で1件取得（`.single()`）                     |
| `getImageUrl(path: string)`                 | Storage のパス → 公開 URL                           |
| `createPosts(image: File, content: string)` | 画像を Storage にアップロードして `posts` に insert |

## `image_url` は URL ではない

```ts
interface Post {
  id: number;
  description: string;
  image_url: string; // ← Storage のオブジェクトパス（"posts/<uuid>"）
}
```

`createPosts` が `upload()` の戻り値 `data.path` をそのまま保存しているため、
`image_url` には `posts/<uuid>` という**パス**が入る。
`<Image src={post.image_url}>` と書くと壊れる。**必ず `getImageUrl()` を通す。**

フィールドが snake_case なのは Postgres の列名をそのまま使っているため。
camelCase に直さないこと（DB のスキーマと乖離する）。

## エラーの扱い

`supabaseFunctions.ts` の関数は**エラーを throw する**。呼び出し側で握りつぶさない。

- 読み取りは React Query の `useQuery` 経由で呼び、`isError` / `error.message` で拾う
- 書き込み（`createPosts`）は `useState<string | null>` にメッセージを入れて Chakra の
  `<Alert>` で表示する

エラーメッセージは、書き込み系が日本語（`画像のアップロードに失敗しました: ...`）、
読み取り系が英語（`Error fetching posts: ...`）で不揃いになっている。
新しく足すなら**日本語**に寄せること。

## バケットとテーブル

- Storage バケット: `post-images`（画像は `posts/${crypto.randomUUID()}` に置く）
- テーブル: `posts`

## 環境変数

`src/supabase/supabase.ts` は非 null アサーションで読んでいる。

```ts
createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
);
```

**未設定でもビルドは通り、実行時に不透明な Supabase エラーになる。**
「なぜか動かない」ときは、まず `.env` の存在と2つの変数を確認する。

なお `vite.config.ts` の `vite-plugin-env-compatible` が `VITE` プレフィックスの変数を
`process.env` にもマウントしている。
