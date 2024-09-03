import { useGlobalContext } from '@/contexts/GlobalContextProvider'
import {
  ContactsOutlined,
  DatabaseOutlined,
  FileAddOutlined,
  HomeOutlined,
  ProductOutlined,
  ToolOutlined,
} from '@ant-design/icons'
import { Typography } from 'antd'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  const { headerTitle, setHeaderTitle, formTitleString } = useGlobalContext()

  useEffect(() => {
    setHeaderTitle(formTitleString)
  }, [formTitleString]) // removes lag

  //useEffect(() => {}, [location.pathname])

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-black text-white header-container">
      <Typography className="text-2xl font-medium font-bold header-title">{headerTitle}</Typography>
      <div className="flex items-center gap-20 ml-auto main-nav">
        {/* {location.pathname !== '/' && ( */}
        <Link to="/" className="text-l font-medium hover:underline underline-offset-8 nav-link">
          <HomeOutlined />
        </Link>
        {/* )} */}
        <Link to="/ProductCreate" className="text-l font-medium hover:underline underline-offset-8 nav-link">
          <FileAddOutlined />
        </Link>
        <Link to="/ProductList" className="text-l font-medium hover:underline underline-offset-8 nav-link">
          <ProductOutlined />
        </Link>
        <Link to="/ContactsList" className="text-l font-medium hover:underline underline-offset-8 nav-link">
          <ContactsOutlined />
        </Link>
        <Link to="/Tasks" className="text-l font-medium hover:underline underline-offset-8 nav-link">
          <ToolOutlined />
        </Link>
        <Link to="/Bills" className="text-l font-medium hover:underline underline-offset-8 nav-link">
          <DatabaseOutlined />
        </Link>
      </div>
      <nav className="ml-auto flex items-left gap-4 l:gap-10 external-links"></nav>
    </header>
  )
}

export default Header
