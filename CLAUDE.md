# oshi-saidan（推し祭壇アプリ）

推しの祭壇の写真とメモを投稿・閲覧する SPA。Vite + React 19 + Chakra UI v2 +
Supabase（DB と Storage）。ホスティングは Firebase。認証もユーザーアカウントも無い。

## コマンド

| 目的         | コマンド                                  |
| ------------ | ----------------------------------------- |
| 開発サーバー | `npm run dev`                             |
| Lint         | `npm run lint`                            |
| 型チェック   | `npm run typecheck`                       |
| テスト       | `npm run test`                            |
| ビルド       | `npm run build`                           |
| 整形         | `npm run format` / `npm run format:check` |
| デプロイ     | `make deploy` / `make preview`            |

**コードを変更したら `/verify` を実行すること。** 整形 → lint → typecheck → test → build を
順に流し、失敗を根本原因から直すスキル。

## セットアップ

```bash
cp .env.example .env   # VITE_SUPABASE_URL と VITE_SUPABASE_ANON_KEY の両方が必須
npm ci
```

## 落とし穴

読んでも分からない、または直感に反するもの。触る前に必ず読むこと。

- **Chakra UI は v2 であって v3 ではない。** v3 は API が全く違う（`extendTheme` は廃止されて
  `createSystem`、`ChakraProvider` は `theme=` ではなく `value=`）。新しい知識で v3 のコードを
  書くと壊れる。`framer-motion` は v2 のピア依存なので消さないこと。
- **`Post.image_url` は URL ではなく Supabase Storage のパス**（`posts/<uuid>`）。
  表示する前に必ず `getImageUrl()` を通す。フィールドが snake_case なのは Postgres の
  列名をそのまま使っているため。
- **環境変数が無くてもビルドは通る。** `src/supabase/supabase.ts` が
  `import.meta.env.VITE_SUPABASE_URL!` と非 null アサーションで読んでいるため、
  未設定は実行時に不透明な Supabase エラーとして現れる。
- **テストは `react-router-dom` をモジュール丸ごと `jest.mock` している。** ページに
  ルータの hook / component を追加したら、対応するテストの mock ファクトリにも追加しないと
  "is not a function" で落ちる。
- **テストディレクトリは `__test__`（単数形）。** `__tests__` を新設すると Jest は
  両方拾ってしまい、静かに二重管理になる。
- **`.firebase/` は Firebase のデプロイキャッシュ。** 手で編集しない（gitignore 済み）。
- **`tsconfig.app.json` と `tsconfig.node.json` はどこからも参照されていない。**
  実際に使われるのは root の `tsconfig.json` だけ（`include` は `src` と `__test__`）。
- **色は各ファイルに直書き**（`#FF6EB4` / `#DD3888` / `#6650A0` / `#1A0840` など）。
  `src/theme.ts` はフォントしかテーマ化していないので、配色変更は複数ファイルにまたがる。
- パスエイリアスは無い。import はすべて相対パス。

## コード規約

- コンポーネントは **named arrow function の export**（`export const Home = () => {...}`）。
  `src/App.tsx` だけ `function App()` + default export。
- ファイル名はコンポーネント/ページが PascalCase `.tsx`、ユーティリティが camelCase `.ts`。
- Props はコンポーネントの直上に `type Props = { ... }` を定義する。
- **Supabase へのアクセスは `src/supabase/supabaseFunctions.ts` に集約する。**
  コンポーネントから直接 `supabase` クライアントを触らない。
  読み取りは React Query（`useQuery`）経由で、エラーは throw して `isError` で拾う。
- スタイルは Chakra の props で書く。グラスモーフィズムは
  `bg="rgba(255,255,255,0.72)"` + `style={{ backdropFilter: "blur(12px)" }}` + `borderRadius="2xl"`。
- **UI の文言とテスト名は日本語。** コメントも日本語。

## Git

- デフォルトブランチは `main`。直接 push しない。
- コミットメッセージは **Conventional Commits 風の英語**（`feat:` / `fix:` / `test:`）。
  1コミット1関心事にする。
- CI は PR と `main` への push の両方で回る。デプロイは `main` への push のときだけ。
