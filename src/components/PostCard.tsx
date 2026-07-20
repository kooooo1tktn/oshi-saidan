import { AspectRatio, Box, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Post } from "../types";
import { getImageUrl } from "../supabase/supabaseFunctions";

type Props = {
  post: Post;
};

export const PostCard = ({ post }: Props) => {
  const imageUrl = getImageUrl(post.image_url);

  return (
    <Box
      as={Link}
      to={`/posts/${post.id}`}
      display="block"
      bg="rgba(255,255,255,0.72)"
      style={{ backdropFilter: "blur(12px)" }}
      border="1px solid"
      borderColor="rgba(200,170,255,0.45)"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="0 4px 24px rgba(100,70,200,0.10), 0 1px 6px rgba(100,70,200,0.06)"
      textDecoration="none"
      transition="transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s cubic-bezier(0.34,1.56,0.64,1), border-color 0.25s"
      _hover={{
        transform: "translateY(-6px) rotate(-0.5deg)",
        boxShadow: "0 16px 48px rgba(200,170,255,0.32)",
        borderColor: "rgba(255,110,180,0.40)",
      }}
    >
      {/* Card image */}
      <AspectRatio ratio={16 / 9}>
        <Image src={imageUrl} alt="投稿画像" objectFit="cover" />
      </AspectRatio>

      {/* Card body */}
      <Box p="16px 20px 20px">
        <Text
          fontFamily="body"
          fontSize="14px"
          color="#1A0840"
          lineHeight="1.85"
          noOfLines={3}
        >
          {post.description}
        </Text>
      </Box>
    </Box>
  );
};
