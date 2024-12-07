import React from 'react';
import MiniVariantDrawer from '../../components/MiniVariantDrawer';
import { Card, styled, Typography } from '@mui/material';
import {
  AccountCircle,
  TaskAlt,
  CalendarToday,
  Assignment,
  HelpOutline,
  Lock,
  RestaurantMenu,
  Campaign,
} from '@mui/icons-material';

const GlassCard = styled(Card)`
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.2); /* Light transparent background */
  backdrop-filter: blur(10px); /* Blur effect for glassmorphism */
  -webkit-backdrop-filter: blur(10px); /* Safari support for blur effect */
  border: 1px solid rgba(255, 255, 255, 0.3); /* Optional border for frosted look */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); /* Soft shadow to make it pop */
  border-radius: 15px; /* Rounded corners for a smooth effect */
  position: relative; /* Ensures the card is positioned above everything */
  z-index: 10; /* Make sure it's above other elements */
  transform: translateY(0); /* Default position */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth transition for effects */
  cursor: pointer;

  &:hover {
    transform: translateY(-10px); /* Slight upward shift for "pop-up" effect */
    box-shadow: 0 6px 40px rgba(0, 0, 0, 0.2); /* Stronger shadow on hover */
  }
`;

const HostelerDashboard = () => {
  // Array of icons and labels
  const dashboardItems = [
    { icon: <AccountCircle fontSize="large" />, label: 'Profile' },
    { icon: <TaskAlt fontSize="large" />, label: 'Mark Attendance' },
    { icon: <CalendarToday fontSize="large" />, label: 'Leaves' },
    { icon: <Assignment fontSize="large" />, label: 'Out Register' },
    { icon: <HelpOutline fontSize="large" />, label: 'Public Grievances' },
    { icon: <Lock fontSize="large" />, label: 'Private Grievances' },
    { icon: <RestaurantMenu fontSize="large" />, label: 'Mess Menu' },
    { icon: <Campaign fontSize="large" />, label: 'Notices' },
  ];

  return (
    <>
      <MiniVariantDrawer title="Hosteler Dashboard" />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-700 to-black">
        {/* Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:mt-20 mb-10">
          {dashboardItems.map((item, index) => (
            <GlassCard key={index}>
              {/* Icon */}
              <div style={{ color: 'white', marginBottom: '10px' }}>{item.icon}</div>
              {/* Label */}
              <Typography variant="body1" style={{ color: 'white', fontWeight: 'bold' }}>
                {item.label}
              </Typography>
            </GlassCard>
          ))}
        </div>
      </div>
    </>
  );
};

export default HostelerDashboard;
