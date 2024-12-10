import React, { useState } from 'react';
import MiniVariantDrawer from '../../components/MiniVariantDrawer';
import { Card, Box, styled, Typography, TextField } from '@mui/material';
import Select from 'react-select';

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
    background: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
  }
`;

const dropdownStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
    borderRadius: '10px', 
    border: '1px solid rgba(255, 255, 255, 0.3)', 
    color: 'black',
    padding: '2px', 
    boxShadow: 'none',
    '&:hover': {
      border: '1px solid rgba(0, 0, 0, 0.5)', 
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: 'black', 
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', 
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
    ? 'rgba(255, 255, 255, 0.8)' 
    : 'rgba(255, 255, 255, 0.6)', 
  color: 'black', 
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
  }),
};



const AddDetails = () => {
  const routing = {title:"Add details",Home: '/hosteler-dashboard', Profile: '/profile-hosteler', Notice: '/view-notice', Menu: '/view-mess-menu' }
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);

  const hostelOptions = [
    { value: 'AryaBhatt Hostel', label: 'AryaBhatt Hostel' },
    { value: 'Saojini Hostel', label: 'Saojini Hostel' },
    { value: 'RN Tagore Hostel', label: 'RN Tagore Hostel' },
  ];

  const yearOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
  ];

  const genderOptions = [
    { value: 'Female', label: 'Female' },
    { value: 'Male', label: 'Male' },
  ];

  return (
    <>
      <MiniVariantDrawer router={routing} />
      <div className="min-h-screen bg-gradient-to-b from-teal-700 to-black p-6 relative">
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
            Add Your Details
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
              width: '100%',
            }}
          >
            <StyledTextField fullWidth label="Name" variant="outlined" size="small" />
            <StyledTextField fullWidth label="Roll No." variant="outlined" size="small" />
            <StyledTextField fullWidth label="Aadhar No." variant="outlined" size="small" />
            <StyledTextField fullWidth label="Father's Name" variant="outlined" size="small" />
            <StyledTextField fullWidth label="Mother's Name" variant="outlined" size="small" />
            <StyledTextField fullWidth label="Phone No." variant="outlined" size="small" />
            <StyledTextField fullWidth label="Email" variant="outlined" size="small" />
            <StyledTextField fullWidth label="Address" variant="outlined" size="small" />

            {/* Dropdown for Gender */}
            <div>
              {/* <label className="text-white font-bold block mb-2">Select Gender:</label> */}
              <Select
                options={genderOptions}
                value={selectedGender}
                onChange={setSelectedGender}
                placeholder="Select Gender"
                styles={dropdownStyles}
              />
            </div>

            

            {/* Dropdown for Year */}
            <div>
              {/* <label className="text-white font-bold block mb-2">Select Year:</label> */}
              <Select
                options={yearOptions}
                value={selectedYear}
                onChange={setSelectedYear}
                placeholder="Select Year"
                styles={dropdownStyles}
              />
            </div>

            <StyledTextField fullWidth label="College" variant="outlined" size="small" />

            {/* Dropdown for Hostel */}
            <div>
              {/* <label className="text-white font-bold block mb-2">Select Hostel:</label> */}
              <Select
                options={hostelOptions}
                value={selectedHostel}
                onChange={setSelectedHostel}
                placeholder="Select Hostel"
                styles={dropdownStyles}
              />
            </div>

            <StyledTextField fullWidth label="Room No." variant="outlined" size="small" />
            <StyledTextField fullWidth label="Password" variant="outlined" size="small" />
          </Box>

          <button
            className="mt-8 bg-black text-white font-medium px-6 py-3 rounded-lg shadow-white hover:bg-gradient-to-r hover:from-teal-500 hover:to-slate-600 hover:text-black transition-all duration-300"
          >
            SUBMIT
          </button>
        </GlassCard>
      </div>
    </>
  );
};

export default AddDetails;

