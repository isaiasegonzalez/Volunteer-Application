"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Home, Check, X } from "lucide-react";
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

  useEffect(() => {
    fetchNotifications();
  }, []);

  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleAccept = async (notification: Notification) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User not found:", userError);
      return;
    }

    // Insert into volunteer_events (mapped properly)
    const { error: insertError } = await supabase
      .from("volunteer_events")
      .insert([
        {
          user_id: user.id,
          facility: notification.event, // Map to your table's column
          notification_id: notification.id,
          date: notification.sent,
        },
      ]);

    if (insertError) {
      console.error("Error inserting into volunteer_events:", insertError.message || insertError);
    } else {
      await handleDismiss(notification.id); // Clean up the notification
    }
  };

  const handleDismiss = async (notificationId: number) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User not found:", userError);
      return;
    }

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting notification:", error?.message || error);
    } else {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));     //fetchNotifications();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <Link
            href="/user"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Home className="w-6 h-6 text-gray-600" />
          </Link>
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
                    <strong>New volunteer opportunity:</strong>{" "}
                    {capitalizeWords(notification.event)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(notification.sent), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <button
                    onClick={() => handleAccept(notification)}
                    className="p-1 rounded-full bg-green-100 hover:bg-green-200"
                    title="Accept"
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </button>
                  <button
                    onClick={() => handleDismiss(notification.id)}
                    className="p-1 rounded-full bg-red-100 hover:bg-red-200"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
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
