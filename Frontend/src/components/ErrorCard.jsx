import { Card, Typography, styled } from '@mui/material';

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

const ErrorText = styled(Typography)`
  color: red; /* Make the text red to indicate an error */
  font-size: 18px; /* Adjust the font size */
  font-weight: bold; /* Make the text bold */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* Add a slight shadow for better visibility */
  margin-bottom: 10px; /* Add some spacing below the error text */
`;

const ErrorCard = () => {
  return (
    <GlassCard>
      <ErrorText>Error</ErrorText>
      <Typography>Error Occurred</Typography>
    </GlassCard>
  );
};

export default ErrorCard;