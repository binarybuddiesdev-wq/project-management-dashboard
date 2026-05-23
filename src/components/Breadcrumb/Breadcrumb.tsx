import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const formatLabel = (str: string): string => {
  return str
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export const Breadcrumb = () => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  return (
    <nav className="flex items-center gap-1.5 text-xs text-muted-foreground select-none py-2 px-6 bg-accent/5 border-b border-border">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
        aria-label="Home"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1
        const label = formatLabel(value)

        return (
          <div key={to} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link
                to={to}
                className="hover:text-foreground transition-colors cursor-pointer"
              >
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
