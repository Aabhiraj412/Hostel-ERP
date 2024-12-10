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

import { useNavigate } from 'react-router-dom';

const GlassCard = styled(Card)`
  width: 160px;
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: center;   /* Center content horizontally */
  align-items: center;       /* Center content vertically */
  background: rgba(255, 255, 255, 0.2);  /* Light transparent background */
  backdrop-filter: blur(10px);    /* Blur effect for glassmorphism */
  -webkit-backdrop-filter: blur(10px);  /* Safari support for blur effect */
  border: 1px solid rgba(255, 255, 255, 0.3);  /* Optional border for frosted look */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); /* Soft shadow to make it pop */
  border-radius: 15px; /* Rounded corners for a smooth effect */
  position: relative;  /* Ensures the card is positioned above everything */
  z-index: 10;         /* Make sure it's above other elements */
  transform: translateY(0); /* Default position */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth transition for effects */
  cursor: pointer;
  text-align: center;


  &:hover {
    transform: translateY(-10px); /* Slight upward shift for "pop-up" effect */
    box-shadow: 0 6px 40px rgba(0, 0, 0, 0.2); /* Stronger shadow on hover */
  }
`;

const WardenDashboard = () => {
  const routing = {title:"Warden dashboard",Home: '/warden-dashboard', Profile: '/profile-warden', Attendence:'/fetch-attendance', Notice: '/view-notice', Menu: '/view-mess-menu' }
  const dashboardItems = [
    { icon: <PersonAdd fontSize="large" />, label: 'Add Hostler', route: '/add-hosteler' },
    { icon: <Group fontSize="large" />, label: 'View Hostlers', route: '/view-hosteler' },
    { icon: <AccountCircle fontSize="large" />, label: 'Profile', route: '/profile-warden' },
    { icon: <CheckCircleOutline fontSize="large" />, label: 'Attendance', route: '/fetch-attendance' },
    { icon: <CalendarToday fontSize="large" />, label: 'Leaves', route: '/view-leave' },
    { icon: <Campaign fontSize="large" />, label: 'Publish Notice', route: '/publish-notice' },
    { icon: <HelpOutline fontSize="large" />, label: 'Public Grievances', route: '/view-public-grievance' },
    { icon: <Lock fontSize="large" />, label: 'Private Grievances', route: '/view-private-grievance' },
    { icon: <Notifications fontSize="large" />, label: 'View Notices', route: '/view-notice' },
    { icon: <RestaurantMenu fontSize="large" />, label: 'Mess Menu', route: '/upload-mess-menu' },
    { icon: <Assignment fontSize="large" />, label: 'Outdoor Register', route: '/out-register' },
    { icon: <Wifi fontSize="large" />, label: 'Change Attendance IP', route: '/change-attendance-ip' },
  ];

  const navigate = useNavigate();

  return (
    <>
      <MiniVariantDrawer router={routing} />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-700 to-black">
        {/* Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {dashboardItems.map((item, index) => (
            <GlassCard key={index}
            onClick={()=> navigate(item.route)}
            >
              <div style={{ color: 'white', marginBottom: '10px' }}>{item.icon}</div>
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

export default WardenDashboard;