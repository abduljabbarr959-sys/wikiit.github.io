import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import Home from '../pages/Home'
import type { EntrySummary } from '../types'

vi.mock('../api', () => ({
  listEntries: vi.fn(),
}))

import { listEntries } from '../api'

const mockEntries: EntrySummary[] = [
  { title: 'Python', snippet: 'Python is a programming language...', updated_at: new Date().toISOString() },
  { title: 'Django', snippet: 'Django is a web framework...', updated_at: new Date().toISOString() },
  { title: 'CSS', snippet: 'CSS describes how HTML elements...', updated_at: new Date().toISOString() },
]

describe('Home', () => {
  it('shows loading skeleton initially', () => {
    vi.mocked(listEntries).mockReturnValue(new Promise(() => {}))
    const { container } = render(<MemoryRouter><Home /></MemoryRouter>)
    expect(container.querySelector('.skeleton-page')).toBeInTheDocument()
  })

  it('shows entry list when loaded', async () => {
    vi.mocked(listEntries).mockResolvedValue(mockEntries)
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(await screen.findByText('Python')).toBeInTheDocument()
    expect(screen.getByText('Django')).toBeInTheDocument()
    expect(screen.getByText('CSS')).toBeInTheDocument()
  })

  it('shows empty state', async () => {
    vi.mocked(listEntries).mockResolvedValue([])
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(await screen.findByText(/No entries yet/)).toBeInTheDocument()
  })
})
