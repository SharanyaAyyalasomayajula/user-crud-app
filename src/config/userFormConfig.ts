export type UserField = {
  name: 'firstName' | 'lastName' | 'phone' | 'email'
  label: string
  required?: boolean
  requiredMessage?:string
  type?: string
  pattern?: RegExp
  patternMessage?: string
}

export const userFormFields: UserField[] = [
  {
    name: 'firstName',
    label: 'First Name',
    required: true,
    requiredMessage: 'First Name is required',
    pattern: /^[A-Za-z\s]+$/,
    patternMessage: 'Only letters are allowed in First Name',
  },
  {
    name: 'lastName',
    label: 'Last Name',
    required: true,
    requiredMessage: 'Last Name is required',
    pattern: /^[A-Za-z\s]+$/,
    patternMessage: 'Only letters are allowed in Last Name',
  },
  {
    name: 'phone',
    label: 'Phone Number',
    required: true,
    requiredMessage: 'Phone is required',
    pattern: /^[0-9]*$/,
    patternMessage: 'Only digits are allowed',
  },
  
  {
    name: 'email',
    label: 'Email Address',
    required: true,
     requiredMessage: 'Email is required',
    type: 'email',
    pattern: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
    patternMessage: 'Enter a valid email address',
  },
]
