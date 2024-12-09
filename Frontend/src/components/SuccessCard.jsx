import { Card, Typography, styled } from '@mui/material';
import React from 'react';

const GlassCard = styled(Card)`
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  position: relative;
  z-index: 10;
  transform: translateY(0);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 6px 40px rgba(0, 0, 0, 0.2);
  }
`;

const SuccessText = styled(Typography)`
  color: green; /* Green for success message */
  font-size: 18px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3); /* Subtle shadow */
  margin-bottom: 10px;
`;

const SuccessCard = () => {
  return (
    <GlassCard>
      <SuccessText>Success</SuccessText>
      <Typography>Your operation was successful!</Typography>
    </GlassCard>
  );
};

export default SuccessCard;