import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';

// API base URL
const API_URL = 'http://localhost:3001';

const WorkHistory = () => {
  const [workHistory, setWorkHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Get user email from localStorage
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
      fetchWorkHistory(email);
    } else {
      setError('Please login to view work history');
      setLoading(false);
    }
  }, []);

  const fetchWorkHistory = async (email) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view work history');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/api/workday/getWorkHistory`, {
        params: { email },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status === 'success') {
        setWorkHistory(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch work history');
      }
    } catch (err) {
      console.error('Work history error:', err);
      setError(err.response?.data?.message || 'Failed to fetch work history');
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 'N/A';
    const duration = new Date(checkOut) - new Date(checkIn);
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Work History
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Work Hours</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No work history found
                  </TableCell>
                </TableRow>
              ) : (
                workHistory.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {format(new Date(record.checkInTime), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      {format(new Date(record.checkInTime), 'hh:mm a')}
                    </TableCell>
                    <TableCell>
                      {record.checkOutTime
                        ? format(new Date(record.checkOutTime), 'hh:mm a')
                        : 'Not checked out'}
                    </TableCell>
                    <TableCell>
                      {calculateDuration(record.checkInTime, record.checkOutTime)}
                    </TableCell>
                    <TableCell>
                      {record.workHours ? `${record.workHours} hours` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {record.balance ? `$${record.balance.toFixed(2)}` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {record.checkOutTime ? 'Completed' : 'In Progress'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default WorkHistory; 