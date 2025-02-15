import React from 'react';
import { Calendar, Users, Heart, HandHeart, Clock, Home } from 'lucide-react';
import Link from 'next/link';

const NotificationsPage = () => {
  const notifications = [
    {
      id: 1,
      type: 'event',
      content: 'New volunteer opportunity: Beach Cleanup this Saturday',
      time: '2 min ago',
      icon: <Calendar className="w-5 h-5 text-purple-500" />
    },
    {
      id: 2,
      type: 'impact',
      content: 'You completed 10 hours of community service this month!',
      time: '15 min ago',
      icon: <Heart className="w-5 h-5 text-pink-500" />
    },
    {
      id: 3,
      type: 'team',
      content: 'Food Bank Team needs 3 more volunteers for tomorrow',
      time: '1 hour ago',
      icon: <Users className="w-5 h-5 text-purple-500" />
    },
    {
      id: 4,
      type: 'reminder',
      content: 'Reminder: You signed up for Senior Center Visit at 2 PM',
      time: '2 hours ago',
      icon: <Clock className="w-5 h-5 text-pink-500" />
    },
    {
      id: 5,
      type: 'appreciation',
      content: 'Local Shelter thanks you for your dedication last week',
      time: '1 day ago',
      icon: <HandHeart className="w-5 h-5 text-purple-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <Link 
            href="/dashboard" 
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
                  {notification.icon}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">{notification.content}</p>
                  <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
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
