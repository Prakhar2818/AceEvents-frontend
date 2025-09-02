import React from 'react';
import { useAuth } from '../context/authContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <>
    <div>Dashboard</div>
    </>
  );
};

export default Dashboard;
