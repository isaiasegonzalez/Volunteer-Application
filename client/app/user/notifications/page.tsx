"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Home } from "lucide-react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { formatDistanceToNow } from "date-fns";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Notification {
  id: number;
  event: string;
  message: string;
  sent: string; // Timestamp
}

import React from "react";
import { Calendar, Users, Heart, HandHeart, Clock } from "lucide-react";
const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch notifications from Supabase
  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("id, event, message, sent")
        .order("sent", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
      } else {
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Fetch notifications when component loads
  useEffect(() => {
    fetchNotifications();
  }, []);


const capitalizeWords = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

  return (
    <div className=" p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>

        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-gray-100 rounded-full">
                  <Calendar className="w-5 h-5 text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">
                  <strong>New volunteer opportunity:</strong> {capitalizeWords(notification.event)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(notification.sent), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
