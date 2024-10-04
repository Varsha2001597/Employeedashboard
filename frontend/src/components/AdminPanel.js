import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormControl,
  FormLabel,
  FormGroup,
  Typography,
  Box,
  Snackbar,
  Alert,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { createEmployee, fetchEmployees, updateEmployee, deleteEmployee } from '../redux/slices/employeeSlice';
import EmployeeList from './EmployeeList';
import { useNavigate } from 'react-router-dom';
import AdminPanelHeader from './AdminPanelHeader';
import { ToastContainer, toast } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import validator from 'validator';
import 'react-toastify/dist/ReactToastify.css';

const AdminPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const employees = useSelector((state) => state.employee.employees);
  const user = useSelector((state) => state.auth.user);

  const [open, setOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [position, setPosition] = useState(''); // Dropdown state for position
  const [salary, setSalary] = useState('');
  const [gender, setGender] = useState('male');
  const [courses, setCourses] = useState({ mca: false, bca: false, bsc: false });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUploadMessage, setImageUploadMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logout successfully.', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  const handleClickOpen = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setName(employee.name);
      setEmail(employee.email);
      setMobile(employee.mobile);
      setPosition(employee.position); // Set position from employee data
      setSalary(employee.salary);
      setGender(employee.gender);
      const selectedCourses = { mca: false, bca: false, bsc: false };
      employee.courses.forEach((course) => {
        selectedCourses[course] = true;
      });
      setCourses(selectedCourses);
      setSelectedImage(null);
    } else {
      setEditingEmployee(null);
      resetFormFields();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetFormFields();
  };

  const resetFormFields = () => {
    setName('');
    setEmail('');
    setMobile('');
    setPosition(''); // Reset position
    setSalary('');
    setGender('male');
    setCourses({ mca: false, bca: false, bsc: false });
    setSelectedImage(null);
    setEmailError('');
    setMobileError('');
    setImageUploadMessage(''); // Reset image upload message
  };

  const validateEmail = (email) => {
    if (!validator.isEmail(email)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };

  const validateMobile = (mobile) => {
    if (mobile.length < 10 || mobile.length > 15) {
      setMobileError('Invalid phone number for the selected country');
    } else {
      setMobileError('');
    }
  };

  const handleCreateOrUpdateEmployee = () => {
    if (emailError || mobileError) {
      toast.error('Please fix the errors before submitting.');
      return;
    }

    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;

        const newEmployee = {
          name,
          email,
          mobile,
          position,
          salary,
          gender,
          courses: Object.keys(courses).filter((course) => courses[course]),
          image: base64Image,
          createdAt: editingEmployee ? editingEmployee.createdAt : new Date().toLocaleDateString(),
        };

        if (editingEmployee) {
          dispatch(updateEmployee({ _id: editingEmployee._id, employee: newEmployee }));
          toast.success('Employee updated successfully!', { icon: '✔️' });
        } else {
          dispatch(createEmployee(newEmployee));
          toast.success('Employee created successfully!', { icon: '✔️' });
        }
        handleClose();
      };
      reader.readAsDataURL(selectedImage);
    } else {
      const newEmployee = {
        name,
        email,
        mobile,
        position,
        salary,
        gender,
        courses: Object.keys(courses).filter((course) => courses[course]),
        image: editingEmployee ? editingEmployee.image : null,
        createdAt: editingEmployee ? editingEmployee.createdAt : new Date().toLocaleDateString(),
      };

      if (editingEmployee) {
        dispatch(updateEmployee({ _id: editingEmployee._id, employee: newEmployee }));
        toast.success('Employee updated successfully!', { icon: '✔️' });
      } else {
        dispatch(createEmployee(newEmployee));
        toast.success('Employee created successfully!', { icon: '✔️' });
      }
      handleClose();
    }
  };

  const handleCourseChange = (event) => {
    const { name, checked } = event.target;
    setCourses((prevCourses) => ({ ...prevCourses, [name]: checked }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImageUploadMessage('Image added successfully!'); // Success message
    } else {
      setImageUploadMessage('No image uploaded.'); // Error message
    }
    setSnackbarOpen(true); // Open the Snackbar
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false); // Close the Snackbar
  };

  const handleDeleteEmployee = (_id) => {
    console.log("Deleting employee with id:", _id); // Debug log
    dispatch(deleteEmployee({ _id })); // Wrap _id in an object
    toast.error('Employee deleted!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: { backgroundColor: 'red', color: 'white' },
    });
  };
  


  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AdminPanelHeader user={user} onLogout={handleLogout} />
      <ToastContainer />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {imageUploadMessage}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #3f51b5, #ffffff)', // Blue and white gradient background
          minHeight: '100vh',
          padding: '20px',
        }}
      >
        <Container>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ color: 'white' }}>List of Employees</Typography>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search Employees"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '20px', // Set the border radius for rounded edges
                  marginRight: '10px',
                  width: '200px', // Set a specific width for better visibility
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px', // Ensure the outlined input has the same radius
                  },
                }}
              />
              <Button variant="contained" onClick={() => handleClickOpen()} sx={{ backgroundColor: '#3f51b5', color: 'white', borderRadius: '20px', height:"43px"}}>
                Add Employee
              </Button>
            </div>
          </div>

          <EmployeeList employees={filteredEmployees} onEdit={handleClickOpen} onDelete={handleDeleteEmployee} />

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                error={!!emailError}
                helperText={emailError}
              />
              <PhoneInput
                country={'us'}
                value={mobile}
                onChange={(phone) => {
                  setMobile(phone);
                  validateMobile(phone);
                }}
                containerStyle={{ marginTop: '10px', width: '100%' }}
                inputStyle={{ width: '100%', borderRadius: '4px' }}
              />
              {mobileError && <div style={{ color: 'red' }}>{mobileError}</div>}
              <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                <InputLabel id="position-label">Position</InputLabel>
                <Select
                  labelId="position-label"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  label="Position"
                >
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Developer">Developer</MenuItem>
                  <MenuItem value="Designer">Designer</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                </Select>
              </FormControl>
              
              <FormLabel component="legend" sx={{ mt: 2 }}>Gender</FormLabel>
              <RadioGroup
                row
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female" />
              </RadioGroup>
              <FormLabel component="legend" sx={{ mt: 2 }}>Courses</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={courses.mca} onChange={handleCourseChange} name="mca" />}
                  label="MCA"
                />
                <FormControlLabel
                  control={<Checkbox checked={courses.bca} onChange={handleCourseChange} name="bca" />}
                  label="BCA"
                />
                <FormControlLabel
                  control={<Checkbox checked={courses.bsc} onChange={handleCourseChange} name="bsc" />}
                  label="B.Sc"
                />
              </FormGroup>
              <Button
                variant="contained"
                component="label"
                sx={{ mt: 2 }}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">Cancel</Button>
              <Button onClick={handleCreateOrUpdateEmployee} color="primary">
                {editingEmployee ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </>
  );
};

export default AdminPanel;
