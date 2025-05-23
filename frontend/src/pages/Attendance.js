import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Alert,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:3001';

const Attendance = () => {
  const [checkInTime, setCheckInTime] = useState(new Date());
  const [checkOutTime, setCheckOutTime] = useState(new Date());
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Get user email from localStorage or your auth context
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleCheckIn = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        return;
      }

      const response = await axios.post(`${API_URL}/api/workday/checkIn`, {
        email: userEmail,
        checkInTime: checkInTime.toISOString(),
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status === 'success') {
        setStatus('Checked in successfully!');
        setError('');
      } else {
        setError(response.data.message || 'Failed to check in');
        setStatus('');
      }
    } catch (err) {
      console.error('Check-in error:', err);
      setError(err.response?.data?.message || 'Failed to check in');
      setStatus('');
    }
  };

  const handleCheckOut = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        return;
      }

      // Ensure check-out time is after check-in time
      if (checkOutTime <= checkInTime) {
        setError('Check-out time must be after check-in time');
        return;
      }

      console.log('Sending check-out request with:', {
        email: userEmail,
        checkOutTime: checkOutTime.toISOString()
      });

      const response = await axios.post(`${API_URL}/api/workday/checkOut`, {
        email: userEmail,
        checkOutTime: checkOutTime.toISOString(),
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Check-out response:', response.data);

      if (response.data.status === 'success') {
        setStatus('Checked out successfully!');
        setError('');
      } else {
        setError(response.data.message || 'Failed to check out');
        setStatus('');
      }
    } catch (err) {
      console.error('Check-out error:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(err.response.data?.message || 'Failed to check out');
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('No response from server. Please check your connection.');
      } else {
        console.error('Error setting up request:', err.message);
        setError('An error occurred. Please try again.');
      }
      setStatus('');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Attendance Management
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {status && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {status}
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Check In
              </Typography>
              <DateTimePicker
                label="Check-in Time"
                value={checkInTime}
                onChange={setCheckInTime}
                sx={{ mb: 2, width: '100%' }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<AccessTimeIcon />}
                onClick={handleCheckIn}
                fullWidth
              >
                Check In
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Check Out
              </Typography>
              <DateTimePicker
                label="Check-out Time"
                value={checkOutTime}
                onChange={setCheckOutTime}
                minDateTime={checkInTime}
                sx={{ mb: 2, width: '100%' }}
              />
              <Button
                variant="contained"
                color="secondary"
                startIcon={<LogoutIcon />}
                onClick={handleCheckOut}
                fullWidth
              >
                Check Out
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Attendance; 