import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:3001';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalHours: 0,
    daysWorked: 0,
    averageHours: 0,
    totalBalance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Get user email from localStorage
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
      fetchStats(email);
    } else {
      setError('Please login to view dashboard');
      setLoading(false);
    }
  }, []);

  const fetchStats = async (email) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view dashboard');
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
        const workHistory = response.data.data;
        
        // Calculate total hours from workHours field
        const totalHours = workHistory.reduce((acc, record) => {
          return acc + (record.workHours || 0);
        }, 0);

        // Calculate total balance
        const totalBalance = workHistory.reduce((acc, record) => {
          return acc + (record.balance || 0);
        }, 0);

        const daysWorked = workHistory.length;
        const averageHours = daysWorked > 0 ? totalHours / daysWorked : 0;

        setStats({
          totalHours: Math.round(totalHours * 10) / 10,
          daysWorked,
          averageHours: Math.round(averageHours * 10) / 10,
          totalBalance: Math.round(totalBalance * 100) / 100,
        });
      } else {
        setError(response.data.message || 'Failed to fetch stats');
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setError(error.response?.data?.message || 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
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
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <AccessTimeIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Total Hours
            </Typography>
            <Typography variant="h4">{stats.totalHours}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <CalendarTodayIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Days Worked
            </Typography>
            <Typography variant="h4">{stats.daysWorked}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Average Hours/Day
            </Typography>
            <Typography variant="h4">{stats.averageHours}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Total Balance
            </Typography>
            <Typography variant="h4">${stats.totalBalance}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 