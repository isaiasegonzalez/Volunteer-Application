"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@supabase/supabase-js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Profile {
  id: string;
  full_name: string;
}

interface VolunteerHistory {
  user_id: string;
  points: number;
  facility: string;
  date: string;
}

interface Notification {
  event: string;
  message: string;
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<any[]>([]);
  const [groupedEvents, setGroupedEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch all volunteer_history with extra fields for grouping
      let { data: history, error: hError } = await supabase
        .from("volunteer_history")
        .select("user_id, points, facility, date");

      // Fetch all profiles
      let { data: profiles, error: pError } = await supabase
        .from("profile")
        .select("id, full_name");

      // Fetch all notifications for event descriptions
      let { data: notifications, error: nError } = await supabase
        .from("notifications")
        .select("event, message");

      if (hError || pError || nError) {
        alert("Error fetching data");
        return;
      }

      // === VOLUNTEER REPORT ===
      const byUser: { [userId: string]: { eventsParticipated: number; totalPoints: number } } = {};
      for (const part of history as VolunteerHistory[]) {
        if (!byUser[part.user_id]) {
          byUser[part.user_id] = { eventsParticipated: 0, totalPoints: 0 };
        }
        byUser[part.user_id].eventsParticipated += 1;
        byUser[part.user_id].totalPoints += part.points;
      }
      const report = Object.entries(byUser).map(([userId, stats]) => {
        const profile = (profiles as Profile[]).find((u) => u.id === userId);
        return {
          name: profile?.full_name || "Unknown",
          eventsParticipated: stats.eventsParticipated,
          totalPoints: stats.totalPoints,
        };
      });
      setReportData(report);

      // === GROUPED EVENTS REPORT ===
      // Group by event (facility + date)
      const eventsMap = new Map<
        string,
        { event: string; date: string; volunteers: Set<string>; description?: string }
      >();

      for (const row of history as VolunteerHistory[]) {
        const volunteer = (profiles as Profile[]).find(
          (u) => u.id === row.user_id
        );
        const onlyDate = new Date(row.date).toLocaleDateString("en-US");
        const key = `${row.facility.trim()}|${onlyDate}`;
        if (!eventsMap.has(key)) {
          // Find description from notifications
          const notification = (notifications as Notification[]).find(
            (n) => n.event && n.event.toLowerCase().trim() === row.facility.toLowerCase().trim()
          );
          eventsMap.set(key, {
            event: row.facility.trim(),
            date: onlyDate,
            volunteers: new Set<string>(),
            description: notification?.message || "",
          });
        }
        eventsMap.get(key)!.volunteers.add(volunteer?.full_name || "Unknown");
      }

      // Convert Set to Array
      const grouped = Array.from(eventsMap.values()).map(ev => ({
        ...ev,
        volunteers: Array.from(ev.volunteers),
      }));

      setGroupedEvents(grouped);
    };

    fetchData();
  }, []);



  // CSV for Volunteer Report
  const exportVolunteerCSV = () => {
    const csv = Papa.unparse(reportData);
    downloadFile(csv, "volunteer_report.csv", "text/csv");
  };

  // PDF for Volunteer Report
  const exportVolunteerPDF = () => {
    const doc = new jsPDF();
    doc.text("Volunteer Participation Report", 14, 10);
    autoTable(doc, {
      head: [["Name", "Events Participated", "Total Points"]],
      body: reportData.map(row => [row.name, row.eventsParticipated, row.totalPoints]),
      startY: 20,
    });
    doc.save("volunteer_report.pdf");
  };

  // CSV for Grouped Events
  const exportEventsCSV = () => {
    const csv = Papa.unparse(
      groupedEvents.map(ev => ({
        "Event Name": ev.event,
        "Description": ev.description,
        "Date": ev.date,
        "Volunteers": ev.volunteers.join(", "),
      }))
    );
    downloadFile(csv, "event_assignments.csv", "text/csv");
  };

  // PDF for Grouped Events
  const exportEventsPDF = () => {
    const doc = new jsPDF();
    doc.text("Event Details and Volunteer Assignments", 14, 10);
    autoTable(doc, {
      head: [["Event Name", "Description", "Date", "Volunteers"]],
      body: groupedEvents.map(ev => [
        ev.event,
        ev.description,
        ev.date,
        ev.volunteers.join(", "),
      ]),
      startY: 20,
    });
    doc.save("event_assignments.pdf");
  };

  function downloadFile(data: string, filename: string, mime: string) {
    const blob = new Blob([data], { type: mime });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }


  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        </div>

        {/* Volunteer Participation Report */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Volunteer Reports</CardTitle>
                <span className="text-sm text-muted-foreground">
                  Overview of volunteer participation and points.
                </span>
              </div>
              <div className="flex gap-2">
                <button className="border px-3 py-1 rounded" onClick={exportVolunteerCSV}>Export CSV</button>
                <button className="border px-3 py-1 rounded" onClick={exportVolunteerPDF}>Export PDF</button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Events Participated</TableHead>
                    <TableHead>Total Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3}>No data available.</TableCell>
                    </TableRow>
                  ) : (
                    reportData.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.eventsParticipated}</TableCell>
                        <TableCell>{row.totalPoints}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Grouped Events with Volunteers */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Event Details and Volunteer Assignments</CardTitle>
                <span className="text-sm text-muted-foreground">
                  Each event and all volunteers assigned.
                </span>
              </div>
              <div className="flex gap-2">
                <button className="border px-3 py-1 rounded" onClick={exportEventsCSV}>Export CSV</button>
                <button className="border px-3 py-1 rounded" onClick={exportEventsPDF}>Export PDF</button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Volunteers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedEvents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4}>No data available.</TableCell>
                    </TableRow>
                  ) : (
                    groupedEvents.map((event, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{event.event}</TableCell>
                        <TableCell>{event.description}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>{event.volunteers.join(", ")}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
