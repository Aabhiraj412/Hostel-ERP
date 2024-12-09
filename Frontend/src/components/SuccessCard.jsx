import React from 'react';
import { styled, Card, Typography } from '@mui/material';

const StyledCard = styled(Card)`
  width: 300px;
  padding: 20px;
  text-align: center;
  background: rgba(76, 175, 80, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(76, 175, 80, 0.4);
  box-shadow: 0 4px 30px rgba(76, 175, 80, 0.5);
  border-radius: 15px;
  color: white;
`;

const SuccessCard = () => (
  <StyledCard>
    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
      IP Address Changed Successfully!
    </Typography>
  </StyledCard>
);

export default SuccessCard;
