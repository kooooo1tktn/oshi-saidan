# Contributing Guide

このリポジトリのコミット・PR 運用規約です。

## コミットメッセージ規約（Conventional Commits）

| Prefix | 用途 |
| --- | --- |
| `feat:` | 新機能追加 |
| `fix:` | バグ修正 |
| `refactor:` | 機能変更を伴わないコード整理 |
| `docs:` | ドキュメント変更のみ |
| `test:` | テスト追加・修正 |
| `chore:` | ビルド・設定など補助的な変更 |
| `style:` | フォーマット・セミコロンなど意味に影響しない変更 |

## コミット・PR 運用

- **コミット粒度**: 1コミット = 1つの論理的変更。`git log --oneline` で履歴が物語として読めるように
- **PR 粒度**: レビュアーが30分で読める量に抑える。巨大 PR は分割する
- **コミット前の自己レビュー**: `git diff` を必ず自分で読む。デバッグ用 `console.log` や不要な変更を除去する
- **ブランチ名**: `feat/post-list`、`fix/login-error` のように prefix + 内容。Codexで作成するブランチは `codex/readme-demo-preparation` のように `codex/` を使う
- **PR 説明**: What（何を変えたか）・Why（なぜ必要か）・How（どう動くか）の3点を書く
- **セルフレビュー**: PR を出す前に自分の diff に自分でコメントを付ける

## CI/CD

- 作業ブランチ → PR → main の順に進める。mainへ直接変更をpushしない。
- [CI](.github/workflows/main.yml)はmain宛てPR・mainへのpush・手動実行で動く。
- Node.jsは[.nvmrc](.nvmrc)の22.15.0でREADMEと統一する。
- `npm ci` 後にlint・Jestを実行し、通常設定（`VITE_DEMO_MODE=false`）とデモ設定（`true`）をそれぞれビルドする。
- PR確認ではダミーの公開用接続情報を使用する。Supabase・FirebaseのSecretsは不要で、実サービスへの保存確認も行わない。
- マージ条件には、lint・テスト・両ビルドの成功を集約する `CI required` を設定する。リポジトリ設定での必須化はまだ完了していない。現状のPrivateリポジトリでは、GitHub APIが公開化またはProへの変更を必要とする旨を返している。
- 配信ジョブは `DEMO_RELEASE_ENABLED` リポジトリ変数が `true` のときだけ動く。公開準備中は未設定のままにする。PRプレビュー配信は行わない。
- デモの読取専用化・保存拒否検証・公開条件の確認と公開承認を終えてから、配信を有効にする。READMEによる通常利用の新規導入検証は、2026-10-15の方針変更により公開後にユーザーが担当する。導入全体が未検証である旨を公開時にもREADMEに明記する。mainのpushまたはmainを指定した手動実行で、`CI required` 成功後に専用ビルドを作り、固定サイトのliveへ配信する。ジョブの実装と実配信の成功は別に記録する。

### 公開配信を追加するときの確認事項

- GitHub Secretsは `DEMO_SUPABASE_URL` / `DEMO_SUPABASE_ANON_KEY` を使い、ビルド時に既存の `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` へ渡す。`VITE_DEMO_MODE=true` も同じビルドに設定する。Secrets変更後は再ビルドする。
- デモモード、デモ専用Supabaseのref、FirebaseのプロジェクトIDとHostingサイトIDを、確認済みの期待値と照合する。空欄・不一致では配信しない。PR用ダミービルドを配信用成果物に使わない。
- [配信前チェック](scripts/demo-deploy-guard.mjs)の期待値は、Supabase `tbdgcoarawanktqytlef`、Firebaseプロジェクト・Hostingサイトともに `oshi-saidan`。公開用キーでの投稿読み取りも確認する。これはDB・Storageの書き込み拒否試験の代わりにはならない。
- 配信前チェックの拒否条件は `node --test scripts/demo-deploy-guard.test.mjs` で確認する。テストに実在の認証情報は使用しない。
- [firebase.json](firebase.json)はSPA向けのrewriteを設定する。公開先で `/new`・実在投稿の詳細URLへの直接アクセスと再読み込みを確認する。
- Supabase / Firebaseの無料枠・権限、公開するコード・素材の利用条件と履歴を確認してから公開する。今回、Windowsでの実行検証、Devinの利用、紹介動画の制作・掲載は対象外とする。
- `.env`・`.env.*`・`.firebase/` はコミットしない。空欄の `.env.example` は含める。README用スクショに管理用キーや個人情報を含めない。
- 検証は[検証記録](docs/verification/readme-demo.md)に記載し、素材制作・再検証には[依頼テンプレート](docs/templates/demo-handoffs.md)を使う。

公式：[GitHubの必須チェック](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)、[Firebase Hosting設定](https://firebase.google.com/docs/hosting/full-config)、[Viteの環境変数](https://vite.dev/guide/env-and-mode)

AI生成の回答の正確性は常に確認してください。
