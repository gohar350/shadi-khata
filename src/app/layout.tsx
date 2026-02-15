import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SEO } from "@/components/seo";
import { Heart } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shadi Khata - Wedding Event Management",
  description: "Manage your wedding events, families, and guest invitations with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <SEO title="Shadi Khata | Best Shadi (Marriage) Management App in Pakistan & India" description="Shadi Khata helps you manage your wedding (shadi) events, invitations, families, and guests. The #1 marriage management platform for Pakistan and India. Organize your shadi with ease!" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
