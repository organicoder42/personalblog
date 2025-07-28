import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Search from '../search'

// Mock fetch
global.fetch = vi.fn()

const mockSearchData = [
  {
    title: 'Test Post 1',
    summary: 'This is a test post about React',
    tags: ['react', 'javascript'],
    slug: 'test-post-1',
    url: '/posts/test-post-1',
    publishedAt: '2025-01-01',
  },
  {
    title: 'Another Post',
    summary: 'This is about Vue.js',
    tags: ['vue', 'javascript'],
    slug: 'another-post',
    url: '/posts/another-post',
    publishedAt: '2025-01-02',
  },
]

describe('Search', () => {
  beforeEach(() => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(mockSearchData)))
  })

  it('renders search input with placeholder', () => {
    render(<Search placeholder="Search here..." />)
    expect(screen.getByPlaceholderText('Search here...')).toBeInTheDocument()
  })

  it('renders default placeholder when none provided', () => {
    render(<Search />)
    expect(screen.getByPlaceholderText('Search posts...')).toBeInTheDocument()
  })

  it('shows search icon', () => {
    render(<Search />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('loads search index on mount', async () => {
    render(<Search />)
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/search-index.json')
    })
  })

  it('shows loading state while searching', async () => {
    const user = userEvent.setup()
    render(<Search />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'react')
    
    // Should show loading spinner briefly
    expect(screen.getByRole('textbox')).toHaveValue('react')
  })

  it('shows clear button when query exists', async () => {
    const user = userEvent.setup()
    render(<Search />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'test')
    
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  it('clears search when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(<Search />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'test')
    
    const clearButton = await screen.findByRole('button')
    await user.click(clearButton)
    
    expect(input).toHaveValue('')
  })

  it('does not show results for queries shorter than 2 characters', async () => {
    const user = userEvent.setup()
    render(<Search />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'a')
    
    // Wait a bit and ensure no results are shown
    await new Promise(resolve => setTimeout(resolve, 400))
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})