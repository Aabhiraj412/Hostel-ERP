import React from 'react';
import { styled, Card, Typography } from '@mui/material';

const StyledCard = styled(Card)`
  width: 300px;
  padding: 20px;
  text-align: center;
  background: rgba(244, 67, 54, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(244, 67, 54, 0.4);
  box-shadow: 0 4px 30px rgba(244, 67, 54, 0.5);
  border-radius: 15px;
  color: white;
`;

const FailureCard = () => (
  <StyledCard>
    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
      Failed to Change IP Address!
    </Typography>
  </StyledCard>
);

export default FailureCard;
