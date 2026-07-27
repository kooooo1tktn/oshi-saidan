import { supabase } from "./supabase";

// 投稿一覧を取得
export async function getPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*");
  if (error) {
    throw new Error(`Error fetching posts: ${error.message}`);
  }
  return data;
}

// 特定のIDの投稿を取得
export async function getPostById(id: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw new Error(`Error fetching post: ${error.message}`);
  }
  return data;
}

// 画像のURL生成
export function getImageUrl(path: string) {
  const { data } = supabase
    .storage
    .from('post-images')
    .getPublicUrl(path);
  return data.publicUrl;
}

// 投稿処理
export async function createPosts(image: File, content: string) {
  // Storageへの画像アップロード処理
  const { data, error: uploadError } = await supabase
    .storage
    .from('post-images')
    .upload(`posts/${crypto.randomUUID()}`, image)
  if (uploadError) {
    throw new Error(`画像のアップロードに失敗しました: ${uploadError.message}`);
  }

  // DBへのインサート処理
  const { error: insertError } = await supabase
    .from("posts")
    .insert({ description: content, image_url: data.path });
  if (insertError) {
    throw new Error(`データベースへのインサートに失敗しました: ${insertError.message}`);
  }
  return data;
}
