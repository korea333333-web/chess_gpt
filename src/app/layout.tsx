import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GAMBIT",
  description: "거의 실사 같은 3D 클래식 체스 게임"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
