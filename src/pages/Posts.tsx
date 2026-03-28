import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../supabase/supabaseFunctions";
import { getImageUrl } from "../supabase/supabaseFunctions";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface Post {
  id: number;
  description: string;
  image_url: string;
}

export const Posts = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          const postData = await getPostById(id);
          setPost(postData);
        } catch (error) {
          console.error("投稿の取得に失敗しました", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    return <p>投稿が見つかりませんでした</p>;
  }

  const imageUrl = getImageUrl(post.image_url);

  return (
    <>
    <Button as={Link} to="/">戻る</Button>
    <div>
      <h1>投稿詳細</h1>
        <img src={imageUrl} alt="投稿画像" />
        <p>{post?.description}</p>
    </div>
    </>
  );
};
