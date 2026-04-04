import { useParams, Link } from "react-router-dom";
import { getPostById, getImageUrl } from "../supabase/supabaseFunctions";
import { Button } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Post } from "../types";

export const Posts = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useQuery<Post>({queryKey: ["post", id], queryFn: () => getPostById(id!)});

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <div>投稿の取得に失敗しました。：{error.message}</div>;
  }

  if (!data) {
    return <p>投稿が見つかりませんでした</p>;
  }

  const imageUrl = getImageUrl(data.image_url);

  return (
    <>
      <Button as={Link} to="/">戻る</Button>
      <div>
        <h1>投稿詳細</h1>
          <img src={imageUrl} alt="投稿画像" />
          <p>{data.description}</p>
      </div>
    </>
  );
};
