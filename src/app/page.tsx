import { SEO } from "@/components/seo";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <SEO title="Shadi Khata | Wedding & Shadi Management App for Pakistan & India" description="Manage your shadi (wedding) events, invitations, and families with Shadi Khata. The #1 marriage management platform for Pakistan and India." />
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Shadi Khata
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-medium"
              >
                Login
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Manage Your Wedding Events{" "}
              <span className="text-primary-600">Effortlessly</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
              Keep track of all your wedding events, manage family invitations,
              and know exactly how many guests to expect. From Mehndi to Walima,
              we&apos;ve got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  I have an account
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Simple yet powerful features to help you manage your wedding events
              with ease.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={Calendar}
              title="Event Management"
              description="Create and manage multiple events like Mehndi, Barat, Walima, and more. Track dates and notes for each event."
            />
            <FeatureCard
              icon={Users}
              title="Family Database"
              description="Maintain a database of all your families with contact information. Easily manage and update family details."
            />
            <FeatureCard
              icon={Mail}
              title="Guest Invitations"
              description="Assign different number of guests per family for each event. Get total counts and export guest lists."
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="bg-primary-600 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-primary-100 mb-8 max-w-xl mx-auto">
              Join Shadi Khata today and take the stress out of wedding planning.
              It&apos;s free to use!
            </p>
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50"
              >
                Create Your Account
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary-600" />
              <span className="font-semibold text-gray-900 dark:text-white">
                Shadi Khata
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Shadi Khata. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
