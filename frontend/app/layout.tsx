import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
