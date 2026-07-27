# 推し祭壇アプリ（oshi-saidan）

推しの祭壇（グッズやアクリルスタンドを並べたディスプレイ）の写真とひとことメモを投稿し、
みんなの祭壇を眺められる小さな SPA。

- 投稿一覧（`/`）
- 投稿詳細（`/posts/:id`）
- 新規投稿（`/new`）— 画像1枚 + 説明文

ログインやユーザーアカウントはなく、投稿は匿名かつ全体公開。編集・削除・いいねも未実装。

## 技術構成

| 領域         | 使っているもの                                                               |
| ------------ | ---------------------------------------------------------------------------- |
| ビルド       | Vite 7                                                                       |
| UI           | React 19 + **Chakra UI v2**                                                  |
| ルーティング | React Router v7                                                              |
| サーバー状態 | TanStack Query v5                                                            |
| フォーム     | React Hook Form                                                              |
| バックエンド | Supabase（Postgres の `posts` テーブル + Storage の `post-images` バケット） |
| ホスティング | Firebase Hosting                                                             |
| テスト       | Jest + Testing Library                                                       |

## セットアップ

```bash
cp .env.example .env        # VITE_SUPABASE_URL と VITE_SUPABASE_ANON_KEY の両方が必須
npm ci
npm run dev
```

環境変数が欠けていてもビルドは通ってしまい、実行時に Supabase のエラーになる
（`src/supabase/supabase.ts` が非 null アサーションで読んでいるため）。

## コマンド

| 目的                   | コマンド                                  |
| ---------------------- | ----------------------------------------- |
| 開発サーバー           | `npm run dev`                             |
| Lint                   | `npm run lint`                            |
| 型チェック             | `npm run typecheck`                       |
| テスト                 | `npm run test`                            |
| ビルド                 | `npm run build`                           |
| 整形                   | `npm run format` / `npm run format:check` |
| ビルド結果のプレビュー | `npm run preview`                         |

Makefile 経由のデプロイ:

```bash
make preview   # ビルドして Firebase のプレビューチャンネルへ
make deploy    # ビルドして本番へ
```

## データモデル

```ts
interface Post {
  id: number;
  description: string;
  image_url: string; // URL ではなく Supabase Storage 上のパス
}
```

`image_url` は Storage のオブジェクトパス（`posts/<uuid>`）であって URL ではない。
表示するときは必ず `getImageUrl()` を通して公開 URL に変換する。
フィールドが snake_case なのは Postgres の列名をそのまま使っているため。

Supabase へのアクセスは `src/supabase/supabaseFunctions.ts` に集約されている
（`getPosts` / `getPostById` / `getImageUrl` / `createPosts`）。
コンポーネントから直接 Supabase クライアントを触らないこと。

## CI/CD

`.github/workflows/main.yml` が以下を実行する。

- **PR と `main` への push**: 整形チェック → lint → 型チェック → テスト → ビルド
- **`main` への push のみ**: Firebase のプレビューチャンネルへデプロイ

必要な GitHub Secrets: `SUPABASE_URL`、`SUPABASE_ANON_KEY`、`FIREBASE_SERVICE_ACCOUNT`。

## Claude Code を使う場合

`CLAUDE.md` に落とし穴とコード規約をまとめてある。
設定の意図と使い方は `docs/claude-code-guide.md` を参照。
