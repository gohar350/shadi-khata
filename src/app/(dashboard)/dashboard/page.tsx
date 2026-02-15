import { getDashboardStats } from "@/actions/dashboard";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Calendar, Users, UserCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SEO } from "@/components/seo";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <>
      <SEO title="Dashboard | Shadi Khata - Wedding Management" description="Your wedding (shadi) dashboard. View stats, events, families, and guests. The best marriage management app for Pakistan and India." />
      <Header title="Dashboard" />
      <main className="p-4 lg:p-8 pb-24 lg:pb-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Total Events"
            value={stats.totalEvents}
            icon={Calendar}
            color="primary"
          />
          <StatCard
            title="Total Families"
            value={stats.totalFamilies}
            icon={Users}
            color="secondary"
          />
          <StatCard
            title="Total Guests"
            value={stats.totalPersons}
            icon={UserCheck}
            color="amber"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Events</CardTitle>
              <Link
                href="/events"
                className="text-sm text-primary-600 hover:text-primary-500 flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {stats.upcomingEvents.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No upcoming events. Create your first event!
                </p>
              ) : (
                <div className="space-y-4">
                  {stats.upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {event.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(event.date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {event.totalPersons}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          guests
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Families */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Families</CardTitle>
              <Link
                href="/families"
                className="text-sm text-primary-600 hover:text-primary-500 flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {stats.recentFamilies.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No families added yet. Add your first family!
                </p>
              ) : (
                <div className="space-y-4">
                  {stats.recentFamilies.map((family) => (
                    <div
                      key={family.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {family.name}
                        </h4>
                        {family.contactPerson && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {family.contactPerson}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {family.totalInvitations}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          events
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/events"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
            >
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Add Event
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create a new event
                </p>
              </div>
            </Link>
            <Link
              href="/families"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-secondary-500 dark:hover:border-secondary-500 transition-colors"
            >
              <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-secondary-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Add Family
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Register a new family
                </p>
              </div>
            </Link>
            <Link
              href="/invitations"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500 transition-colors"
            >
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Add Invitation
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Invite a family
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: "primary" | "secondary" | "amber";
}) {
  const colors = {
    primary: {
      bg: "bg-primary-100 dark:bg-primary-900/30",
      icon: "text-primary-600",
    },
    secondary: {
      bg: "bg-secondary-100 dark:bg-secondary-900/30",
      icon: "text-secondary-600",
    },
    amber: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      icon: "text-amber-600",
    },
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 ${colors[color].bg} rounded-lg flex items-center justify-center`}
          >
            <Icon className={`w-6 h-6 ${colors[color].icon}`} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
