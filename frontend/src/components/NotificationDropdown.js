import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data || []);
    } catch (error) {
      toast.error("Errore nel recupero delle notifiche");
    }
  };
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    if (open) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      prevLoop:
      notifications.forEach((notif) => {
        if (!notif.read) {
          api.patch(`/notifications/${notif.id}/mark-as-read`).catch(() => {});
        }
      });
    }
  }, [open, notifications]);

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 focus:outline-none"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          ></path>
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-2 max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="px-4 py-2 hover:bg-gray-100 border-b last:border-b-0"
                >
                  {notif.type === "new_follower" && (
                    <p className="text-sm text-gray-800">
                      Hai un nuovo follower!{" "}
                      {notif.data && (
                        <Link
                          to={`/profile/${JSON.parse(notif.data).follower_id}`}
                          className="text-blue-600 hover:underline ml-1"
                        >
                          {JSON.parse(notif.data).username}
                        </Link>
                      )}
                    </p>
                  )}
                  {notif.type === "post_liked" && (
                    <p className="text-sm text-gray-800">
                      {notif.data && (
                        <Link
                          to={`/profile/${JSON.parse(notif.data).liker_id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {JSON.parse(notif.data).username}
                        </Link>
                      )} ha messo like al tuo post!
                    </p>
                  )}
                  {notif.type === "comment" && (
                    <p className="text-sm text-gray-800">
                      {notif.data && (
                        <Link
                          to={`/profile/${JSON.parse(notif.data).commenter_id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {JSON.parse(notif.data).username}
                        </Link>
                      )} ha commentato il tuo post!
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="px-4 py-2 text-sm text-gray-500">Nessuna notifica.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
