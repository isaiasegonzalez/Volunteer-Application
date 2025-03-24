"use client";

import React, { useState, useEffect } from "react";
import { Clock, Maximize2, Minimize2, Bell, Edit3 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UpcomingEvent {
  id: number;
  date: string;
  facility: string;
  time: string;
  user_id?: string;
}

interface VolunteerHistory {
  id: number;
  date: string;
  facility: string;
  points: number;
  user_id: string;
}

const capitalizeWords = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const VolunteerDashboard = () => {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [volunteerHistory, setVolunteerHistory] = useState<VolunteerHistory[]>(
    []
  );
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      // Get the authenticated user
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError || !authData?.user) {
        console.error("User not authenticated:", authError);
        setLoading(false);
        return;
      }

      const userId = authData.user.id;

      // Fetch the user profile from the "profile" table
      const { data: profile, error: profileError } = await supabase
        .from("profile")
        .select("full_name")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
      } else {
        setUserName(profile?.full_name || "User");
      }

      // Fetch upcoming events
      const { data: events, error: eventsError } = await supabase
        .from("volunteer_events")
        .select("*")
        .eq("user_id", userId)
        //.gt("date", new Date().toISOString())
        .order("date", { ascending: true })
        

      if (eventsError) {
        console.error("Error fetching upcoming events:", eventsError);
      } else {
        // Format dates for display
        const formattedEvents =
          events?.map((event) => ({
            id: event.id,
            date: new Date(event.date).toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
            }),
            facility: event.facility,
            time: new Date(event.date).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
            user_id: event.user_id,
          })) || [];

        setUpcomingEvents(formattedEvents);
      }

      // Fetch volunteer history
      const { data: history, error: historyError } = await supabase
        .from("volunteer_history")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(10);

      if (historyError) {
        console.error("Error fetching volunteer history:", historyError);
      } else {
        // Format dates for display
        const formattedHistory =
          history?.map((entry) => ({
            id: entry.id,
            date: new Date(entry.date).toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "2-digit",
            }),
            facility: entry.facility,
            points: entry.points,
            user_id: entry.user_id,
          })) || [];

        setVolunteerHistory(formattedHistory);
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  const toggleHistory = () => {
    setIsHistoryExpanded((prev) => !prev);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Top Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="relative w-24 h-24">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "linear-gradient(90deg, #D5ABEF 0%, #E56F8C 100%)",
              }}
            >
              <Image
                src="/imgs/portraits_08-1500x1500.jpg"
                alt="Profile"
                width={96}
                height={96}
                className="rounded-full p-1"
                priority
              />
            </div>
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Welcome Back,
            </h2>
            <div className="flex items-center">
              <h1 className="text-4xl font-bold text-pink-400">
                {loading ? "Loading..." : userName}
              </h1>
            </div>
          </div>
        </div>

        {/* Notification and Edit Buttons in a Flex Container */}
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <button onClick={() => router.push("/user/notifications")}>
            <Bell className="w-6 h-6 text-gray-500 hover:text-pink-400 transition-colors" />
          </button>

          {/* Edit Button */}
          <Link
            href="/user/edit"
            className="text-pink-400 flex items-center hover:text-pink-500 transition"
          >
            <Edit3 className="w-5 h-5 mr-1" />
            <span>Edit</span>
          </Link>
        </div>
      </div>

      {/* Upcoming Events Card */}
      <div className="mb-8 bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Upcoming</h2>
          <Clock className="text-pink-400 w-5 h-5" />
        </div>
        <div className="px-4">
          {loading ? (
            <div className="py-4 text-center text-gray-500">
              Loading events...
            </div>
          ) : upcomingEvents.length > 0 ? (
            upcomingEvents.map((event, index) => (
              <div
                key={event.id}
                className={`flex items-center justify-between py-4 ${
                  index < upcomingEvents.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <div className="text-gray-600">{event.date}</div>
                <div className="text-pink-400 font-medium">
                {capitalizeWords(event.facility)}
                </div>
                <div className="text-gray-600">{event.time}</div>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-gray-500">
              No upcoming events
            </div>
          )}
        </div>
      </div>

      {/* Volunteer History Section */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-pink-400">
          Volunteer History
        </h2>
        <button onClick={toggleHistory} className="transition-transform" data-testid="toggle-history">
          {isHistoryExpanded ? (
            <Minimize2 className="text-pink-400 w-5 h-5" />
          ) : (
            <Maximize2 className="text-pink-400 w-5 h-5" />
          )}
        </button>
      </div>

      {/* Volunteer History Table */}
      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">
                Date
              </th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">
                Facility
              </th>
              <th className="py-3 px-4 text-right font-medium text-gray-600">
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="py-4 px-4 text-center text-gray-500">
                  Loading history...
                </td>
              </tr>
            ) : volunteerHistory.length > 0 ? (
              (isHistoryExpanded
                ? volunteerHistory
                : volunteerHistory.slice(0, 2)
              ).map((history, index) => (
                <tr
                  key={history.id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="py-4 px-4 text-gray-600">{history.date}</td>
                  <td className="py-4 px-4 text-pink-400 font-medium">
                    {history.facility}
                  </td>
                  <td className="py-4 px-4 text-right font-medium">
                    {history.points}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-4 px-4 text-center text-gray-500">
                  No volunteer history found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
