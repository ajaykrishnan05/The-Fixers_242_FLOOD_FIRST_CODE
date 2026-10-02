import { NavLink, Outlet } from 'react-router-dom'
import { Droplets, TriangleAlert } from 'lucide-react'
import { PILOT_LOCATION } from '../data/demoData'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/methodology', label: 'Methodology', end: false },
  { to: '/about', label: 'About', end: false },
]

export default function AppShell() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-[1100] shadow-md">
        <nav className="bg-navy-900 text-white" aria-label="Primary">
          <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
            <NavLink to="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500 text-navy-900">
                <Droplets size={20} strokeWidth={2.5} aria-hidden />
              </span>
              <span className="leading-tight">
                <span className="block text-lg font-extrabold tracking-tight">FloodFirst</span>
                <span className="hidden text-xs text-slate-300 sm:block">From rainfall alerts to local action.</span>
              </span>
            </NavLink>
            <ul className="flex items-center gap-1">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.end}
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                        isActive ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <div className="bg-amber-400 text-slate-900" role="status">
          <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-center gap-x-3 gap-y-0.5 px-4 py-1.5 text-center text-xs font-bold tracking-wide sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <TriangleAlert size={16} aria-hidden />
              DEMO MODE — NOT AN OFFICIAL WARNING
            </span>
            <span className="hidden font-medium sm:inline">· {PILOT_LOCATION}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1500px] flex-1 px-4 py-5">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-600">
        <p className="mx-auto max-w-3xl px-4">
          FloodFirst is a hackathon demo using embedded mock data. Outputs are demo decision-support estimates, not an
          official weather or evacuation warning.
        </p>
      </footer>
    </div>
  )
}
