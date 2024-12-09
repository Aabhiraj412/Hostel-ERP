import React, { useState } from 'react';
import MiniVariantDrawer from '../../components/MiniVariantDrawer';
import { Card, Box, styled, Typography, TextField } from '@mui/material';

const GlassCard = styled(Card)`
  width: 90%;
  max-width: 1000px;
  padding: 30px;
  margin: 90px auto 10px auto;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    background: rgba(255, 255, 255, 0.7);
    border-radius: 10px;
  }
`;

const AddHosteler = () => {
  const [gender, setGender] = useState('');

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  return (
    <>
      <MiniVariantDrawer />
      <div
        className="min-h-screen bg-gradient-to-b from-teal-700 to-black p-6 relative"
      >
        <GlassCard
  sx={{
    margin: 'auto', 
    marginTop: { xs: '60px', md: '60px' }, 
    marginLeft: { xs: '60px', md: '240px' }, 
    marginBottom: '20px', 
    width: '90%', 
    maxWidth: '1000px', 
    padding: '30px',
  }}
>
  <Typography
    variant="h5"
    gutterBottom
    align="center"
    sx={{ fontWeight: 'bold', color: 'white', marginBottom: '20px' }}
  >
    Hosteler Details
  </Typography>

  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, // 1 column for small screens, 2 for larger screens
      gap: 3,
      width: '100%',
    }}
  >
    {[
      'Name',
      'Roll No.',
      'Aadhar No.',
      'Gender',
      "Father's Name",
      "Mother's Name",
      'Phone No.',
      'Email',
      'Address',
      'Year',
      'College',
      'Hostel',
      'Room No.',
      'Date of Birth',
      'Blood Group',
      'Local Guardian',
      'Local Guardian Phone',
      'Local Guardian Address',
      "Father's Phone No.",
      "Mother's Phone No.",
      "Father's Email",
      "Mother's Email",
      'Course',
      'Branch',
    ].map((field, index) => (
      <StyledTextField
        key={index}
        fullWidth
        label={field}
        variant="outlined"
        size="small"
      />
    ))}
  </Box>

  <button
    className="mt-8 bg-black text-white font-medium px-6 py-3 rounded-lg shadow-white hover:bg-gradient-to-r hover:from-teal-500 hover:to-slate-600 hover:text-black transition-all duration-300"
  >
    Add Hosteler
  </button>
</GlassCard>

      </div>
    </>
  );
};

export default AddHosteler;
