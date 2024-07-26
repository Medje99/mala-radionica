import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-black text-white">
      <Link to="/" className="flex items-center justify-center">
        <span className="sr-only">Task Manager</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link
          to="/tasks"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          Tasks
        </Link>
        <Link
          to="/projects"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          Projects
        </Link>
        <Link
          to="/calendar"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          Calendar
        </Link>
        <Link
          to="/settings"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          Settings
        </Link>
      </nav>
    </header>
  )
}

export default Header
