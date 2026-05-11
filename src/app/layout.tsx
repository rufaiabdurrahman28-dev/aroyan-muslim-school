import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Aroyan Muslim School - Quranic Memorization & Western Education",
  description: "Aroyan Muslim School is dedicated to Quranic memorization and Islamic disciplines alongside Western education. Join our Saturday and Sunday Madrasah programs.",
  keywords: ["Aroyan", "Muslim School", "Quranic Memorization", "Islamic Education", "Madrasah", "Hifz", "Western Education"],
  authors: [{ name: "Aroyan Muslim School" }],
  icons: {
    icon: "/school-logo.png",
  },
  openGraph: {
    title: "Aroyan Muslim School",
    description: "Quranic Memorization & Western Education Combined",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="/school-logo.png" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
