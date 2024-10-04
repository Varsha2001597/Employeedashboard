// routes/employeeRoutes.js
const express = require('express');
const Employee = require('../models/Employee');


const router = express.Router();

// Create a new employee
router.post('/employees', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all employees
router.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single employee by MongoDB _id
router.get('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an employee by MongoDB _id
// routes/employeeRoutes.js

// Update an employee by MongoDB _id
router.put('/employees/:id', async (req, res) => {
  try {
    // Log the request body and params
    console.log("Updating employee:", req.params.id, req.body);
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error("Update error:", error); // Log full error
    res.status(400).json({ error: error.message });
  }
});


// Delete an employee by MongoDB _id
router.delete('/employees/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Employee.findByIdAndDelete(req.params.id);
// Using 'id' instead of '_id'
    if (!employee) {
      return res.status(404).send({ message: 'Employee not found' });
    }
    res.status(200).send({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error', error: error.message });
  }
});


module.exports = router;
