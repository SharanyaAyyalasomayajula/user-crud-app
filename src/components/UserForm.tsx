import { useState,useEffect } from 'react'
import { Box, TextField, Button, Typography } from '@mui/material'
import type { User } from '../types/user'
import { userFormFields } from '../config/userFormConfig'

const emptyUser: User = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
}

type Props = {
  onSubmit: (user: User) => void
  initialUser?: User | null  
  
}

function UserForm({ onSubmit,initialUser }: Props) {
  const [user, setUser] = useState<User>(initialUser || emptyUser)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  useEffect(() => {
    setUser(initialUser || emptyUser)
    setErrors({})
    setTouched({})
  }, [initialUser])
  const validateField = (name: string, value: string) => {
    const field = userFormFields.find(f => f.name === name)
    if (!field) return ''

    const val = String(value)

    if (field.pattern && val && !field.pattern.test(val)) {
      return field.patternMessage || 'Invalid value'
    }

    if (field.required && !val.trim()) {
      return field.requiredMessage || 'This field is required'
    }

    return ''
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: value }))

    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
  }

  const validate = (isSubmit = false) => {
    const newErrors: Record<string, string> = {}

    userFormFields.forEach(field => {
      const value = user[field.name]
      const error = validateField(field.name, value)
      if (error) newErrors[field.name] = error
    })

    if (isSubmit && user.phone.trim().length !== 10) {
      newErrors.phone = 'Phone must be exactly 10 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate(true)) return

    onSubmit(user)
    setUser(emptyUser)
    setErrors({})
    setTouched({})
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" mb={2}>
        User Form
      </Typography>

      {userFormFields.map(field => (
        <TextField
          key={field.name}
          name={field.name}
          label={field.label}
          required={field.required}
          type="text"
          value={user[field.name]}
          onChange={handleChange}
          onBlur={handleBlur}
          error={Boolean(errors[field.name])}
          helperText={errors[field.name]}
          fullWidth
          margin="normal"
        />
      ))}

      <Button type="submit" variant="contained"  
      fullWidth sx={{
        mt: 2,
        backgroundColor: 'black',
        color: 'white',
        fontWeight: 'bold',
        ':hover': { backgroundColor: '#333' },
  }}>
        {initialUser ? 'Update' : 'Submit'}
      </Button>
    </Box>
  )
}

export default UserForm
