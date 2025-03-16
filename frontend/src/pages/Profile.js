import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import UserItem from '../components/UserItem';
import Post from '../components/Post';

const Profile = () => {
  const { auth } = useContext(AuthContext);
  const userId = auth.user?.id;
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    date_of_birth: '',
    profile_picture: '',
    password: ''
  });
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]); 
  const [showFollowerList, setShowFollowerList] = useState(false);
  const [showFollowingList, setShowFollowingList] = useState(false);

  useEffect(() => {
    if (userId) {
      api.get(`/users/${userId}`)
        .then((res) => {
          setUser(res.data);
          setFormData({
            username: res.data.username || '',
            email: res.data.email || '',
            bio: res.data.bio || '',
            date_of_birth: res.data.date_of_birth ? res.data.date_of_birth.split('T')[0] : '',
            profile_picture: res.data.profile_picture || '',
            password: ''
          });
        })
        .catch(() => toast.error('Errore nel recupero dei dati'));
      api.get(`/follows/${userId}/followers`)
        .then((res) => setFollowers(res.data || []))
        .catch(() => toast.error('Errore nel recupero dei follower'));
      api.get(`/follows/${userId}/following`)
        .then((res) => setFollowing(res.data || []))
        .catch(() => toast.error('Errore nel recupero dei seguiti'));
      api.get(`/users/${userId}/posts`)
        .then((res) => setPosts(res.data))
        .catch(() => toast.error("Errore nel recupero dei post"));
    }
  }, [userId]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (editMode && user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        date_of_birth: user.date_of_birth ? user.date_of_birth.split('T')[0] : '',
        profile_picture: user.profile_picture || '',
        password: user.password || ''
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfilePicture(e.target.files[0]);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updateData = new FormData();
    updateData.append('username', formData.username);
    updateData.append('email', formData.email);
    updateData.append('bio', formData.bio);
    updateData.append('dob', formData.date_of_birth);
    if (newProfilePicture) {
      updateData.append('profile_picture', newProfilePicture);
    }
    if (formData.password) {
      updateData.append('password', formData.password);
    }

    api.put(`/users/${userId}`, updateData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((res) => {
        toast.success('Profilo aggiornato con successo!');
        setEditMode(false);
        setUser(res.data);
        setFormData({
          username: res.data.username,
          email: res.data.email,
          bio: res.data.bio,
          date_of_birth: res.data.date_of_birth ? res.data.date_of_birth.split('T')[0] : '',
          profile_picture: res.data.profile_picture,
          password: ''
        });
      })
      .catch(() => toast.error("Errore nell'aggiornamento del profilo"));
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      {user ? (
        <div className="bg-white rounded shadow overflow-hidden">
          <div
            className="h-48 bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://source.unsplash.com/random/1600x400?landscape")'
            }}
          ></div>

          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4 -mt-12">
              <div className="md:w-1/3 flex flex-col items-center">
                {editMode ? (
                  <>
                    <img
                      src={newProfilePicture ? URL.createObjectURL(newProfilePicture) : formData.profile_picture}
                      alt={formData.username}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
                    />
                    <label className="mt-2 inline-block cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      Cambia foto
                      <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                    </label>
                  </>
                ) : (
                  <img
                    src={formData.profile_picture}
                    alt={formData.username}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
                  />
                )}
              </div>
              <div className="md:w-2/3">
                {editMode ? (
                  <form onSubmit={handleSave} className="space-y-3">
                    <div>
                      <label className="block mb-1 font-medium">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Bio</label>
                      <textarea
                        name="bio"
                        rows="3"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Data di Nascita</label>
                      <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Nuova Password (lascia vuoto per non cambiare)</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div className="space-x-2 mt-3">
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Salva Modifiche
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 rounded border"
                      >
                        Annulla
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{formData.username}</h2>
                    <p className="text-gray-700">{formData.bio}</p>
                    <p className="text-sm text-gray-500">Email: {formData.email}</p>
                    <p className="text-sm text-gray-500">Data di Nascita: {formData.date_of_birth}</p>
                    <button
                      onClick={() => setEditMode(true)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Modifica Profilo
                    </button>
                  </div>
                )}
              </div>
            </div>
            <hr className="my-4" />
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/2">
                <button
                  onClick={() => setShowFollowerList(prev => !prev)}
                  className="text-left font-medium text-blue-600 hover:underline"
                >
                  Follower: {followers.length}
                </button>
                {showFollowerList && (
                  <div className="mt-2">
                    {followers.length > 0 ? (
                      followers.map(follower => (
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
                  onClick={() => setShowFollowingList(prev => !prev)}
                  className="text-left font-medium text-blue-600 hover:underline"
                >
                  Seguiti: {following.length}
                </button>
                {showFollowingList && (
                  <div className="mt-2">
                    {following.length > 0 ? (
                      following.map(followed => (
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
              <h3 className="text-xl font-bold mb-2">I miei Post</h3>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <Post key={post.id} post={post} />
                ))
              ) : (
                <p className="text-gray-500">Nessun post pubblicato.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-8">
          <p>Caricamento dati...</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
