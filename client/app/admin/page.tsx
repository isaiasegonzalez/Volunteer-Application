'use client';

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
import { useEffect, useState } from "react";

interface Event {
  id: string;
  title: string;
  date: string;
  status: string;
  volunteers: number;
  location: string;
}

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

export default function DashboardPage() {
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setRecentEvents(data.events || []);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

      {/* Metrics Section */}
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

      {/* Recent Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
          <CardDescription>
            Overview of the latest volunteer events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {loading ? (
              <p>Loading events...</p>
            ) : (
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
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
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
                      <TableCell>{event.volunteers ?? 0}</TableCell>
                      <TableCell>{event.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
