import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TagChip from '../tag-chip'

describe('TagChip', () => {
  it('renders tag name correctly', () => {
    render(<TagChip tag="react" />)
    expect(screen.getByText('react')).toBeInTheDocument()
  })

  it('renders with correct size classes', () => {
    render(<TagChip tag="react" size="sm" />)
    const chip = screen.getByText('react')
    expect(chip).toHaveClass('px-2', 'py-1', 'text-xs')
  })

  it('renders with medium size classes', () => {
    render(<TagChip tag="react" size="md" />)
    const chip = screen.getByText('react')
    expect(chip).toHaveClass('px-3', 'py-1', 'text-sm')
  })

  it('renders with default variant', () => {
    render(<TagChip tag="react" />)
    const chip = screen.getByText('react')
    expect(chip).toHaveClass('bg-gray-100', 'dark:bg-gray-800')
  })

  it('renders with active variant', () => {
    render(<TagChip tag="react" variant="active" />)
    const chip = screen.getByText('react')
    expect(chip).toHaveClass('bg-blue-100', 'dark:bg-blue-900')
  })

  it('renders as link when href is provided', () => {
    render(<TagChip tag="react" href="/tags/react" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/tags/react')
    expect(link).toHaveTextContent('react')
  })

  it('renders as span when no href is provided', () => {
    render(<TagChip tag="react" />)
    const chip = screen.getByText('react')
    expect(chip.tagName).toBe('SPAN')
  })
})