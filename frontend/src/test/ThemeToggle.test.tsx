import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ThemeToggle from '../components/ThemeToggle'

describe('ThemeToggle', () => {
  it('renders a toggle button', () => {
    render(<ThemeToggle theme="light" onToggle={() => {}} />)
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })

  it('shows moon icon in light mode', () => {
    const { container } = render(<ThemeToggle theme="light" onToggle={() => {}} />)
    expect(container.querySelector('path')).toBeInTheDocument()
  })

  it('fires onToggle when clicked', () => {
    const onToggle = vi.fn()
    render(<ThemeToggle theme="light" onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledOnce()
  })
})
