import React from 'react';
import MiniVariantDrawer from '../../components/MiniVariantDrawer';
import { Card, styled, Typography, Button } from '@mui/material';

const GlassCard = styled(Card)`
  width: 90%;   /* 90% of the total width for responsiveness */
  height: 80%;  
  margin-top: 30px;
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  position: relative; /* Ensure the button is positioned relative to this card */
  background: rgba(255, 255, 255, 0.2); /* Light transparent background */
  backdrop-filter: blur(10px); /* Blur effect for glassmorphism */
  -webkit-backdrop-filter: blur(10px); /* Safari support for blur effect */
  border: 1px solid rgba(255, 255, 255, 0.3); /* Optional border for frosted look */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); /* Soft shadow to make it pop */
  border-radius: 15px; /* Optional: Rounded corners for a smooth effect */ 
`;

const LogoutButton = styled(Button)`
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-weight: bold;
`;


const ProfilePage = () => {
  // Dummy logout function
  const handleLogout = () => {
    alert("Logged out!");
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-700 to-black">
        <MiniVariantDrawer title="Hostler Profile" />
        {/* GlassCard Section */}
        <GlassCard>
  <Typography variant="h4" style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>
    Hostler Details
  </Typography>
  {/* Student Data */}
  <Typography variant="body1" style={{ marginBottom: '10px' }}><strong>Name:</strong> Abhay Gypta</Typography>
  <Typography variant="body1" style={{ marginBottom: '10px' }}><strong>Roll No.:</strong> 2200461540002</Typography>
  <Typography variant="body1" style={{ marginBottom: '10px' }}><strong>Aadhar No.:</strong> 84563289297</Typography>
  <Typography variant="body1" style={{ marginBottom: '10px' }}><strong>Gender:</strong> Male</Typography>
  <Typography variant="body1" style={{ marginBottom: '10px' }}><strong>Father's Name:</strong> Vipin Gypta</Typography>
  <Typography variant="body1" style={{ marginBottom: '10px' }}><strong>Mother's Name:</strong> Manju Gypta</Typography>
  <Typography variant="body1" style={{ marginBottom: '10px' }}><strong>Phone No.:</strong> 9369274691</Typography>
  <Typography variant="body1" style={{ marginBottom: '10px' }}><strong>Email:</strong> ag4081315@gmail.com</Typography>
  <Typography variant="body1" style={{ marginBottom: '10px' }}><strong>Address:</strong> Hardoi</Typography>
  <Typography variant="body1" style={{ marginBottom: '10px' }}><strong>Year:</strong> 3rd</Typography>
  <Typography variant="body1" style={{ marginBottom: '10px' }}><strong>College:</strong> Mpec</Typography>
  <Typography variant="body1" style={{ marginBottom: '10px' }}><strong>Hostel:</strong> Aryabhatt</Typography>
  <Typography variant="body1" style={{ marginBottom: '10px' }}><strong>Room No.:</strong> 316</Typography>
  {/* Logout Button */}
  <LogoutButton
    variant="contained"
    color="error"
    onClick={handleLogout}
  >
    Logout
  </LogoutButton>
</GlassCard>

      </div>
    </>
  );
};

export default ProfilePage;
