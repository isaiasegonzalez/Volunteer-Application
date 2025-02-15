"use client";

import React, { useState } from "react";
import { Clock, User, Calendar, Maximize2, Minimize2, Bell, Edit3 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link here

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
  const [activePage, setActivePage] = useState("/dashboard");
  const router = useRouter();

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
    <div className="min-h-screen bg-[#FFEFEF] flex">
      {/* Sidebar */}
      <div className="w-16 border-r border-pink-100 h-screen flex flex-col items-center py-6 space-y-8">
        <button onClick={() => handleNavigation("/dashboard")}>
          <User className={`w-6 h-6 ${activePage === "/dashboard" ? "text-pink-400" : "text-gray-400"}`} />
        </button>
        <button onClick={() => handleNavigation("/calendar")}>
          <Calendar className={`w-6 h-6 ${activePage === "/calendar" ? "text-pink-400" : "text-gray-400"}`} />
        </button>
        <button onClick={() => handleNavigation("/history")}>
          <Clock className={`w-6 h-6 ${activePage === "/history" ? "text-pink-400" : "text-gray-400"}`} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Top Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full" style={{
                background: "linear-gradient(90deg, #D5ABEF 0%, #E56F8C 100%)"
              }}>
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
              <h2 className="text-2xl font-semibold text-gray-800">Welcome Back,</h2>
              <div className="flex items-center">
                <h1 className="text-4xl font-bold text-pink-400">Julia</h1>
              </div>
            </div>
          </div>

          {/* Notification and Edit Buttons in a Flex Container */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <button onClick={() => router.push("/notifications")}>
              <Bell className="w-6 h-6 text-gray-500 hover:text-pink-400 transition-colors" />
            </button>

            {/* Edit Button */}
            <Link href="/edit" className="text-pink-400 flex items-center hover:text-pink-500 transition">
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
          <div className="p-4">
            <table className="w-full">
              <tbody>
                {upcomingEvents.map((event, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="py-4 text-gray-600">{event.date}</td>
                    <td className="py-4 text-pink-400">{event.facility}</td>
                    <td className="py-4 text-right text-gray-600">{event.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Volunteer History Section */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-pink-400">Volunteer History</h2>
          <button onClick={toggleHistory} className="transition-transform">
            {isHistoryExpanded ? (
              <Minimize2 className="text-pink-400 w-5 h-5" />
            ) : (
              <Maximize2 className="text-pink-400 w-5 h-5" />
            )}
          </button>
        </div>

        {/* Scrollable Volunteer History */}
        <div className={`bg-white shadow-sm rounded-xl transition-all duration-500 ${isHistoryExpanded ? "h-[400px]" : "h-[200px]"}`}>
          <div className="p-4 max-h-[300px] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 text-left font-medium text-gray-600">Date</th>
                  <th className="py-4 text-left font-medium text-gray-600">Facility</th>
                  <th className="py-4 text-right font-medium text-gray-600">Points</th>
                </tr>
              </thead>
              <tbody>
                {(isHistoryExpanded ? volunteerHistory : volunteerHistory.slice(0, 2)).map((history, index) => (
                  <tr key={index} className="border-t border-gray-100 bg-gray-50">
                    <td className="py-4 text-gray-600">{history.date}</td>
                    <td className="py-4 text-pink-400">{history.facility}</td>
                    <td className="py-4 text-right">{history.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VolunteerDashboard;
