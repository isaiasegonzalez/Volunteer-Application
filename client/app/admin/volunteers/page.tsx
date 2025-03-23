"use client";

import { useState, useEffect } from "react";
import { Send, UserPlus } from "lucide-react";
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
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  required_skills: string[];
  urgency: string;
  status: string;
  currentParticipants: number; // Added property
  requiredParticipants: number; // Ensure this is also included
};

type Volunteer = {
  id: string;
  full_name: string;
  skills: string[];
  city: string;
  availability: string[];
};

// import { toast } from "@/components/ui/use-toast";
// Mock data
// const volunteers = [
//   {
//     id: 1,
//     name: "John Doe",
//     skills: ["First Aid", "Manual Labor"],
//     location: "New York",
//     availability: ["2024-03-10", "2024-03-15"],
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     skills: ["Teaching", "Counseling", "Event Planning"],
//     location: "Los Angeles",
//     availability: ["2024-03-20", "2024-03-25"],
//   },
//   {
//     id: 3,
//     name: "Michael Brown",
//     skills: ["Cooking", "Manual Labor", "Driving"],
//     location: "Dallas",
//     availability: ["2024-03-10", "2024-03-18"],
//   },
// ];

// const events = [
//   {
//     id: 1,
//     name: "Community Cleanup Drive",
//     date: "2024-03-10",
//     location: "New York",
//     requiredSkills: ["Manual Labor", "Driving"],
//     currentParticipants: 3,
//     requiredParticipants: 10,
//     status: "Low Participation",
//   },
//   {
//     id: 2,
//     name: "Youth Mentorship Program",
//     date: "2024-03-20",
//     location: "Los Angeles",
//     requiredSkills: ["Teaching", "Counseling"],
//     currentParticipants: 8,
//     requiredParticipants: 10,
//     status: "Almost Full",
//   },
// ];

function calculateMatchScore(volunteer: Volunteer, event: Event) {
  let score = 0;

  const skillsMatch = (volunteer.skills || []).filter((skill) =>
    event.required_skills?.includes(skill)
  ).length;
  score += skillsMatch * 2;

  if (volunteer.city === event.location) score += 3;

  const eventDate = event.date.slice(0, 10); // standardize to just the YYYY-MM-DD

  if (
    (typeof volunteer.availability === "string" &&
      volunteer.availability === eventDate) ||
    (Array.isArray(volunteer.availability) &&
      volunteer.availability.includes(eventDate))
  ) {
    score += 3;
  }

  return score;
}

export default function VolunteerMatchingPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Get suggested volunteers for an event
  const getSuggestedVolunteers = (event: Event) => {
    if (!Array.isArray(volunteers)) return [];
    return volunteers
      .map((volunteer) => ({
        ...volunteer,
        matchScore: calculateMatchScore(volunteer, event),
      }))
      .filter((volunteer) => volunteer.matchScore > 0) // Only include relevant matches
      .sort((a, b) => b.matchScore - a.matchScore) // Sort by best match
      .slice(0, 5); // Return the top 5 matches
  };

  // const handleInvite = (
  //   volunteer: (typeof volunteers)[0],
  //   event: (typeof events)[0]
  // ) => {
  //   // In a real app, this would send an invitation
  //   toast({
  //     title: "Invitation Sent",
  //     description: `Invited ${volunteer.name} to ${event.title}`,
  //   });
  // };
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events");
        const data = await response.json();
        console.log("Fetched events:", data);

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
    async function fetchVolunteers() {
      try {
        const response = await fetch("/api/volunteers");
        const data = await response.json();
        console.log("Fetched volunteers:", data);

        if (!response.ok) {
          console.error("API error:", data.error);
          return;
        }
        if (Array.isArray(data.volunteers)) {
          setVolunteers(data.volunteers);
        } else {
          console.error("Expected array but got:", data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
    fetchEvents();
    fetchVolunteers();
  }, []);

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 content-center">
      <div className="max-w-6xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Volunteers</h2>

        <div className="grid gap-6">
          {/* Events needing volunteers */}
          <Card>
            <CardHeader>
              <CardTitle>Events Needing Volunteers</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {loading ? (
                  <p>Loading events...</p>
                ) : events.length == 0 ? (
                  <p>No events found.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Required Skills</TableHead>
                        <TableHead>Participation</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">
                            {event.title}
                          </TableCell>
                          <TableCell>
                            {new Date(event.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{event.location}</TableCell>
                          <TableCell>
                            {event.required_skills?.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="mr-1"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                event.status === "Low Participation"
                                  ? "destructive"
                                  : "default"
                              }
                            >
                              {event.currentParticipants}/
                              {event.requiredParticipants}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  // onClick={() => setSelectedEvent(event)}
                                >
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  Find Matches
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    Suggested Volunteers
                                  </DialogTitle>
                                  <DialogDescription>
                                    Top matches for {event.title} based on
                                    skills and location
                                  </DialogDescription>
                                </DialogHeader>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Name</TableHead>
                                      <TableHead>Skills</TableHead>
                                      <TableHead>Location</TableHead>
                                      <TableHead>Availability</TableHead>
                                      <TableHead>Match Score</TableHead>
                                      <TableHead>Action</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {getSuggestedVolunteers(event).map(
                                      (volunteer) => (
                                        <TableRow key={volunteer.id}>
                                          <TableCell className="font-medium">
                                            {volunteer.full_name}
                                          </TableCell>
                                          <TableCell>
                                            {volunteer.skills.map((skill) => (
                                              <Badge
                                                key={skill}
                                                variant={
                                                  event.required_skills.includes(
                                                    skill
                                                  )
                                                    ? "default"
                                                    : "secondary"
                                                }
                                                className="mr-1"
                                              >
                                                {skill}
                                              </Badge>
                                            ))}
                                          </TableCell>
                                          <TableCell>
                                            {volunteer.city}
                                          </TableCell>
                                          <TableCell>
                                            {Array.isArray(
                                              volunteer.availability
                                            )
                                              ? volunteer.availability.join(
                                                  ", "
                                                )
                                              : volunteer.availability || "N/A"}
                                          </TableCell>
                                          <TableCell>
                                            <Badge variant="outline">
                                              {volunteer.matchScore}/10
                                            </Badge>
                                          </TableCell>
                                          <TableCell>
                                            <Button
                                              size="sm"
                                              onClick={() =>
                                                router.push(
                                                  "/admin/notifications"
                                                )
                                              }
                                            >
                                              <Send className="mr-2 h-4 w-4" />
                                              Invite
                                            </Button>
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )}
                                  </TableBody>
                                </Table>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
