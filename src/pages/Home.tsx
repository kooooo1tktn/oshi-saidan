import { getPosts, getImageUrl } from "../supabase/supabaseFunctions";
import { Link } from "react-router-dom";
import { Button,Box } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Post } from "../types";

export const Home = () => {
  const { data, isLoading, isError, error } = useQuery<Post[]>({ queryKey: ['posts'], queryFn: getPosts });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>投稿の取得に失敗しました。：{error.message}</div>;
  }

  if (!data?.length) {
    return <div>投稿がまだありません</div>;
  }

  return (
    <>
      <h1>推し祭壇</h1>
      <Button as={Link} to="/new" colorScheme="blue" mt={4}>新規投稿</Button>
      <Box>
        {data.map((post) => {
          const imageUrl = getImageUrl(post.image_url);
          return (
            <Link key={post.id} to={`/posts/${post.id}`}>
              <Box m={6}>
                <img src={imageUrl} alt="投稿画像" />
                <p>{post.description}</p>
              </Box>
            </Link>
          );
        })}
      </Box>
    </>
  );
};
