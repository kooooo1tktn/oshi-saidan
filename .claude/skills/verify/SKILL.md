---
name: verify
description: このプロジェクトの全チェック（整形 / lint / typecheck / test / build）を順に実行し、失敗があれば根本原因を直して緑になるまで繰り返す。コードを変更した後の合否判定に使う。
allowed-tools: Bash(npm run *), Bash(npx tsc *), Bash(npx prettier *)
---

以下を上から順に実行する。

1. `npm run format:check`（落ちたら `npm run format` で直す）
2. `npm run lint`
3. `npm run typecheck`
4. `npm run test`
5. `npm run build`

## ルール

- 途中で失敗したら**そこで止まり、根本原因を直す**。直したら失敗したステップから再開する。
- **エラーを抑制して通してはいけない。** `eslint-disable`、`as any`、`@ts-ignore`、
  `it.skip` はいずれも「直した」ことにならない。どうしても抑制が正しい場合は、
  なぜそれが正しいのかを日本語コメントで残すこと。
- 最後に**証拠を提示する**。実行したコマンドと、出力の要点（テスト件数、ビルドの成否）を書く。
  「通りました」だけの報告は不可。

## よくある失敗（gotchas）

- **テストが `is not a function` で落ちたら、まず `jest.mock("react-router-dom", ...)` を疑う。**
  各テストは react-router-dom をモジュール丸ごとモックしており、ファクトリには
  「そのページが使うものだけ」が書かれている。ページに `useNavigate` や `useParams` を
  足したら、対応するテストのモックにも足す必要がある。
- **`render` が落ちたら、`ChakraProvider` と `QueryClientProvider` のラップを確認する。**
  `main.tsx` のプロバイダ構成を再現しないとレンダリングできない。
  `QueryClient` は `retry: false` にしないと失敗系テストがタイムアウトする。
- **`npm run build` は `tsc -b && vite build`。** `tsc -b` はインクリメンタルなので、
  `tsconfig.tsbuildinfo` が残っていると型チェックをスキップすることがある。
  挙動が怪しいときは `rm tsconfig.tsbuildinfo`（gitignore 済みなので消して構わない）。
- **`npm run typecheck` は `tsc -p tsconfig.json`。** `include` は `["src", "__test__"]` で、
  `tsconfig.app.json` と `tsconfig.node.json` は**使われていない**。
  型エラーを直すときにそちらを編集しても効かない。
- **ビルドに Supabase の環境変数は不要**（Vite は未定義を `undefined` として埋め込むだけ）。
  ただし実行時には必須。`npm run dev` で実際に動かすなら `.env` を用意する。
- **テストにも `.env` は不要。** 全テストが `supabaseFunctions` をモックしている。
- `npm run build` は `dist/` を、`tsc -b` は `tsconfig.tsbuildinfo` を作る。
  どちらも gitignore 済みなので `git status` に出てこないのが正しい。

## 仕上げ

すべて緑になったら、`git status` を確認してビルド成果物が紛れていないことを見る。
