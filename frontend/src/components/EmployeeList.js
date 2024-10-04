import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  TablePagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const EmployeeList = ({ employees, onEdit, onDelete }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper style={{ marginTop: '20px', backgroundColor: '#f5f5f5' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Profile</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Courses</TableCell>
              <TableCell>Creation Date</TableCell> {/* New column for Creation Date */}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
  {employee.image ? (
    <img
      src={employee.image} // This will now be a base64 image or a URL
      alt={employee.name}
      style={{ width: '50px', height: '50px', borderRadius: '50%' }}
    />
  ) : (
    'No Image'
  )}
</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.mobile}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.gender}</TableCell>
                <TableCell>{employee.courses.join(', ')}</TableCell>
                <TableCell>{employee.createdAt}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => onEdit(employee)} aria-label="edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => onDelete(employee._id)} aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={employees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default EmployeeList;
