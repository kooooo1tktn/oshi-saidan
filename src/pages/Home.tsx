import { Box, VStack, Text, Spinner, Center } from "@chakra-ui/react";
import { getPosts } from "../supabase/supabaseFunctions";
import { useQuery } from "@tanstack/react-query";
import { Post } from "../types";
import { PostCard } from "../components/PostCard";

export const Home = () => {
  const { data, isLoading, isError, error } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  if (isLoading) {
    return (
      <Center py={20}>
        <Spinner
          color="#FF6EB4"
          size="xl"
          thickness="3px"
          data-testid="loading-spinner"
        />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center py={20}>
        <Text color="#6650A0" fontFamily="body">
          投稿の取得に失敗しました: {error.message}
        </Text>
      </Center>
    );
  }

  if (!data?.length) {
    return (
      <Center py={20}>
        <Text fontFamily="heading" fontSize="lg" color="#6650A0">
          まだ投稿がありません ✦
        </Text>
      </Center>
    );
  }

  return (
    <Box maxW="600px" mx="auto" px={{ base: 4, lg: 12 }} py={10}>
      <Text
        fontFamily="heading"
        fontSize="20px"
        fontWeight="600"
        color="#1A0840"
        mb={6}
      >
        ホーム
      </Text>

      <VStack align="stretch" spacing={5}>
        {data.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </VStack>
    </Box>
  );
};
