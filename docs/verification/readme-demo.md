# README・公開デモの検証記録

## 現在の判定

🔄 公開準備の途中です。README本文の初稿とCI設定の準備を行いました。手順全体の再現、Skitch風スクショ、デモモード、採用サンプル、読み取り専用化、固定URLへの配信は未完了です。

この記録は**AIによる設定確認・実行確認**です。人間の初心者による検証ではありません。実装相談の履歴を持たない別タスクでのREADME再現検証は、スクショを含む手順の準備後に行います。

## 確定した範囲

- React・Vite・Supabase・Firebase Hostingと1リポジトリを維持する。作業ブランチ → PR → mainで進める。
- 公開デモは閲覧・画像選択・文章入力ができ、最終ボタン・送信処理・DB・Storageで保存を止める。通常利用は利用者のPCと利用者自身のSupabaseを使う。
- サンプルはHow-to 1件・作例2件。画像保存パスと対応表でバッジを決め、DB項目は増やさない。素材は別タスクで作成し、ユーザーの採用後に組み込む。
- メインロジックはSocraticで進める。README・Git/CI設定・Supabase設定は指導ルールの例外範囲で進める。
- 除外：ログイン、保存方式の置き換え、利用者自身の公開URL作成、投稿・画像の削除手順、アプリ更新手順、スクショの撮影年月・更新管理ルール、独立した運用文書、停止・復旧・ロールバック手順、Supabase導入動画、人間の初心者による検証。通常利用のローカル起動・停止・再起動はREADMEに含める。
- 順序：READMEとスクショ → Codexの再現検証・修正 → Devinの再検証 → デモ用DBの公開設定 → Codex・Devinのデモ最終確認と録画 → ユーザー確認後の紹介動画掲載。

## 実施環境

| 項目 | 今回の環境 |
| --- | --- |
| 実行者 | Codex |
| OS | macOS 27.0 / arm64 |
| 作業コピー | 既存の開発用コピー。新規取得からの再現検証ではない |
| 作業ブランチ | `codex/readme-demo-preparation` |
| 開始時コミット | `4ebb671` |
| 事前導入済み | Git、Node.js 22.15.0、npm 10.9.2、既存node_modules、GitHub CLI、Firebase CLI |
| 主な依存の確認値 | React 19.1.0 / Vite 7.0.2 / Chakra UI 2.10.9 / supabase-js 2.53.0 |
| ブラウザ | Codex内ブラウザ。Supabase Dashboardは未ログイン |
| GitHub | CLIからリポジトリの管理権限を確認。リポジトリはPrivate |
| Firebase | CLIの既存認証が失効。プロジェクト一覧APIは401 |
| Windows | 🔲 未検証 |
| Devin | 🔲 未実行。契約・実行環境・録画品質は未確認 |

## 実施した確認

| 対象 | 結果 | 証拠・限界 |
| --- | --- | --- |
| 指導ルール | ✅ 確認 | ユーザー提示のAGENTS指示、ローカルCONTRIBUTING / DESIGN / Copilot指示を確認。直下・親フォルダにAGENTS.md / Codex.local.mdなし |
| 既存実装 | ✅ 確認 | Newでローカルプレビュー。送信時に画像アップロード → DB保存。デモフラグ・バッジ対応表は未実装 |
| 既存Supabase | ✅ 読み取り確認 | README旧版との差：文章・画像パスがNULL可、idがBY DEFAULT、created_atがNOT NULL。既存プロジェクトは変更していない |
| lint | ✅ 成功 | `npm run lint`。既存開発コピーで実施 |
| Jest | ✅ 成功 | `npm test -- --runInBand`：4スイート・20件。デモ制御や実サービスへの保存を検証するテストはまだない |
| 通常ビルド | ✅ 成功 | Node.js 22.15.0で実施。バンドルサイズ500kB超の警告あり。実際の配信確認ではない |
| CI用設定で通常／デモビルド | ✅ 両方成功 | ダミーURL・公開用キー、VITE_DEMO_MODE=false / trueで確認。フラグ未使用のため現時点の成果物は同一。デモ動作の保証とは区別する |
| `.firebase/` | ✅ Git管理から除外 | キャッシュ・HTML・JS・CSS・SVG計6ファイル。ローカルの生成物は残した。ignore追加済み |
| 環境ファイル | ✅ ignore追加 | `.env.*`を除外し、空欄の`.env.example`は例外として追跡。既存の個人用`.env`は書き換えていない |
| 現在のファイル・Git履歴 | ✅ 限定パターン点検 | origin取得後の45コミット・170の履歴blobと作業ファイルを点検。秘密鍵、Supabase secret/service_role JWT、GitHub token、サービスアカウントprivate_keyのパターンに一致なし。全種類の秘密情報が存在しないことの証明ではない。公開用anonキーは無視対象のローカル.envのみで検出。値は記録しない |
| コード・素材の公開条件 | ⚠️ 未完了 | リポジトリのLICENSEなし。直接依存のpackage.jsonにはMIT / BSD-2-Clause / Apache-2.0表記を確認。推移的依存・素材の出典と条件を含む公開前の確認は残る |
| 未ログインでのREADME閲覧・取得 | 🔲 未達 | 現在Private。公開化後に検証する |
| GitHub必須チェック | ⚠️ 未設定 | branch protection APIは403で、公開化またはProへの変更が必要という応答。無料枠のまま公開化前提で後日設定を確認する |
| Firebaseプロジェクト・Hostingサイト・無料枠 | 🔲 未確認 | 認証切れにより読み取り不可。`.firebaserc`の既存値だけでは公開先の確認済みとしない |

