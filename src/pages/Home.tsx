import { useEffect, useState } from "react";
import { getPosts } from "../supabase/supabaseFunctions";
import { Link } from "react-router-dom";
import { Button,Box } from "@chakra-ui/react";
import { getImageUrl } from "../supabase/supabaseFunctions";

interface Post {
  id: number;
  description: string;
  image_url: string;
}

export const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsData = await getPosts();
      setPosts(postsData);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>推し祭壇</h1>
      <Button as={Link} to="/new" colorScheme="blue" mt={4}>新規投稿</Button>
      <Box>
        {posts.map((post) => {
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
