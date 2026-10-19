import {
  AspectRatio,
  Box,
  Text,
  Spinner,
  Center,
  Image,
} from "@chakra-ui/react";
import { useParams, Link } from "react-router-dom";
import { getPostById, getImageUrl } from "../supabase/supabaseFunctions";
import { useQuery } from "@tanstack/react-query";
import type { Post } from "../types";
import { demoImageAlts } from "../config/demoImageAlts";

export const Posts = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error } = useQuery<Post>({
    queryKey: ["post", id],
    queryFn: () => getPostById(id!),
  });

  if (isLoading) {
    return (
      <Center py={20}>
        <Spinner color="#FF6EB4" size="xl" thickness="3px" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center py={20}>
        <Text color="#6650A0">投稿の取得に失敗しました: {error.message}</Text>
      </Center>
    );
  }

  if (!data) {
    return (
      <Center py={20}>
        <Text color="#6650A0">投稿が見つかりませんでした</Text>
      </Center>
    );
  }

  const imageUrl = getImageUrl(data.image_url);

  return (
    <Box maxW="1100px" mx="auto" px={{ base: 4, lg: 12 }} py={10}>
      {/* Back link */}
      <Text
        as={Link}
        to="/"
        fontFamily="body"
        fontSize="14px"
        color="#6650A0"
        textDecoration="none"
        _hover={{ color: "#FF6EB4" }}
        transition="color 0.2s"
        display="inline-block"
        mb={6}
      >
        ← ホームへ戻る
      </Text>

      {/* Content card */}
      <Box
        bg="rgba(255,255,255,0.72)"
        style={{ backdropFilter: "blur(12px)" }}
        border="1px solid"
        borderColor="rgba(200,170,255,0.45)"
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="0 4px 24px rgba(100,70,200,0.10), 0 1px 6px rgba(100,70,200,0.06)"
      >
        <AspectRatio ratio={4 / 3}>
          <Image
            src={imageUrl}
            alt={demoImageAlts[data.image_url] ?? "投稿画像"}
            objectFit="cover"
          />
        </AspectRatio>

        <Box p={8}>
          <Text
            fontFamily="body"
            fontSize="15px"
            color="#1A0840"
            lineHeight="1.85"
            whiteSpace="pre-wrap"
          >
            {data.description}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
