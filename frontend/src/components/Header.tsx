import { useGlobalContext } from '@/contexts/GlobalContextProvider'
import { Typography } from 'antd'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  const { headerTitle, setHeaderTitle, formTitleString } = useGlobalContext()

  useEffect(() => {
    setHeaderTitle(formTitleString)
  }, [formTitleString]) // removes lag

  useEffect(() => {}, [location.pathname])

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-black text-white header-container">
      <Typography className="text-2xl font-medium font-bold header-title">{headerTitle}</Typography>
      <div className="flex items-center gap-20 ml-auto main-nav">
        {location.pathname !== '/' && (
          <Link to="/" className="text-l font-medium hover:underline underline-offset-8 nav-link">
            Pocetna
          </Link>
        )}
        <Link to="/ProductCreate" className="text-l font-medium hover:underline underline-offset-8 nav-link">
          Novi proizvod
        </Link>
        <Link to="/ProductList" className="text-l font-medium hover:underline underline-offset-8 nav-link">
          Lista proizvoda
        </Link>
        <Link to="/ContactsList" className="text-l font-medium hover:underline underline-offset-8 nav-link">
          Lista Musterija
        </Link>
        <Link to="/Tasks" className="text-l font-medium hover:underline underline-offset-8 nav-link">
          Aktivni Poslovi
        </Link>
        <Link to="/Bills" className="text-l font-medium hover:underline underline-offset-8 nav-link">
          Arhiva zavrsenih poslova
        </Link>
      </div>
      <nav className="ml-auto flex items-left gap-4 l:gap-10 external-links">
        {/* <Link
          to="https://www.venerabike.rs/"
          className="text-l font-medium hover:underline underline-offset-8 external-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          VeneraBike
        </Link> */}
      </nav>
    </header>
  )
}

export default Header
