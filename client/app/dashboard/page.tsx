"use client";

import React, { useState } from "react";
import { Clock, User, Calendar, Maximize2, Minimize2 } from "lucide-react";
import Image from "next/image";

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
  ];

  return (
    <div className="min-h-screen bg-[#FFEFEF] flex">
      {/* Sidebar */}
      <div className="w-16 border-r border-pink-100 h-screen flex flex-col items-center py-6 space-y-8">
        <User className="text-pink-400 w-6 h-6" />
        <Calendar className="text-gray-400 w-6 h-6" />
        <Clock className="text-gray-400 w-6 h-6" />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Profile Section */}
        <div className="flex items-center mb-8">
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
            <h1 className="text-4xl font-bold text-pink-400">Julia</h1>
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

        {/* Expandable Volunteer History */}
        <div
          className={`bg-white shadow-sm rounded-xl overflow-hidden transition-all duration-500 ${
            isHistoryExpanded ? "h-auto max-h-[70vh]" : "h-auto max-h-[30vh]"
          }`}
        >
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 text-left font-medium text-gray-600">Date</th>
                  <th className="py-4 text-left font-medium text-gray-600">Facility</th>
                  <th className="py-4 text-right font-medium text-gray-600">Points</th>
                </tr>
              </thead>
              <tbody>
                {volunteerHistory.map((history, index) => (
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
