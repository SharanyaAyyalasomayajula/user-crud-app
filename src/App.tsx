import { useState, useEffect } from 'react'
import UserForm from './components/UserForm'
import UserList from './components/UserList'
import type { User } from './types/user'
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material'

const API_URL = 'https://user-crud-backend-pyfx.onrender.com/users'

export default function App() {
  const [users, setUsers] = useState<User[]>([])
  const [view, setView] = useState<'form' | 'list'>('form')
  const [editingUser, setEditingUser] = useState<User | null>(null)

  // 🔹 Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error('Failed to fetch users')
      const data: User[] = await res.json()
      setUsers(data)
    } catch (err) {
      console.error('Failed to fetch users', err)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // 🔹 Create user (POST)
  const handleAddUser = async (user: User) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })
      if (!res.ok) throw new Error('Failed to add user')
      const newUser: User = await res.json()
      setUsers(prev => [...prev, newUser])
      setView('list')
    } catch (err) {
      console.error('Failed to add user', err)
    }
  }

  // 🔹 Save user (PUT or POST)
  const handleSaveUser = async (user: User) => {
    if (editingUser && editingUser.id) {
      try {
        const res = await fetch(`${API_URL}/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...user, id: editingUser.id }),
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
      handleAddUser(user)
    }
  }

  // 🔹 Edit
  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setView('form')
  }

  // 🔹 Delete
  const handleDeleteUser = async (user: User) => {
    if (!user.id) return
    try {
      const res = await fetch(`${API_URL}/${user.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete user')
      setUsers(prev => prev.filter(u => u.id !== user.id))
    } catch (err) {
      console.error('Failed to delete user', err)
    }
  }

  const handleViewSwitch = (newView: 'form' | 'list') => {
    setEditingUser(null)
    setView(newView)
  }

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: 'black' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5" fontWeight="bold">
            User Management
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant={view === 'form' ? 'contained' : 'outlined'}
              onClick={() => handleViewSwitch('form')}
            >
              Add User
            </Button>
            <Button
              variant={view === 'list' ? 'contained' : 'outlined'}
              onClick={() => handleViewSwitch('list')}
            >
              User List
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
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
  )
}
