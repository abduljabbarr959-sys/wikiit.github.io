import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import { ToastProvider } from '../hooks/useToast'
import Register from '../pages/Register'

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }),
}))

describe('Register', () => {
  it('renders the form', () => {
    render(<MemoryRouter><ToastProvider><Register /></ToastProvider></MemoryRouter>)
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
  })

  it('shows password length hint', async () => {
    render(<MemoryRouter><ToastProvider><Register /></ToastProvider></MemoryRouter>)
    const pw = screen.getByLabelText('Password')
    fireEvent.change(pw, { target: { value: 'abc' } })
    expect(await screen.findByText(/5 more characters/)).toBeInTheDocument()
  })

  it('shows password ok when long enough', async () => {
    render(<MemoryRouter><ToastProvider><Register /></ToastProvider></MemoryRouter>)
    const pw = screen.getByLabelText('Password')
    fireEvent.change(pw, { target: { value: 'longenough' } })
    expect(await screen.findByText('Password looks good')).toBeInTheDocument()
  })

  it('shows mismatch hint', async () => {
    render(<MemoryRouter><ToastProvider><Register /></ToastProvider></MemoryRouter>)
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'longenough' } })
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'different' } })
    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument()
  })
})
