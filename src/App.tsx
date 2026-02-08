import { useState, useEffect } from 'react';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import type { User } from './types/user';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [view, setView] = useState<'form' | 'list'>('form'); // form visible initially
  const [editingUser, setEditingUser] = useState<User | null>(null);
  

  // Fetch all users from JSON-server - local
//    const fetchUsers = async () => {
//   try {
//     const res = await fetch('http://localhost:5000/users')
//     if (!res.ok) throw new Error('Failed to fetch users from server')
//     const data: User[] = await res.json()
//     setUsers(data)
//   } catch (err) {
//     console.error('Failed to fetch users', err)
//   }
// }
// for - NETLIFY
const fetchUsers = async () => {
  try {
    const res = await fetch('http://localhost:5000/users')

    if (!res.ok) throw new Error('API not available')

    const data = await res.json()
    setUsers(data)
  } catch {
    // On Netlify: do nothing (state starts empty)
    console.warn('API unavailable, using local state')
  }
}

  

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add new user (POST)-local
//  const handleAddUser = async (user: User) => {
//   try {
//     const res = await fetch('http://localhost:5000/users', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(user),
//     })
//     if (!res.ok) throw new Error('Failed to add user')
//     const newUser: User = await res.json()
//     setUsers(prev => [...prev, newUser])
//     setView('list') // switch to list after submit
//   } catch (err) {
//     console.error('Failed to add user', err)
//   }
// }

//For prod - NETLIFY
const handleAddUser = async (user: User) => {
  try {
    const res = await fetch('http://localhost:5000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })

    if (!res.ok) throw new Error('API not available')

    const newUser = await res.json()
    setUsers(prev => [...prev, newUser])
  } catch {
    // This runs on Netlify
    setUsers(prev => [...prev, { ...user, id: Date.now() }])
  }

  setView('list')
}


  // Save user (PUT if editing, POST if new)
  const handleSaveUser = async (user: User) => {
  if (editingUser && editingUser.id) {
    // Update existing user in JSON-server
    try {
      const res = await fetch(`http://localhost:5000/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })
      if (!res.ok) throw new Error('Failed to update user')
      const updatedUser: User = await res.json()

      setUsers(prev =>
        prev.map(u => (u.id === updatedUser.id ? updatedUser : u))
      )
      setEditingUser(null)
      setView('list')
    } catch (err) {
      console.error('Failed to update user', err)
    }
  } else {
    await handleAddUser(user)
  }
}


  // Edit user
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setView('form');
  };

  // Delete user
  const handleDeleteUser = async (userToDelete: User) => {
  if (!userToDelete.id) return
  try {
    const res = await fetch(`http://localhost:5000/users/${userToDelete.id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete user')
    setUsers(prev => prev.filter(u => u.id !== userToDelete.id))
  } catch (err) {
    console.error('Failed to delete user', err)
  }
}


  // Switch between form and list
  const handleViewSwitch = (newView: 'form' | 'list') => {
    setEditingUser(null);
    setView(newView);
  };

  return (
    <Box>
      {/* Header */}
          <AppBar position="static" sx={{ backgroundColor: 'black', boxShadow: 3 }}>
  <Toolbar
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      px: { xs: 2, sm: 4 },
      py: 1,
    }}
  >
    {/* App Title */}
    <Typography
      variant="h5"
      sx={{
        fontWeight: 'bold',
        letterSpacing: 1,
        color: 'white',
      }}
    >
      User Management
    </Typography>

    {/* Header Buttons */}
    <Box sx={{ display: 'flex', gap: 2, mt: { xs: 1, sm: 0 } }}>
      <Button
        variant={view === 'form' ? 'contained' : 'outlined'}
        sx={{
          backgroundColor: view === 'form' ? '#e0e0e0' : '#f5f5f5',
          color: 'black',
          fontWeight: 'bold',
          textTransform: 'none',
          ':hover': { backgroundColor: '#d5d5d5' },
        }}
        onClick={() => handleViewSwitch('form')}
      >
        Add User
      </Button>

      <Button
        variant={view === 'list' ? 'contained' : 'outlined'}
        sx={{
          backgroundColor: view === 'list' ? '#e0e0e0' : '#f5f5f5',
          color: 'black',
          fontWeight: 'bold',
          textTransform: 'none',
          ':hover': { backgroundColor: '#d5d5d5' },
        }}
        onClick={() => handleViewSwitch('list')}
      >
        User List
      </Button>
    </Box>
  </Toolbar>
</AppBar>



      {/* Main Content */}
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: 2 ,backgroundColor: 'white'}}>
        {view === 'form' && (
          <UserForm onSubmit={handleSaveUser} initialUser={editingUser} />
        )}
        {view === 'list' && (
          <UserList
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        )}
      </Box>
        

    </Box>
  );
}
