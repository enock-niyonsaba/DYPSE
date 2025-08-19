import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckIcon, 
  ClockIcon, 
  ExclamationCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

// Reuse the same notification type from YouthNavbar
interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'success' | 'warning' | 'info';
}

const NotificationsPage: React.FC = () => {
  // State to manage notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'New Job Match',
      message: 'You have been matched with a new job at Tech Corp.',
      time: '10 min ago',
      read: false,
      type: 'success'
    },
    {
      id: 2,
      title: 'Training Reminder',
      message: 'Your web development training starts in 2 days.',
      time: '2 hours ago',
      read: true,
      type: 'info'
    },
    {
      id: 3,
      title: 'Application Update',
      message: 'Your application at Design Studio has been reviewed.',
      time: '1 day ago',
      read: true,
      type: 'warning'
    },
    // Add more sample notifications
    ...Array.from({ length: 10 }).map((_, i) => ({
      id: i + 4,
      title: `Notification ${i + 4}`,
      message: `This is a sample notification #${i + 4} for testing the notifications page.`,
      time: `${i + 1} day${i > 0 ? 's' : ''} ago`,
      read: i % 2 === 0,
      type: ['success', 'warning', 'info'][i % 3] as 'success' | 'warning' | 'info'
    }))
  ]);

  const markAsRead = (id: number) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    // In a real app, you would also call an API here to update the server
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({
        ...notification,
        read: true
      }))
    );
    // In a real app, you would also call an API here to update the server
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link 
            to="/youth/dashboard" 
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>
        <button
          onClick={markAllAsRead}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg divide-y divide-gray-200">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`px-6 py-4 hover:bg-gray-50 transition-colors duration-150 ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                  notification.type === 'success' ? 'bg-green-100 text-green-600' :
                  notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {notification.type === 'success' ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : notification.type === 'warning' ? (
                    <ExclamationCircleIcon className="h-5 w-5" />
                  ) : (
                    <ClockIcon className="h-5 w-5" />
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </h3>
                    <div className="text-xs text-gray-500 flex items-center">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      {notification.time}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {notification.message}
                  </p>
                </div>
                {!notification.read && (
                  <div className="ml-2 flex-shrink-0">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No notifications yet</p>
            <p className="mt-1 text-sm text-gray-400">We'll let you know when there's something new.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
