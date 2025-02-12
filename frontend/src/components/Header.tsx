import {
  ContactsOutlined,
  DatabaseOutlined,
  FileAddOutlined,
  HomeOutlined,
  ProductOutlined,
  ToolOutlined,
} from '@ant-design/icons'
import { Tooltip, Typography } from 'antd'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useGlobalContext } from './GlobalContextProvider'

const Header = () => {
  const { headerTitle, setHeaderTitle, formTitleString } = useGlobalContext()

  useEffect(() => {
    setHeaderTitle(formTitleString)
  }, [formTitleString]) // removes lag

  //useEffect(() => {}, [location.pathname])

  return (
    
<header className="px-4 lg:px-6 p-7 h-16 flex items-center bg-white opacity-90 text-white" id='glowic'>                
<div className="hidden sm:block">
  {/* <Typography className="text-2xl font-medium font-bold header-title">{headerTitle}</Typography> */}
</div>

      {/* problem here  */}
      <div className="flex items-center ml-auto main-nav gap-4 sm:gap-10 md:gap-20"> 
        {/* {location.pathname !== '/' && ( */}
        {/* <Tooltip title="Home">
          <Link to="/" className="text-l font-medium hover:underline underline-offset-8 nav-link">
            <HomeOutlined />
          </Link>
        </Tooltip> */}

        {/* <Tooltip title="Dodaj proizvod">
          <Link to="/ProductCreate" className="text-l font-medium hover:underline underline-offset-8 nav-link">
            <FileAddOutlined />
          </Link>
        </Tooltip> */}
        <Tooltip title="Aktivni poslovi">
          <Link to="/Tasks" className="text-l font-medium hover:underline underline-offset-8 nav-link">
            <ToolOutlined />
          </Link>
        </Tooltip>
        <Tooltip title="Lista proizvoda">
          <Link to="/ProductList" className="text-l font-medium hover:underline underline-offset-8 nav-link">
            <ProductOutlined />
          </Link>
        </Tooltip>
        <Tooltip title="Lista kontakta">
          <Link to="/ContactsList" className="text-l font-medium hover:underline underline-offset-8 nav-link">
            <ContactsOutlined />
          </Link>
        </Tooltip>
        <Tooltip title="Zavrseni poslovi">
          <Link to="/Bills" className="text-l font-medium hover:underline underline-offset-8 nav-link">
            <DatabaseOutlined />
          </Link>
        </Tooltip>

      </div>
      <nav className="ml-auto flex items-left gap-4 l:gap-10 external-links"></nav>
    </header>
  )
}

export default Header
