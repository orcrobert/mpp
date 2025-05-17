import type { Metadata } from "next";
import { Roboto_Mono, Fira_Code } from "next/font/google";
import "./globals.css";
import AuthNavbar from "@/components/auth-navbar";
import { EntityProvider } from "@/context/entity-context";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster"

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

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
  icons: {
    icon: '/slayer.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/slayer.png" type="image/png" />
      </head>
      <body
        className={`${firaCode.variable} ${robotoMono.variable} antialiased`}>
        <Provider>
          <EntityProvider>
            <AuthNavbar />
            <Toaster />
            {children}
          </EntityProvider>
        </Provider>
      </body>
    </html>
  );
}
