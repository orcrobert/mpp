import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Mono, Fira_Code } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { EntityProvider } from "@/context/entitycontext";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "@/components/ui/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Metal Bands Database",
  description: "Collection of metal bands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${geistMono.variable} antialiased`}>
        <Provider>
          <EntityProvider>
            <Navbar />
            {children}
          </EntityProvider>
        </Provider>
      </body>
    </html>
  );
}
