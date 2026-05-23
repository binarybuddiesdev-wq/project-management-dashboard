import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Breadcrumb } from './Breadcrumb'
import { MemoryRouter } from 'react-router-dom'

describe('Breadcrumb', () => {
  it('renders home link when route is root', () => {
    const { getByLabelText, queryByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Breadcrumb />
      </MemoryRouter>
    )

    expect(getByLabelText('Home')).toBeInTheDocument()
    // No other pathnames should render
    expect(queryByText('Projects')).toBeNull()
  })

  it('renders dynamic pathname segments properly formatted', () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter initialEntries={['/projects/my-first-project']}>
        <Breadcrumb />
      </MemoryRouter>
    )

    expect(getByLabelText('Home')).toBeInTheDocument()
    expect(getByText('Projects')).toBeInTheDocument()
    expect(getByText('My First Project')).toBeInTheDocument()
  })
})
