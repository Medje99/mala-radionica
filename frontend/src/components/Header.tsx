import { useGlobalContext } from '@/contexts/GlobalContextProvider'
import { Typography } from 'antd'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  const { headerTitle, setHeaderTitle, formTitleString } = useGlobalContext()

  useEffect(() => {
    setHeaderTitle(formTitleString)
  }, [formTitleString]) // removes lag

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-black text-white">
      <Typography className="text-2xl font-medium font-bold header-title">{headerTitle}</Typography>
      <div className="flex items-center gap-20 ml-auto">
        <Link to="/" className="text-l font-medium hover:underline underline-offset-8">
          Pocetna
        </Link>
        <Link to="/ProductCreate" className="text-l font-medium hover:underline underline-offset-8">
          Novi proizvod
        </Link>
        <Link to="/ProductList" className="text-l font-medium hover:underline underline-offset-8">
          Lista proizvoda
        </Link>
        <Link to="/ContactsList" className="text-l font-medium hover:underline underline-offset-8">
          Lista Musterija
        </Link>
        <Link to="/Tasks" className="text-l font-medium hover:underline underline-offset-8">
          Aktivni Poslovi
        </Link>
        <Link to="/Bills" className="text-l font-medium hover:underline underline-offset-8">
          Arhiva zavrsenih poslova
        </Link>
        {/* <Link to="/Bills" className="text-l font-medium hover:underline underline-offset-8">
          Finansije
        </Link> */}
      </div>
      <nav className="ml-auto flex items-left gap-4 l:gap-10">
        <Link
          to="https://www.venerabike.rs/"
          className="text-l font-medium hover:underline underline-offset-8"
          target="_blank"
          rel="noopener noreferrer"
        >
          VeneraBike
        </Link>

        <Link
          to="https://megafavorit.com/"
          className="text-l font-medium hover:underline underline-offset-8"
          target="_blank"
          rel="noopener noreferrer"
        >
          MegaFavorit
        </Link>
        <Link
          to="https://swordsrbija.com/"
          className="text-l font-medium hover:underline underline-offset-8"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sword
        </Link>
        <Link
          to="https://www.tehnomotornis.rs/pocetna"
          className="text-l font-medium hover:underline underline-offset-8"
          target="_blank"
          rel="noopener noreferrer"
        >
          TehnoMotorNis
        </Link>
        <Link
          to="https://motobikeshop.rs/"
          className="text-l font-medium hover:underline underline-offset-8"
          target="_blank"
          rel="noopener noreferrer"
        >
          MotoBikeShop
        </Link>
        <Link
          to="https://www.kupujemprodajem.com/"
          className="text-l font-medium hover:underline underline-offset-8 "
          target="_blank"
          rel="noopener noreferrer"
        >
          KP
        </Link>
      </nav>
    </header>
  )
}

export default Header
