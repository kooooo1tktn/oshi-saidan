# oshi-saidan

推しへの想いを記録できる、シンプルな投稿ギャラリーアプリです。React + TypeScript + Vite + Chakra UI v2 + Supabase で構築しています。ログイン機能はなく、誰でも投稿を閲覧・作成できる設計になっています。

## セットアップ（ローカル環境構築）

### 前提

- Node.js（動作確認環境: v22）
- Supabaseアカウント（無料プランで可）

### 1. リポジトリをclone

```bash
git clone <このリポジトリのURL>
cd oshi-saidan
```

### 2. 依存パッケージをインストール

```bash
npm install
```

### 3. Supabaseプロジェクトを準備する

このアプリは投稿データと画像の保存にSupabaseを使っています。まだ自分のSupabaseプロジェクトがない場合は、以下の手順で用意してください（既にプロジェクトがある場合は手順4へ進んでください）。

#### 3-1. プロジェクトを作成

1. [supabase.com](https://supabase.com) にアクセスし、サインアップ（GitHubアカウント連携が簡単）
2. ダッシュボードの「New project」から、プロジェクト名・データベースパスワード・リージョン（Tokyoなど）を入力して作成（反映まで数分かかります）

#### 3-2. `posts` テーブルを作成

左サイドバーの「SQL Editor」を開き、「New query」に以下を貼り付けて実行します。

```sql
create table posts (
  id bigint generated always as identity primary key,
  description text not null,
  image_url text not null,
  created_at timestamptz default now()
);

alter table posts enable row level security;

-- 誰でも投稿を閲覧できる
create policy "Public can view posts"
  on posts for select
  using (true);

-- 誰でも投稿を作成できる
create policy "Public can create posts"
  on posts for insert
  with check (true);

-- update・deleteのポリシーはあえて作らない
-- （Supabaseはポリシーがない操作をデフォルトで拒否するため、誰も更新・削除できない状態になる）
```

> **なぜこの設計か**: このアプリにはログイン機能がなく、誰でも投稿できる投稿ギャラリーとして作られています。認証なしでも安全に運用するため、閲覧・投稿だけを全員に許可し、更新・削除は意図的にポリシーを作らないことで塞いでいます。

#### 3-3. 画像用のストレージバケットを作成

左サイドバーの「Storage」→「New bucket」から、名前 `post-images`・**Public bucket をON** にしてバケットを作成します（投稿画像を誰でも閲覧できるようにするため）。

作成後、そのバケットの「Policies」から以下のポリシーを追加します。

```sql
create policy "Public can upload post images"
  on storage.objects for insert
  with check (bucket_id = 'post-images');
```

> **なぜSELECTポリシーを作らないのか**: バケット自体をPublicに設定済みのため、`getPublicUrl()`経由の画像表示にSELECTポリシーは不要です。追加すると逆に「バケット内の全ファイル一覧を誰でも取得できる」状態になり露出範囲が広がるため、あえて作りません。

#### 3-4. APIキーを取得

左サイドバーの歯車アイコン「Project Settings」→「API」を開き、以下をコピーします。

| 取得する値 | `.env` の変数名 |
| --- | --- |
| Project URL | `VITE_SUPABASE_URL` |
| Project API keys の `anon` `public` | `VITE_SUPABASE_ANON_KEY` |

⚠️ 同じ画面にある `service_role` キーは絶対に使わないでください。全データへの管理者権限を持つ危険なキーで、フロントエンドのコードに含めると誰でも悪用できてしまいます。

### 4. 環境変数を設定

`.env.example` をコピーして `.env` を作成し、上で取得した値を設定します。

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=<Project URL>
VITE_SUPABASE_ANON_KEY=<anon public key>
```

### 5. 開発サーバーを起動

```bash
npm run dev
```

起動後、表示されるURL（デフォルト: http://localhost:5173）をブラウザで開く。
