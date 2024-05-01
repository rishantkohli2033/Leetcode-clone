import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RecoilContextProvider from "@/recoilContextProvider";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Analytics } from "@vercel/analytics/react";
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
        <ToastContainer/>
          {children}
          <Analytics/>
        </body>
      </RecoilContextProvider>
    </html>

  );
}
