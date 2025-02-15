"use client";

import * as React from "react";
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
// import { toast } from "@/components/ui/use-toast";

// Mock data
const volunteers = [
  {
    id: 1,
    name: "John Doe",
    skills: ["First Aid", "Driving", "Manual Labor"],
    location: "Downtown",
    availability: ["Weekends", "Evening"],
    eventsParticipated: 5,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Jane Smith",
    skills: ["Teaching", "Counseling", "Event Planning"],
    location: "Suburbs",
    availability: ["Weekdays", "Morning"],
    eventsParticipated: 8,
    rating: 4.9,
  },
  // Add more volunteers...
];

const events = [
  {
    id: 1,
    name: "Community Cleanup Drive",
    date: "2024-02-20",
    location: "Downtown",
    requiredSkills: ["Manual Labor"],
    currentParticipants: 3,
    requiredParticipants: 10,
    status: "Low Participation",
  },
  {
    id: 2,
    name: "Youth Mentorship Program",
    date: "2024-02-25",
    location: "Suburbs",
    requiredSkills: ["Teaching", "Counseling"],
    currentParticipants: 8,
    requiredParticipants: 10,
    status: "Almost Full",
  },
  // Add more events...
];

// Helper function to calculate match score
function calculateMatchScore(
  volunteer: (typeof volunteers)[0],
  event: (typeof events)[0]
) {
  let score = 0;

  // Skills match
  const skillsMatch = volunteer.skills.filter((skill) =>
    event.requiredSkills.includes(skill)
  ).length;
  score += skillsMatch * 2;

  // Location match
  if (volunteer.location === event.location) score += 3;

  return score;
}

export default function VolunteerMatchingPage() {
  // const [selectedEvent, setSelectedEvent] = React.useState<
  //   (typeof events)[0] | null
  // >(null);

  // Get suggested volunteers for an event
  const getSuggestedVolunteers = (event: (typeof events)[0]) => {
    return volunteers
      .map((volunteer) => ({
        ...volunteer,
        matchScore: calculateMatchScore(volunteer, event),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5); // Top 5 matches
  };

  // const handleInvite = (
  //   volunteer: (typeof volunteers)[0],
  //   event: (typeof events)[0]
  // ) => {
  //   // In a real app, this would send an invitation
  //   toast({
  //     title: "Invitation Sent",
  //     description: `Invited ${volunteer.name} to ${event.name}`,
  //   });
  // };

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
                          {event.name}
                        </TableCell>
                        <TableCell>
                          {new Date(event.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          {event.requiredSkills.map((skill) => (
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
                                <DialogTitle>Suggested Volunteers</DialogTitle>
                                <DialogDescription>
                                  Top matches for {event.name} based on skills
                                  and location
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
                                          {volunteer.name}
                                          <div className="text-sm text-muted-foreground">
                                            {volunteer.eventsParticipated}{" "}
                                            events • {volunteer.rating} ★
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          {volunteer.skills.map((skill) => (
                                            <Badge
                                              key={skill}
                                              variant={
                                                event.requiredSkills.includes(
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
                                          {volunteer.location}
                                        </TableCell>
                                        <TableCell>
                                          {volunteer.availability.join(", ")}
                                        </TableCell>
                                        <TableCell>
                                          <Badge variant="outline">
                                            {volunteer.matchScore}/10
                                          </Badge>
                                        </TableCell>
                                        <TableCell>
                                          <Button
                                            size="sm"
                                            // onClick={() =>
                                            //   handleInvite(volunteer, event)
                                            // }
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
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
