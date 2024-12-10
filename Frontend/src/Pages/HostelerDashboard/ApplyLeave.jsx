import React, { useState } from 'react';
import MiniVariantDrawer from '../../components/MiniVariantDrawer';
import { Button, Card, styled } from '@mui/material';

const GlassCard = styled(Card)`
  width: 400px;
  height: 500px;
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
`;

const Btn = styled(Button)`
  background-color: black; /* Background color */
  color: white; /* Text color */
  padding: 10px 15px; /* Padding for button */
  font-size: 16px; /* Font size */
  border-radius: 8px; /* Rounded corners */
  outline: none; /* Remove outline */
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5); /* Shadow effect */
  width: 150px; /* Width of the button */
  margin: 30px; /* Margin around the button */

  /* Hover effect */
  &:hover {
    background: linear-gradient(to right, #008080, #2f4f4f); /* Gradient effect on hover */
    color: black; /* Text color on hover */
    transition: all 0.3s ease-in-out; /* Smooth transition */
  }
`;

const InputField = styled('input')`
  background-color: transparent; /* Makes the background transparent */
  border: 1px solid rgba(255, 255, 255, 0.7); /* Subtle border to match the background */
  color: white; /* Text color that stands out on the background */
  padding: 10px 15px; /* Adds space inside the input field */
  font-size: 16px; /* Adjusts font size */
  border-radius: 8px; /* Rounds the corners for a modern look */
  outline: none; /* Removes the default focus outline */
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5); /* Subtle shadow on focus */
  width: 250px; /* Adjust width to fit your design */
  margin: 5px;

  /* Placeholder styling */
  &::placeholder {
    color: rgba(255, 255, 255, 0.8); /* Lighter color for better visibility */
    opacity: 1; /* Make placeholder fully visible */
    font-weight: 600; /* Bold for better emphasis */
  }
`;

const ApplyLeave = () => {
  const routing = {title:"Apply for Leaves",Home: '/hosteler-dashboard', Profile: '/profile-hosteler', Notice: '/view-notice', Menu: '/view-mess-menu' }
  const [formData, setFormData] = useState({
    to: '',
    from: '',
    noOfDays: '',
    fromDate: '',
    toDate: '',
    reason: '',
  });

  const [Home, setHome] = useState("/");

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  
  const handleSubmit = () => {
    
    setFormData({
      to: '',
      from: '',
      noOfDays: '',
      fromDate: '',
      toDate: '',
      reason: '',
    });

    
    alert('Leave application has been submitted.');
  };

  return (
    <>
      <MiniVariantDrawer router={routing} />
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            'radial-gradient(circle, rgba(0, 128, 128, 0.8) 0%, rgba(0, 0, 0, 0.8) 100%)',
        }}
      >
        <GlassCard>
          <InputField
            type="text"
            name="to"
            placeholder="From Where"
            value={formData.to}
            onChange={handleChange}
          />
          <InputField
            type="text"
            name="from"
            placeholder="To Where"
            value={formData.from}
            onChange={handleChange}
          />
          <InputField
            type="text"
            name="noOfDays"
            placeholder="No of days"
            value={formData.noOfDays}
            onChange={handleChange}
          />
          <InputField
            type="text"
            name="fromDate"
            placeholder="From date"
            value={formData.fromDate}
            onChange={handleChange}
          />
          <InputField
            type="text"
            name="toDate"
            placeholder="To Date"
            value={formData.toDate}
            onChange={handleChange}
          />
          <InputField
            type="text"
            name="reason"
            placeholder="Reason"
            value={formData.reason}
            onChange={handleChange}
          />
          <Btn onClick={handleSubmit}>Apply Leave</Btn>
        </GlassCard>
      </div>
    </>
  );
};

export default ApplyLeave;