// redux/employeeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch employees
export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
  const response = await fetch('http://localhost:3000/api/employees');
  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }
  return await response.json();
});

// Create a new employee
export const createEmployee = createAsyncThunk('employees/createEmployee', async (newEmployee) => {
  const response = await fetch('http://localhost:3000/api/employees', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newEmployee),
  });
  if (!response.ok) {
    throw new Error('Failed to create employee');
  }
  return await response.json();
});

// Update employee
export const updateEmployee = createAsyncThunk('employees/updateEmployee', async ({ _id, employee }, { rejectWithValue }) => {
  try {
    const response = await fetch(`http://localhost:3000/api/employees/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employee),
    });
    if (!response.ok) {
      throw new Error('Failed to update employee');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in updateEmployee thunk:', error); // Log error
    return rejectWithValue(error.message); // Handle rejection
  }
});



// Delete employee
export const deleteEmployee = createAsyncThunk('employees/deleteEmployee', async ({ _id }) => {
  const response = await fetch(`http://localhost:3000/api/employees/${_id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete employee');
  }
  return _id; // Return _id after successful deletion
});


const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    employees: [],
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // Fetch employees
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.employees = action.payload;
      })
      // Create employee
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload);
      })
      // Update employee
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex(emp => emp._id === action.payload._id); // Find by _id
        if (index !== -1) {
          state.employees[index] = action.payload; // Update the employee in the state
        }
      })
      
      // Delete employee
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(emp => emp._id !== action.payload);
 // Filter out the deleted employee using _id
      })
      .addCase(deleteEmployee.rejected,(state, action) => {
        state.error = action.error.message;
      })
      // Handle fetch errors
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.error = action.error.message;
      });
  }
});

export default employeeSlice.reducer;
