import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material'
import type { User } from '../types/user'

type Props = {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

const UserList: React.FC<Props> = ({ users, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        {/* Table Header */}
        <TableHead>
          <TableRow sx={{ backgroundColor: 'black' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 2 }}>
              First Name
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 2 }}>
              Last Name
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 2 }}>
              Phone
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 2 }}>
              Email
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 2 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onEdit(user)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => onDelete(user)}
                  sx={{ ml: 1 }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default UserList
