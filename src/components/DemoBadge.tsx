import { Box } from "@chakra-ui/react";

export const DemoBadge = ({ label }: { label: string }) => (
  <Box
    as="span"
    position="absolute" top="12px" left="12px" zIndex={1}
    bg="rgba(26,8,64,0.82)" color="white"
    backdropFilter="blur(8px)"
    borderRadius="full" px="10px" py="4px"
    fontFamily="heading" fontSize="12px" fontWeight="600"
    lineHeight="1.5" letterSpacing="0.08em"
    whiteSpace="nowrap" pointerEvents="none"
  >
    {label}
  </Box>
);
