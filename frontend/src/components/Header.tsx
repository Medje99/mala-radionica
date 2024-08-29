import { useGlobalContext } from '@/contexts/GlobalContextProvider'
import { Typography } from 'antd'

import { Link } from 'react-router-dom'

const Header = () => {
  const { headerTitle } = useGlobalContext()

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-black text-white">
      <Link to="/" className="flex items-center justify-center">
        <Typography className="text-4xl font-medium font-bold header-title">Pocetna: </Typography>
      </Link>
      <Typography className="text-4xl font-medium font-bold header-title">{headerTitle}</Typography>

      <nav className="ml-auto flex items-left gap-4 sm:gap-10">
        <div className="flex items-center gap-10">
          <Link
            to="https://www.venerabike.rs/"
            className="text-sm font-medium hover:underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            VeneraBike
          </Link>

          <Link
            to="https://megafavorit.com/"
            className="text-sm font-medium hover:underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            MegaFavorit
          </Link>
          <Link
            to="https://swordsrbija.com/"
            className="text-sm font-medium hover:underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sword
          </Link>
          <Link
            to="https://www.tehnomotornis.rs/pocetna"
            className="text-sm font-medium hover:underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            TehnoMotorNis
          </Link>
          <Link
            to="https://motobikeshop.rs/"
            className="text-sm font-medium hover:underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            MotoBikeShop
          </Link>
          <Link
            to="https://www.kupujemprodajem.com/"
            className="text-sm font-medium hover:underline underline-offset-4 "
            target="_blank"
            rel="noopener noreferrer"
          >
            KP
          </Link>
        </div>
        <Link to="/" className="text-sm font-medium hover:underline underline-offset-4">
          Pocetna
        </Link>
        <Link to="/ProductCreate" className="text-sm font-medium hover:underline underline-offset-4">
          Kreiraj proizvod
        </Link>
        <Link to="/ProductList" className="text-sm font-medium hover:underline underline-offset-4">
          Lista proizvoda
        </Link>
        <Link to="/ContactsList" className="text-sm font-medium hover:underline underline-offset-4">
          Lista Musterija
        </Link>
        <Link to="/Tasks" className="text-sm font-medium hover:underline underline-offset-4">
          Aktivni Poslovi
        </Link>
        <Link to="/Bills" className="text-sm font-medium hover:underline underline-offset-4">
          Arhiva zavrsenih poslova
        </Link>
        <Link to="/Bills" className="text-sm font-medium hover:underline underline-offset-4">
          Finansije
        </Link>
      </nav>
    </header>
  )
}

export default Header
