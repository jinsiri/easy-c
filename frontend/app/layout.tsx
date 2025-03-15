import type { Metadata } from "next";

/** MUI */
import {AppRouterCacheProvider} from "@mui/material-nextjs/v15-appRouter";
import {ThemeProvider} from "@mui/material/styles";
import theme from '../theme/Theme';

/** CSS */
import "./_css/globals.css";
import {Box, Typography} from "@mui/material";


export const metadata: Metadata = {
  title: "EASY-C",
  description: "Make your work life easier than ever!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
      <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
              <main>{children}</main>
              <Box component={'footer'} display="flex" flexDirection="column" alignItems="center" justifyContent={'center'} sx={{position:'fixed', bottom:0, width:'100%', height:'48px'}}>
                  <Typography textAlign={'center'} sx={{fontSize:'.813rem', color:'gray.700'}}>Copyright. EasyC All right reserved.</Typography>
              </Box>
          </ThemeProvider>
      </AppRouterCacheProvider>
      </body>
    </html>
  );
}
