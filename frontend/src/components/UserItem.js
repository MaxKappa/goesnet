import React from 'react';
import { Link } from 'react-router-dom';

const UserItem = ({ user }) => {
  return (
    <Link
      to={`/profile/${user.id}`}
      className="flex items-center mb-2 p-2 hover:bg-gray-100 rounded transition-colors"
    >
      <img
        src={user.profile_picture || '/default-avatar.png'}
        alt={user.username}
        className="w-8 h-8 rounded-full object-cover mr-2"
      />
      <span className="text-sm font-medium">{user.username}</span>
    </Link>
  );
};

export default UserItem;
