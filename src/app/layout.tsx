import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RecoilContextProvider from "@/recoilContextProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LeetClone",
  description: "Leetcode Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="favicon.png" />
      <RecoilContextProvider> {/*To provide global state to code*/}
        <body className={inter.className}>
          {children}
        </body>
      </RecoilContextProvider>
    </html>

  );
}
