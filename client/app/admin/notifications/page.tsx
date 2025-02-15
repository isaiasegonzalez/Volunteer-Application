"use client";

import * as React from "react";
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

// Mock data
const notifications = [
  {
    id: 1,
    type: "Reminder",
    event: "Community Cleanup Drive",
    message: "Don't forget your gloves and water bottle!",
    recipients: 8,
    sent: "2024-02-13T10:00:00",
    status: "Delivered",
  },
  {
    id: 2,
    type: "Update",
    event: "Youth Mentorship Program",
    message: "Location changed to Community Center",
    recipients: 12,
    sent: "2024-02-12T15:30:00",
    status: "Pending",
  },
  {
    id: 3,
    type: "Invitation",
    event: "Emergency Food Drive",
    message: "Urgent volunteers needed this weekend",
    recipients: 25,
    sent: "2024-02-11T09:15:00",
    status: "Failed",
  },
];

const events = [
  "Community Cleanup Drive",
  "Youth Mentorship Program",
  "Emergency Food Drive",
  "Senior Care Visit",
];

export default function NotificationsPage() {
  const [selectedType, setSelectedType] = React.useState("");
  const [selectedEvent, setSelectedEvent] = React.useState("");
  const [message, setMessage] = React.useState("");

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

  const handleSend = () => {
    // In a real app, this would send the notification
    console.log({ type: selectedType, event: selectedEvent, message });
    setSelectedType("");
    setSelectedEvent("");
    setMessage("");
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
                  <Select
                    value={selectedEvent}
                    onValueChange={setSelectedEvent}
                  >
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
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        <Badge variant="secondary">{notification.type}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {notification.event}
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {notification.message}
                      </TableCell>
                      <TableCell>{notification.recipients}</TableCell>
                      <TableCell>
                        {new Date(notification.sent).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(notification.status)}>
                          {notification.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                          {notification.status === "Failed" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                          {notification.status === "Delivered" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
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
