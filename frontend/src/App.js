import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import Comments from './pages/Comments';
import NotFound from './pages/NotFound';
import RequireAuth from './utils/RequireAuth';
import UserSearch from './pages/UserSearch';
import ViewProfile from './pages/ViewProfile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './tailwind.css';

function AppRoutes() {
  const { auth } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/"
        element={auth.token ? <Home /> : <Landing />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile/:id" element={<RequireAuth><ViewProfile /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
      <Route path="/create-post" element={<RequireAuth><CreatePost /></RequireAuth>} />
      <Route path="/comments/:postId" element={<RequireAuth><Comments /></RequireAuth>} />
      <Route path="/search" element={<RequireAuth><UserSearch /></RequireAuth>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <ToastContainer position="top-right" autoClose={3000} />
        <div style={{ padding: '1rem' }}>
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
