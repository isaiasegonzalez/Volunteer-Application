"use client";
import React from "react";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import * as z from "zod";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Skills data
const skillsList = [
  { label: "First Aid", value: "first-aid" },
  { label: "Teaching", value: "teaching" },
  { label: "Cooking", value: "cooking" },
  { label: "Driving", value: "driving" },
  { label: "Manual Labor", value: "manual-labor" },
  { label: "Counseling", value: "counseling" },
  { label: "Event Planning", value: "event-planning" },
  { label: "Photography", value: "photography" },
];

// Urgency levels
const urgencyLevels = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
];

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  urgency: string;
  date: string;
  volunteers: number;
  status: string;
}

export default function EventManagementPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events");
        const data = await response.json();

        if (!response.ok) {
          console.error("Error fetching events:", data.error);
          return;
        }

        setEvents(data.events || []);
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  async function deleteEvent(id: string) {
    const response = await fetch(`/api/events/${id}`, { method: "DELETE" });

    if (response.ok) {
      alert("Event deleted successfully!");
      setEvents(events.filter(event => event.id !== id));
    } else {
      alert("Error deleting event.");
    }
  }

  async function editEvent(event: Event) {
    setEditingEvent(event);
  }

  // FORM HANDLING FOR CREATING/UPDATING EVENTS
  const formSchema = z.object({
    name: z.string().min(1, "Event name is required").max(100),
    description: z.string().min(1, "Description is required"),
    location: z.string().min(1, "Location is required"),
    skills: z.array(z.string()).min(1, "At least one skill is required"),
    urgency: z.string().min(1, "Urgency level is required"),
    date: z.date({ required_error: "Event date is required" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      skills: [],
      urgency: "",
      date: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const url = editingEvent ? `/api/events/${editingEvent.id}` : "/api/events";
    const method = editingEvent ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: values.name,
        description: values.description,
        location: values.location,
        requiredSkills: values.skills,
        urgency: values.urgency,
        date: values.date,
      }),
    });

    if (response.ok) {
      alert(editingEvent ? "Event updated successfully!" : "Event created successfully!");
      window.location.reload();
    } else {
      alert("Error saving event.");
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 content-center">
      <h2 className="text-3xl font-bold tracking-tight">Events</h2>

      <div className="flex space-x-6">
        {/* RECENT EVENTS TABLE */}
        <Card className="w-2/3">
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>Overview of the latest volunteer events</CardDescription>
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="default">{event.status}</Badge>
                        </TableCell>
                        <TableCell>{event.volunteers ?? 0}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => editEvent(event)}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteEvent(event.id)}>Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* CREATE/EDIT EVENT FORM */}
        <Card>
          <CardHeader>
            <CardTitle>{editingEvent ? "Edit Event" : "Create Event"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl><Input placeholder="Enter event name" {...field} maxLength={100} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea placeholder="Enter event description" className="min-h-[100px]" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl><Textarea placeholder="Enter event location" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Required Skills */}
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Skills</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                field.value.length === 0 && "text-muted-foreground"
                              )}
                            >
                              {field.value.length > 0
                                ? field.value.map((skill) => skillsList.find((s) => s.value === skill)?.label).join(", ")
                                : "Select skills"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <ScrollArea className="h-40">
                            {skillsList.map((skill) => (
                              <div
                                key={skill.value}
                                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  const newValue = field.value.includes(skill.value)
                                    ? field.value.filter((value) => value !== skill.value) // Remove skill if already selected
                                    : [...field.value, skill.value]; // Add skill if not selected
                                  form.setValue("skills", newValue);
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={field.value.includes(skill.value)}
                                  className="mr-2"
                                  readOnly
                                />
                                {skill.label}
                              </div>
                            ))}
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                {/* Urgency */}
                <FormField
                  control={form.control}
                  name="urgency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgency Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select urgency level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {urgencyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Event Date */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Event Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">{editingEvent ? "Update Event" : "Create Event"}</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
