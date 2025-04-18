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
  id: string;
  event: string;
  message: string;
  sent: string;
  user_notifications?: { user_id: string }[];
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackStyle, setFeedbackStyle] = useState<string>("bg-blue-100 text-blue-700");

  const fetchNotifications = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("notifications")
      .select("*, user_notifications(user_id)")
      .order("sent", { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);
      return;
    }

    const filtered = (data as Notification[]).filter(
      (n) => !n.user_notifications?.some((r) => r.user_id === user.id)
    );

    setNotifications(filtered);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleResponse = async (notificationId: string, status: "accepted" | "dismissed") => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("user_notifications").insert([
      {
        user_id: user.id,
        notification_id: notificationId,
        status,
      },
    ]);

    if (error) {
      console.error("Error saving user response:", error);
    } else {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      if (status === "accepted") {
        setFeedbackMessage("You accepted this notification.");
        setFeedbackStyle("bg-green-100 text-green-700");
        await supabase.from("volunteer_events").insert([
          {
            user_id: user.id,
            facility: notifications.find((n) => n.id === notificationId)?.event || "",
            date: notifications.find((n) => n.id === notificationId)?.sent || new Date().toISOString(),
          },
        ]);
      } else {
        setFeedbackMessage("You dismissed this notification.");
        setFeedbackStyle("bg-red-100 text-red-700");
      }
      setTimeout(() => setFeedbackMessage(null), 4000);
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

        {feedbackMessage && (
          <div className={`mb-4 p-3 rounded-md text-sm ${feedbackStyle}`}> {feedbackMessage} </div>
        )}

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center text-gray-500 text-sm">
              You’ve responded to all notifications!
            </div>
          ) : (
            notifications.map((notification) => (
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
                      {formatDistanceToNow(new Date(notification.sent), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <button
                      onClick={() => handleResponse(notification.id, "accepted")}
                      className="p-1 rounded-full bg-green-100 hover:bg-green-200"
                      title="Accept"
                    >
                      <Check className="w-4 h-4 text-green-600" />
                    </button>
                    <button
                      onClick={() => handleResponse(notification.id, "dismissed")}
                      className="p-1 rounded-full bg-red-100 hover:bg-red-200"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
