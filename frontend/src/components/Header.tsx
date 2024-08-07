import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-black text-white">
      <Link to="/" className="flex items-center justify-center">
        <span className="sr-only">/</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link
          to="/"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          Pocetna
        </Link>
        <Link
          to="/ProductCreate"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          Kreiraj proizvod
        </Link>
        <Link
          to="/ProductList"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          Lista proizvoda
        </Link>
        <Link
          to="/Tasks"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          Poslovi
        </Link>
        <Link
          to="/Bills"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          Finansije
        </Link>
      </nav>
    </header>
  )
}

export default Header
