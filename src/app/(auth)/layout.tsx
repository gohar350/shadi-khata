import { SEO } from "@/components/seo";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col">
      <head>
        <SEO title="Login | Shadi Khata - Shadi (Marriage) App for Pakistan & India" description="Login to Shadi Khata, the best wedding (shadi) management app for Pakistan and India. Manage your marriage events, invitations, and families with ease." />
      </head>
      <header className="container mx-auto px-4 py-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <Heart className="w-8 h-8 text-primary-600" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Shadi Khata
          </span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>
    </div>
  );
}
