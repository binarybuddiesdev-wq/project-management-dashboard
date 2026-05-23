import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AuthLayout } from './AuthLayout'
import { MemoryRouter } from 'react-router-dom'

describe('AuthLayout', () => {
  it('renders branding promo panels and child elements', () => {
    const { getByText, getAllByText } = render(
      <MemoryRouter>
        <AuthLayout>
          <div>Child Form Content</div>
        </AuthLayout>
      </MemoryRouter>
    )

    expect(getAllByText('Workspace Dashboard')[0]).toBeInTheDocument()
    expect(getByText('Supercharge your team\'s workflow.')).toBeInTheDocument()
    expect(getByText('Child Form Content')).toBeInTheDocument()
  })
})
