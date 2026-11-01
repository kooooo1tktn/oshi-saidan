import { Box, Link, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

const DemoNoticeFrame = ({ children }: { children: ReactNode }) => (
  <Box
    as="aside" aria-label="公開デモのご案内"
    bg="rgba(255,255,255,0.72)" backdropFilter="blur(12px)"
    border="1px solid" borderColor="rgba(200,170,255,0.45)" borderRadius="2xl"
    p={{ base: 4, md: 6 }} mb={6}
    color="#1A0840" fontFamily="body" fontSize="sm" lineHeight={1.85}
  >
    <Text fontFamily="heading" fontWeight="600" color="#6650A0" mb={2}>
      公開デモ · 投稿は保存されません
    </Text>
    {children}
    <Link
      href="https://github.com/kooooo1tktn/oshi-saidan#setup"
      isExternal display="inline-flex" alignItems="center" minH="44px" mt={2}
      color="#6650A0" fontWeight="600" textDecoration="underline"
      _hover={{ color: "#1A0840" }}
      _focusVisible={{ outline: "2px solid #6650A0", outlineOffset: "3px" }}
    >
      自分の保存先で使う — README（別タブ）
    </Link>
  </Box>
);

export const DemoOverviewNotice = () => (
  <DemoNoticeFrame>
    <Text>公開用の作例はAI生成のサンプルです。</Text>
  </DemoNoticeFrame>
);

export const DemoNotice = () => (
  <DemoNoticeFrame>
    <Text>画像選択と文章入力を体験できます。</Text>
    <Text>選択した画像は送信されません。入力内容は投稿画面を離れると消えます。</Text>
  </DemoNoticeFrame>
);
