import { Box, Flex, Text, HStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={100}
      h="64px"
      px={12}
      bg="rgba(248,246,255,0.78)"
      style={{ backdropFilter: "blur(18px)" }}
      borderBottom="1px solid rgba(200,170,255,0.28)"
    >
      <Flex align="center" justify="space-between" h="full" maxW="1100px" mx="auto">
        {/* Logo */}
        <Text
          as={Link}
          to="/"
          fontFamily="heading"
          fontSize="22px"
          fontWeight="700"
          textDecoration="none"
          style={{
            background: "linear-gradient(135deg, #FF6EB4, #C8AAFF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          oshi-saidan ✦
        </Text>

        {/* Nav links */}
        <HStack spacing={6}>
          <Text
            as={Link}
            to="/"
            fontFamily="heading"
            fontSize="15px"
            fontWeight="500"
            color="#6650A0"
            textDecoration="none"
            _hover={{ color: "#FF6EB4" }}
            transition="color 0.2s"
          >
            ホーム
          </Text>
          <Text
            as={Link}
            to="/new"
            fontFamily="heading"
            fontSize="14px"
            fontWeight="600"
            bg="#FF6EB4"
            color="white"
            borderRadius="full"
            px={5}
            py={2}
            textDecoration="none"
            _hover={{ bg: "#DD3888" }}
            transition="background 0.2s"
          >
            ＋ 新しい投稿
          </Text>
        </HStack>
      </Flex>
    </Box>
  );
};
