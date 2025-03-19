"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  User,
  Calendar,
  Maximize2,
  Minimize2,
  Bell,
  Edit3,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UpcomingEvent {
  date: string;
  facility: string;
  time: string;
}

interface VolunteerHistory {
  date: string;
  facility: string;
  points: number;
}

const VolunteerDashboard = () => {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [activePage, setActivePage] = useState("/user");
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
  
      // Get the authenticated user
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser?.user) {
        console.error("User not authenticated:", authError);
        setLoading(false);
        return;
      }
  
      // Fetch the user profile from the "profile" table using authUser.id
      const { data: profile, error: profileError } = await supabase
        .from("profile")
        .select("full_name")
        .eq("id", authUser.user.id)
        .single();
  
      if (profileError) {
        console.error("Error fetching user profile:", profileError);
      } else {
        setUserName(profile?.full_name || "User"); // Set the name if found
      }
  
      setLoading(false);
    };
  
    fetchUserProfile();
  }, []);
  

  const handleNavigation = (path: string) => {
    setActivePage(path);
    router.push(path);
  };

  const toggleHistory = () => {
    setIsHistoryExpanded((prev) => !prev);
  };

  const upcomingEvents: UpcomingEvent[] = [
    { date: "01/09", facility: "GoodWill", time: "2:30PM" },
    { date: "02/09", facility: "Gagas Animal Shelter", time: "4pm" },
  ];

  const volunteerHistory: VolunteerHistory[] = [
    { date: "07/21/24", facility: "Houston Food Bank", points: 5 },
    { date: "06/27/24", facility: "Salvation Army", points: 3 },
    { date: "05/10/24", facility: "Animal Shelter", points: 2 },
    { date: "04/18/24", facility: "GoodWill", points: 4 },
  ];

  return (
    <UserLayout>
      <div className="flex-1 p-4 overflow-auto max-h-screen">
        <div className="mx-auto max-w-full w-full">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="mb-4 rounded-full bg-pink-200 p-2">
              <Image
                src="/imgs/portraits_08-1500x1500.jpg"
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full"
                priority
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Welcome Back,</h2>
            <h1 className="text-4xl font-bold text-pink-400">Julia</h1>
          </div>

          <div className="mb-8 rounded-xl bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <h2 className="text-lg font-semibold text-gray-800">Upcoming</h2>
              <Clock className="h-5 w-5 text-pink-400" />
            </div>
            <div className="px-2">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between py-4 ${
                    index < upcomingEvents.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="text-gray-600">{event.date}</div>
                  <div className="text-pink-400 font-medium">{event.facility}</div>
                  <div className="text-gray-600">{event.time}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-pink-500">Volunteer History</h2>
            <button onClick={toggleHistory} className="text-gray-400 hover:text-pink-400">
              <Maximize className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-xl bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">Date</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">Facility</th>
                  <th className="py-3 px-4 text-right font-medium text-gray-600">Points</th>
                </tr>
              </thead>
              <tbody>
                {(isHistoryExpanded ? volunteerHistory : volunteerHistory.slice(0, 2)).map(
                  (history, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="py-4 px-4 text-gray-600">{history.date}</td>
                      <td className="py-4 px-4 text-pink-400 font-medium">{history.facility}</td>
                      <td className="py-4 px-4 text-right font-medium">{history.points}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default VolunteerDashboard;
