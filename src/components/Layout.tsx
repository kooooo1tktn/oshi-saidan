import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export const Layout = () => {
  return (
    <Box position="relative" minH="100vh">
      {/* Aurora background — fixed behind all content */}
      <Box
        position="fixed"
        inset={0}
        zIndex={0}
        pointerEvents="none"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 15% 15%, rgba(255,110,180,0.22) 0%, transparent 70%),
            radial-gradient(ellipse 60% 60% at 82%  8%, rgba(110,198,255,0.20) 0%, transparent 70%),
            radial-gradient(ellipse 80% 50% at 50% 90%, rgba(200,170,255,0.26) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 88% 60%, rgba(255,110,180,0.14) 0%, transparent 70%),
            #F8F6FF
          `,
        }}
      />

      {/* Foreground content */}
      <Box position="relative" zIndex={1}>
        <Header />
        <Box as="main">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
