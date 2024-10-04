import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import logo from '../images/logo_B2R.png';
import Clock from 'react-live-clock'; // Real-time clock

const AdminPanelHeader = ({ user, onLogout,}) => {
  const [currentTime, setCurrentTime] = useState('');

  // To update time dynamically
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1A202C' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
         {/* Left Section: Logo and Home Icon */}
         <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box component="img" src={logo} alt="Company Logo" sx={{ height: 60, marginRight: '20px' }} /> {/* Use the imported logo */}
          <IconButton edge="start" color="inherit" aria-label="home" sx={{ marginLeft: 1 }}>
            <HomeIcon sx={{ fontSize: 30 }} />
          </IconButton>
        </Box>
        
        {/* Center Section: Title and Real-time Clock */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ color: '#FFF', fontWeight: 'bold' }}>
            Employee Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#90A4AE' }}>
            {currentTime} {/* Real-time clock */}
          </Typography>
        </Box>

        {/* Right Section: Welcome Message and Logout */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ marginRight: '20px', color: '#FFF' }}>
            {user ? `Welcome, ${user.name}` : 'Admin'}
          </Typography>
          <Button
            color="inherit"
            onClick={onLogout}
            startIcon={<LogoutIcon />}
            sx={{
              backgroundColor: '#F44336',
              color: 'white',
              '&:hover': {
                backgroundColor: '#D32F2F',
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminPanelHeader;
