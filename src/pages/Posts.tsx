import { useParams } from "react-router-dom";
import { getPostById } from "../supabase/supabaseFunctions";
import { getImageUrl } from "../supabase/supabaseFunctions";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

interface Post {
  id: number;
  description: string;
  image_url: string;
}

export const Posts = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery<Post>({queryKey: ["post", id], queryFn: () => getPostById(id!)})

  if (isLoading) {
    return <p>Loading...</p>;
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
