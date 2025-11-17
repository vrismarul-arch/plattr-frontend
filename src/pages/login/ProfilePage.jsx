import React from 'react';
import Profile from './Profile';
import Navbar from '../../components/Navbar';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4">
        <Profile />
      </main>
    </div>
  );
};

export default ProfilePage;
