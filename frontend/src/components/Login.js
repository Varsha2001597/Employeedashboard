import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice';
import { TextField, Button, Container, Typography, Box, Alert, AlertTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const { error, isAuthenticated } = useSelector((state) => state.auth);

  const validateForm = () => {
    let isValid = true;

    if (!email.includes('@') || !email.includes('.')) {
      setEmailError(true);
      isValid = false;
    } else {
      setEmailError(false);
    }

    if (password.length < 6) {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }

    return isValid;
  };

  const handleLogin = () => {
    if (validateForm()) {
      dispatch(loginUser({ email, password }));
    }
  };

  // Check if the user is authenticated and navigate to the admin panel
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin'); // Redirect to admin panel after successful login
    }
  }, [isAuthenticated, navigate]); // Include navigate in the dependency array

  return (
    <Box className="login-page">
      <Box className="left-side">
        <Box className="left-content">
          <Typography variant="h4" className="quote-text">
            "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful."
          </Typography>
        </Box>
      </Box>

      <Box className="right-side">
        <Container maxWidth="sm" className="login-container">
          <Typography variant="h4" gutterBottom>Admin Login</Typography>

          {error && (
            <Alert severity="error" className="error-alert">
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            helperText={emailError ? "Please enter a valid email address." : ""}
            margin="normal"
            className="login-input"
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            helperText={passwordError ? "Password must be at least 6 characters long." : ""}
            margin="normal"
            className="login-input"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            fullWidth
            className="login-button"
          >
            Login
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;
