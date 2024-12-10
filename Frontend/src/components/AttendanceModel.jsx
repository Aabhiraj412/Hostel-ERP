import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const AttendanceModal = ({ open, onClose, onConfirm }) => {
  const handleConfirm = () => {
    onConfirm();
    onClose(); // Automatically close the modal after marking attendance
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="mark-attendance-modal"
      aria-describedby="mark-attendance-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          bgcolor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 2,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          p: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#fff' }}>
          Mark Attendance
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: '#f0f0f0' }}>
          Are you sure you want to mark your attendance?
        </Typography>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          sx={{
            bgcolor: 'rgba(0, 128, 255, 0.6)',
            '&:hover': { bgcolor: 'rgba(0, 128, 255, 0.8)' },
          }}
        >
          Mark Attendance
        </Button>
      </Box>
    </Modal>
  );
};

export default AttendanceModal;