import { Box, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const Sidebar = () => {
  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={100}
      flexShrink={0}
      w={{ base: "100%", lg: "260px" }}
      h={{ base: "64px", lg: "100vh" }}
      px={{ base: 12, lg: 6 }}
      bg={{ base: "rgba(248,246,255,0.78)", lg: "transparent" }}
      sx={{ backdropFilter: { base: "blur(18px)", lg: "none" } }}
      borderBottom={{ base: "1px solid rgba(200,170,255,0.28)", lg: "none" }}
      borderRight={{ base: "none", lg: "1px solid rgba(200,170,255,0.28)" }}
    >
      <Flex
        direction={{ base: "row", lg: "column" }}
        align={{ base: "center", lg: "stretch" }}
        justify={{ base: "space-between", lg: "flex-start" }}
        h="full"
        py={{ lg: 8 }}
        gap={{ lg: 8 }}
      >
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
        <Flex
          direction={{ base: "row", lg: "column" }}
          align={{ base: "center", lg: "stretch" }}
          gap={{ base: 6, lg: 4 }}
        >
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
            textAlign="center"
            textDecoration="none"
            _hover={{ bg: "#DD3888" }}
            transition="background 0.2s"
          >
            ＋ 投稿する
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};
