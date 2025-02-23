import type { Metadata } from "next";

/** MUI */
import {AppRouterCacheProvider} from "@mui/material-nextjs/v15-appRouter";
import {ThemeProvider} from "@mui/material/styles";
import theme from '../theme/Theme';

/** CSS */
import "./_css/globals.css";


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
          </ThemeProvider>
      </AppRouterCacheProvider>
      </body>
    </html>
  );
}
