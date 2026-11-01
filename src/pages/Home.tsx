import { Box, Grid, Text, Spinner, Center } from "@chakra-ui/react";
import { getPosts } from "../supabase/supabaseFunctions";
import { useQuery } from "@tanstack/react-query";
import type { Post } from "../types";
import { PostCard } from "../components/PostCard";
import { isDemoMode } from "../config/demo";
import { DemoOverviewNotice } from "../components/DemoNotice";

export const Home = () => {
  const { data, isLoading, isError, error } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  let postContent = null;

  if (isLoading) {
    postContent =
      <Center py={20}>
        <Spinner
          color="#FF6EB4"
          size="xl"
          thickness="3px"
          data-testid="loading-spinner"
        />
      </Center>
    } else if (isError) {
        postContent =
          <Center py={20}>
            <Text color="#6650A0" fontFamily="body">
              投稿の取得に失敗しました: {error.message}
            </Text>
          </Center>
    } else if (!data?.length) {
        postContent =
          <Center py={20}>
            <Text fontFamily="heading" fontSize="lg" color="#6650A0">
              まだ投稿がありません ✦
            </Text>
          </Center>
    } else {
        postContent = (
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={5}
          >
            {data.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </Grid>
        );
  }

  return (
    <Box maxW="1100px" mx="auto" px={{ base: 4, lg: 12 }} py={10}>
      <Text
        fontFamily="heading"
        fontSize="20px"
        fontWeight="600"
        color="#1A0840"
        mb={6}
      >
        ホーム
      </Text>
      {isDemoMode && <DemoOverviewNotice />}
      {postContent}
    </Box>
  );
};
