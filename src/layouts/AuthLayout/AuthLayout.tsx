import { Outlet } from 'react-router-dom'
import React from 'react'

export interface IAuthLayoutProps {
  children?: React.ReactNode
}

export const AuthLayout = (props: IAuthLayoutProps) => {
  const { children } = props

  return (
    <div className="min-h-screen w-screen flex bg-background text-foreground overflow-hidden font-sans">
      {/* Left Pane - Dark Promo / Workspace Graphic */}
      <div className="w-1/2 bg-zinc-900 border-r border-zinc-800 p-12 lg:flex flex-col justify-between hidden relative overflow-hidden">
        {/* Glow backdrop decorative bubbles */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-md">
            P
          </div>
          <span className="font-semibold text-lg tracking-tight select-none text-zinc-100">
            Workspace Dashboard
          </span>
        </div>

        <div className="space-y-6 relative z-10 max-w-md my-auto">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
            Supercharge your team's workflow.
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            Manage projects, collaborate in real-time, track progress with Kanban boards, and monitor stats on a premium high-performance dashboard.
          </p>
          <div className="pt-4 flex items-center gap-4">
            <div className="flex -space-x-2">
              <img src="https://i.pravatar.cc/32?img=1" className="h-8 w-8 rounded-full border-2 border-zinc-900 object-cover" alt="User Avatar 1" />
              <img src="https://i.pravatar.cc/32?img=2" className="h-8 w-8 rounded-full border-2 border-zinc-900 object-cover" alt="User Avatar 2" />
              <img src="https://i.pravatar.cc/32?img=3" className="h-8 w-8 rounded-full border-2 border-zinc-900 object-cover" alt="User Avatar 3" />
            </div>
            <span className="text-xs text-zinc-400 select-none">
              Trusted by 10,000+ creators worldwide.
            </span>
          </div>
        </div>

        <div className="text-xs text-zinc-500 relative z-10 select-none">
          © {new Date().getFullYear()} Workspace Inc. All rights reserved.
        </div>
      </div>

      {/* Right Pane - Form Outlet */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-zinc-950/20 relative">
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <div className="flex items-center gap-3 lg:hidden mb-8">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-md">
              P
            </div>
            <span className="font-semibold text-lg tracking-tight select-none text-foreground">
              Workspace Dashboard
            </span>
          </div>
          {children || <Outlet />}
        </div>
      </div>
    </div>
  )
}
