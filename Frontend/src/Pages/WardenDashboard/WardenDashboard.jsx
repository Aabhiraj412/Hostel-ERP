import React, { useState } from 'react';
import MiniVariantDrawer from '../../components/MiniVariantDrawer';
import { styled, Card, Typography } from '@mui/material';
import {
  PersonAdd,
  Group,
  AccountCircle,
  CheckCircleOutline,
  CalendarToday,
  Campaign,
  HelpOutline,
  Lock,
  Notifications,
  RestaurantMenu,
  Assignment,
  Wifi,
} from '@mui/icons-material';
import SuccessCard from '@/components/SuccessCard.jsx';
import FailureCard from '@/components/FailureCard.jsx';

const GlassCard = styled(Card)`
  /* Glassmorphic styles */
  width: 160px;
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 6px 40px rgba(0, 0, 0, 0.2);
  }
`;

const WardenDashboard = () => {
  const [ipChangeResult, setIpChangeResult] = useState(null); 

  const handleChangeIpClick = () => {
    const isSuccess = Math.random() > 0.5;
    setIpChangeResult(isSuccess ? 'success' : 'failure');
  };

  const dashboardItems = [
    { icon: <PersonAdd fontSize="large" />, label: 'Add Hostler' },
    { icon: <Group fontSize="large" />, label: 'View Hostlers' },
    { icon: <AccountCircle fontSize="large" />, label: 'Profile' },
    { icon: <CheckCircleOutline fontSize="large" />, label: 'Attendance' },
    { icon: <CalendarToday fontSize="large" />, label: 'Leaves' },
    { icon: <Campaign fontSize="large" />, label: 'Publish Notice' },
    { icon: <HelpOutline fontSize="large" />, label: 'Public Grievances' },
    { icon: <Lock fontSize="large" />, label: 'Private Grievances' },
    { icon: <Notifications fontSize="large" />, label: 'View Notices' },
    { icon: <RestaurantMenu fontSize="large" />, label: 'Mess Menu' },
    { icon: <Assignment fontSize="large" />, label: 'Outdoor Register' },
    { 
      icon: <Wifi fontSize="large" />, 
      label: 'Change Attendance IP',
      onClick: handleChangeIpClick 
    },
  ];

  return (
    <>
      <MiniVariantDrawer title="Warden Dashboard" />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-700 to-black">
        {/* Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8 sm:mt-20">
          {dashboardItems.map((item, index) => (
            <GlassCard key={index} onClick={item.onClick}>
              <div style={{ color: 'white', marginBottom: '10px' }}>{item.icon}</div>
              <Typography variant="body1" style={{ color: 'white', fontWeight: 'bold' }}>
                {item.label}
              </Typography>
            </GlassCard>
          ))}
        </div>

        {/* Conditional Rendering for Success/Failure Cards */}
        {ipChangeResult === 'success' && <SuccessCard />}
        {ipChangeResult === 'failure' && <FailureCard />}
      </div>
    </>
  );
};

export default WardenDashboard;