## 新規Supabaseの設定確認

ユーザーが作成組織と月額0の見積もりに同意した後、`oshi-saidan-demo` を作成しました。

| 項目 | 確認値 |
| --- | --- |
| プロジェクトref | `tbdgcoarawanktqytlef` |
| プラン・リージョン | Free / ap-northeast-1（Tokyo） |
| 稼働状態 | ACTIVE_HEALTHY |
| 用途 | 公開前の通常利用検証、その後に公開デモ専用へ固定 |
| 投稿テーブル | READMEの新規導入用SQLを適用。4列・NULL制約・identity・created_at・RLSを再問い合わせで照合 |
| DB権限 | anon / authenticatedにSELECT・INSERT。対応する2つのRLSポリシー |
| Storage | `post-images`、Public、バケット固有のサイズ・MIME制限なし、INSERTポリシーあり |
| SQLの記録 | README内のSQLと、Supabaseの`create_posts_for_readme_validation` / `allow_image_uploads_for_readme_validation`マイグレーション |
| Security Advisor | 設定後の問い合わせで指摘0件。公開デモの読み取り専用化を検証するものではない |
| 保存データ・画像 | 未投入。実際のアップロード・保存確認は未実施 |

DB作成と権限はMCPからSQLを実行し、バケットもMCPで作成しています。**Dashboardのクリック手順を再現した結果ではありません。** APIからの一般利用者としての保存確認も未実施です。

現在は通常利用の検証用に書き込み可能です。Codex / Devinの保存確認後に検証データを除去し、採用サンプル3件と読み取り専用のDB・Storageに切り替えます。公開後は書き込み可能な検証環境へ戻しません。

## 残る完了条件

| 対象 | 状態 | 完了条件 |
| --- | --- | --- |
| README本文 | 🔄 初稿 | スクショとともに手順再現し、不足を修正 |
| スクショ | 🔲 未着手 | 実画面に赤い矢印・囲み・番号・短い日本語説明。秘密情報を隠し、UIそのものは変更しない |
| 素材制作依頼文 | ✅ 初稿作成 | [依頼テンプレート](../templates/demo-handoffs.md)に用途・切り抜き・納品条件を記載 |
| 採用サンプル | 🔲 未着手 | 別タスクで制作 → ユーザーの採用確認 → 画像・対応表を受領 |
| デモの送信制御 | 🔲 学習対話待ち | 通常は無効、trueで有効。入力は残し、ボタンと送信処理で保存を止める |
| デモ表示・バッジ | 🔲 未着手 | 説明・READMEリンク・保存パス対応表による使い方1件/サンプル2件。通常利用に表示しない |
| 通常利用の再現 | 🔲 未着手 | 新規作業コピーから画像と文章を保存し、一覧・詳細・再読み込み・再起動後に表示 |
| Codex → Devin検証 | 🔲 未着手 | README以外の知識で補完せず、同じ確認項目で結果を記録 |
| 公開デモのサーバー制御 | 🔲 未着手 | 一般利用者のDB・Storage追加/更新/削除を拒否。既存データが変わらないことも確認 |
| 配信ガード・live配信 | 🔲 未着手 | mainのCI成功・モード・Supabase ref・Firebase project/siteの一致を条件に固定URLへ配信 |
| 直接アクセス | 🔲 未検証 | 公開先の新規投稿・実在投稿詳細に直接アクセス・再読み込み可能。rewriteの設定のみ追加済み |
| PRでCI実行 | ✅ 初回成功 | [PR #1](https://github.com/kooooo1tktn/oshi-saidan/pull/1)の`54689e1`でlint・20テスト・両設定ビルド・CI requiredが成功。[実行記録](https://github.com/kooooo1tktn/oshi-saidan/actions/runs/35483370931)。後続コミットの結果はPRのChecksで確認する |
| 必須チェックの失敗試験 | 🔲 未実施 | チェック失敗時にマージ不可・公開不可。設定不一致も配信不可 |
| 録画・紹介動画 | 🔲 未着手 | デモ最終確認後、Devinで操作録画。60〜90秒の紹介動画をユーザーが確認して掲載 |

## 再現検証時に追記する欄

初回CIでAction自身のNode.js 20ランタイムへの非推奨警告が出たため、公式の対応版Checkout 7.0.1 / setup-node 7.0.0へ更新しました。Action内部の実行環境とアプリのNode.jsは別で、アプリの検証版は22.15.0を維持します。CIのLinuxでの成功は、Windowsでの手順再現成功には含めません。

| 実行者 / OS | 対象コミット | 事前導入済みソフト | README手順 | 期待結果 | 実際の結果 | 成功・失敗・未検証 | 証拠 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 未実施 | — | — | — | — | — | 🔲 未検証 | — |

公式：[Supabase Storageのアクセス制御](https://supabase.com/docs/guides/storage/security/access-control)、[GitHubの必須チェック](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)、[Firebaseの配信設定](https://firebase.google.com/docs/hosting/full-config)

AI生成の回答の正確性は常に確認してください。
