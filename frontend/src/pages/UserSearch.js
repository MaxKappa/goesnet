import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const UserSearch = () => {
  const { auth } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]); 

  useEffect(() => {
    if (auth.user && auth.user.id) {
      api.get(`/follows/${auth.user.id}/following`)
        .then((res) => {
          const followingIds = (res.data || []).map((user) => user.id);
          setFollowing(followingIds);
        })
        .catch(() => toast.error("Errore nel recupero degli utenti seguiti"));
    }
  }, [auth.user]);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("Inserisci una query di ricerca");
      return;
    }
    try {
      const res = await api.get(`/users/search?query=${encodeURIComponent(query)}`);
      setUsers(res.data);
    } catch (error) {
      toast.error("Errore durante la ricerca degli utenti");
    }
  };

  const handleFollow = async (userId) => {
    try {
      await api.post(`/follows/${userId}/follow`);
      toast.success("Hai iniziato a seguire l'utente!");
      setFollowing((prev) => [...prev, userId]);
    } catch (error) {
      toast.error("Errore durante il follow");
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await api.post(`/follows/${userId}/unfollow`);
      toast.success("Hai smesso di seguire l'utente!");
      setFollowing((prev) => prev.filter((id) => id !== userId));
    } catch (error) {
      toast.error("Errore durante l'unfollow");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Cerca utenti..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cerca
        </button>
      </div>

      <div className="mt-4">
        {users.length > 0 ? (
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded"
              >
                <Link
                  to={`/profile/${user.id}`}
                  className="flex items-center space-x-4 flex-1"
                >
                  <img
                    src={user.profile_picture || '/default-avatar.png'}
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span className="font-medium">{user.username}</span>
                </Link>
                {following.includes(user.id) ? (
                  <button
                    onClick={() => handleUnfollow(user.id)}
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 focus:outline-none"
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    onClick={() => handleFollow(user.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 focus:outline-none"
                  >
                    Follow
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Nessun utente trovato.</p>
        )}
      </div>
    </div>
  );
};

export default UserSearch;
