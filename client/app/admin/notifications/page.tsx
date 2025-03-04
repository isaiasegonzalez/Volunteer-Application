"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Bell, Check, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@supabase/supabase-js";

// ✅ Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const events = [
  "Community Cleanup Drive",
  "Youth Mentorship Program",
  "Emergency Food Drive",
  "Senior Care Visit",
];

interface Notification {
  id: number;
  type: string;
  event: string;
  message: string;
  sent: string;
  status: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Fetch Notifications from Supabase
  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5000/get-notifications");
      const data = await response.json();

      if (response.ok) {
        setNotifications(data.notifications); // ✅ Update state with new data
      } else {
        console.error("Failed to fetch notifications:", data.error);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // ✅ Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "secondary";
      case "Pending":
        return "outline";
      case "Failed":
        return "destructive";
      default:
        return "default";
    }
  };

  // ✅ Handle Sending Notification & Refresh List
  const handleSend = async () => {
    if (!selectedType || !selectedEvent || !message) {
      alert("Please fill in all fields.");
      return;
    }

    const notificationData = {
      type: selectedType,
      event: selectedEvent,
      message,
      status: "Pending",
    };

    try {
      const response = await fetch("http://localhost:5000/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Notification sent successfully!");

        // ✅ Refresh Notifications Instantly
        await fetchNotifications();
      } else {
        alert("Failed to send notification: " + result.error);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("An error occurred while sending the notification.");
    }

    // Clear input fields after sending
    setSelectedType("");
    setSelectedEvent("");
    setMessage("");
  };

  // ✅ Handle Refresh Notification List
  const handleRefresh = async () => {
    await fetchNotifications();
  };

  // ✅ Handle Delete Notification
  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("notifications").delete().match({ id });

    if (error) {
      alert("Failed to delete notification: " + error.message);
    } else {
      alert("Notification deleted!");
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Bell className="mr-2 h-4 w-4" />
                New Notification
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send New Notification</DialogTitle>
                <DialogDescription>
                  Send updates, reminders, or invitations to volunteers
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label>Notification Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reminder">Reminder</SelectItem>
                      <SelectItem value="update">Update</SelectItem>
                      <SelectItem value="invitation">Invitation</SelectItem>
                      <SelectItem value="urgent">Urgent Alert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label>Event</label>
                  <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event..." />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map((event) => (
                        <SelectItem key={event} value={event.toLowerCase()}>
                          {event}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label>Message</label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message here..."
                    className="h-32"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSend}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Notification
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <Button onClick={handleRefresh} className="ml-4">
              Refresh List
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        <Badge variant="secondary">{notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}</Badge>
                      </TableCell>
                      <TableCell>{notification.event.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</TableCell>
                      <TableCell>{notification.message}</TableCell>
                      <TableCell>{new Date(notification.sent).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(notification.status)}>
                          {notification.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="destructive" onClick={() => handleDelete(notification.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
