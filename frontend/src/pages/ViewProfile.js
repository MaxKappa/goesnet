import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import UserItem from '../components/UserItem';
import Post from '../components/Post';
import { AuthContext } from '../context/AuthContext';

const ViewProfile = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]);
  const [showFollowerList, setShowFollowerList] = useState(false);
  const [showFollowingList, setShowFollowingList] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);


  useEffect(() => {
    if (id) {
      api.get(`/users/${id}`)
        .then((res) => setUser(res.data))
        .catch(() => toast.error("Errore nel caricamento del profilo"));
      api.get(`/follows/${id}/followers`)
        .then((res) => setFollowers(res.data || []))
        .catch(() => toast.error("Errore nel recupero dei follower"));
      api.get(`/follows/${id}/following`)
        .then((res) => setFollowing(res.data || []))
        .catch(() => toast.error("Errore nel recupero dei seguiti"));
      api.get(`/users/${id}/posts`)
        .then((res) => setPosts(res.data))
        .catch(() => toast.error("Errore nel recupero dei post"));
    }
  }, [id]);


  useEffect(() => {
    if (auth && auth.user && id && auth.user.id.toString() !== id) {
      api.get(`/follows/${auth.user.id}/following`)
        .then((res) => {
          const followingIds = (res.data || []).map((u) => u.id);
          setIsFollowing(followingIds.includes(parseInt(id)));
        })
        .catch(() => toast.error("Errore nel recupero dei seguiti"));
    }
  }, [auth, id]);

  const handleFollow = () => {
    api.post(`/follows/${id}/follow`)
      .then(() => {
        toast.success("Hai iniziato a seguire l'utente!");
        setIsFollowing(true);
      })
      .catch(() => toast.error("Errore durante il follow"));
  };

  const handleUnfollow = () => {
    api.post(`/follows/${id}/unfollow`)
      .then(() => {
        toast.success("Hai smesso di seguire l'utente!");
        setIsFollowing(false);
      })
      .catch(() => toast.error("Errore durante l'unfollow"));
  };

  const renderFollowButton = () => {
    if (auth && auth.user && auth.user.id.toString() !== id) {
      return (
        <button 
          onClick={isFollowing ? handleUnfollow : handleFollow}
          className={
            isFollowing
              ? "bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 focus:outline-none"
              : "bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 focus:outline-none"
          }
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      );
    }
    return null;
  };
  

  if (!user) {
    return (
      <div className="text-center mt-8">
        <p>Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4 bg-white rounded shadow">

      <div
        className="h-48 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://source.unsplash.com/random/1600x400?landscape")'
        }}
      ></div>

      <div className="p-4 -mt-12 flex flex-col md:flex-row gap-4">
        <div className="md:w-1/3 flex flex-col items-center">
          <img
            src={user.profile_picture || '/default-avatar.png'}
            alt={user.username}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
          />
        </div>
        <div className="md:w-2/3 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{user.username}</h2>
            {renderFollowButton()}
          </div>
          {user.bio && <p className="text-gray-700">{user.bio}</p>}
          <p className="text-sm text-gray-500">Email: {user.email}</p>
          {user.date_of_birth && (
            <p className="text-sm text-gray-500">
              Data di Nascita: {user.date_of_birth.split('T')[0]}
            </p>
          )}
        </div>
      </div>

      <hr className="my-4" />

      <div className="flex flex-col md:flex-row gap-4 p-4">
        <div className="md:w-1/2">
          <button
            onClick={() => setShowFollowerList((prev) => !prev)}
            className="text-left font-medium text-blue-600 hover:underline"
          >
            Follower: {followers.length}
          </button>
          {showFollowerList && (
            <div className="mt-2">
              {followers.length > 0 ? (
                followers.map((follower) => (
                  <UserItem key={follower.id} user={follower} />
                ))
              ) : (
                <p className="text-sm text-gray-500">Nessun follower.</p>
              )}
            </div>
          )}
        </div>
        <div className="md:w-1/2">
          <button
            onClick={() => setShowFollowingList((prev) => !prev)}
            className="text-left font-medium text-blue-600 hover:underline"
          >
            Seguiti: {following.length}
          </button>
          {showFollowingList && (
            <div className="mt-2">
              {following.length > 0 ? (
                following.map((followed) => (
                  <UserItem key={followed.id} user={followed} />
                ))
              ) : (
                <p className="text-sm text-gray-500">Non segui nessuno.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-bold mb-2">Post</h3>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post.id} post={post} />
          ))
        ) : (
          <p className="text-gray-500">Nessun post pubblicato.</p>
        )}
      </div>
    </div>
  );
};

export default ViewProfile;
