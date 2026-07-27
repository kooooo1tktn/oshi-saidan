---
name: pr-ready
description: 現在の差分をレビュー・検証し、コミットして push するまでを一気に行う。PR を出せる状態にする。
disable-model-invocation: true
---

現在の作業を「人にレビューしてもらえる状態」にする。上から順に行い、途中で問題が出たら
止めて報告すること。

## 1. 差分を把握する

`git status` と `git diff` を読み、何を変更したのかを3行以内で要約する。
意図しないファイル（`node_modules/`、`dist/`、`.firebase/`、`.env`、
`tsconfig.tsbuildinfo`）が混ざっていないか確認する。

## 2. 敵対的レビューを受ける

`diff-reviewer` サブエージェントに差分をレビューさせる。自分で書いたコードを自分で
評価しないためのステップなので、飛ばさないこと。

指摘のうち **正しさに関わるもの・依頼された要件の未達** は直す。
スタイルの好みや、あり得ないケースへの防御的コードの提案は**採用しない**
（過剰設計になる）。採用しなかった指摘は理由と共に報告する。

## 3. 検証する

`/verify` を実行する。緑にならないうちはコミットしない。

## 4. コミットする

**1コミット1関心事**にする。フォーマットのみの機械的な変更は必ず独立したコミットにする。

メッセージは **Conventional Commits 風の英語**。1行で、種別プレフィックスを付ける。

```
feat: add Header component with navigation links and logo
fix: reset form state after successful post creation in New component
test: add tests for New component
```

複数の関心事を1つのメッセージに詰め込まないこと（過去のコミットにその癖があるが、繰り返さない）。

## 5. push する

`main` に直接 push しない。現在のブランチを確認してから:

```bash
git push -u origin <current-branch>
```

ネットワークエラーで失敗した場合のみ、2s → 4s → 8s → 16s のバックオフで最大4回まで再試行する。

## 6. 報告する

push したブランチ名と、変更内容の要約を報告する。

- **PR は明示的に依頼されるまで作らない。**
- **`make deploy` を勝手に実行しない。** デプロイは `main` への push で CI が行う。
