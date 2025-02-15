import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Activity } from "lucide-react";

// Mock data - replace with real data fetching
const stats = [
  {
    title: "Total Events",
    value: "45",
    description: "Active events this month",
    icon: Calendar,
  },
  {
    title: "Active Volunteers",
    value: "289",
    description: "+20% from last month",
    icon: Users,
  },
  {
    title: "Hours Donated",
    value: "1,420",
    description: "Past 30 days",
    icon: Clock,
  },
  {
    title: "Engagement Rate",
    value: "88%",
    description: "Average participation",
    icon: Activity,
  },
];

const recentEvents = [
  {
    name: "Community Cleanup Drive",
    date: "2024-02-14",
    status: "Active",
    volunteers: 24,
    location: "Central Park",
  },
  {
    name: "Food Bank Distribution",
    date: "2024-02-13",
    status: "Completed",
    volunteers: 15,
    location: "Downtown Center",
  },
  {
    name: "Senior Care Visit",
    date: "2024-02-12",
    status: "Completed",
    volunteers: 8,
    location: "Sunrise Home",
  },
  {
    name: "Youth Mentorship Program",
    date: "2024-02-15",
    status: "Upcoming",
    volunteers: 12,
    location: "Community Center",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
          <CardDescription>
            Overview of the latest volunteer events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Volunteers</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEvents.map((event) => (
                  <TableRow key={event.name}>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>
                      {new Date(event.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          event.status === "Active"
                            ? "default"
                            : event.status === "Completed"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{event.volunteers}</TableCell>
                    <TableCell>{event.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
