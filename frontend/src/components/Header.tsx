import {
  ContactsOutlined,
  DatabaseOutlined,
  FileAddOutlined,
  HomeOutlined,
  ProductOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react'; // Dodajte useState
import { Link } from 'react-router-dom';
import { useGlobalContext } from './GlobalContextProvider';

const Header = () => {
  const { headerTitle, setHeaderTitle, formTitleString } = useGlobalContext();
  const [showIframe, setShowIframe] = useState(false); // Stanje za iframe

  useEffect(() => {
    setHeaderTitle(formTitleString);
  }, [formTitleString]); // removes lag

  const handleExternalLinkClick = (e) => {
    e.preventDefault(); // Sprečava podrazumevano ponašanje linka
    setShowIframe(true); // Prikazuje iframe
  };

  const closeIframe = () => {
    setShowIframe(false); // Sakriva iframe
  };

  return (
    <>
      <header className="px-4 lg:px-6 p-7 h-16 flex items-center bg-white opacity-90 text-white" id="glowic">
        <div className="hidden sm:block">
          {/* <Typography className="text-2xl font-medium font-bold header-title">{headerTitle}</Typography> */}
        </div>

        <div className="flex items-center ml-auto main-nav gap-4 sm:gap-10 md:gap-20">
        <Tooltip title="Aktivni poslovi">
  <Link 
    to="/Tasks" 
    className="text-l font-medium underline-offset-8 nav-link header-link"
  >
    <ToolOutlined />
  </Link>
</Tooltip>
<Tooltip title="Lista proizvoda">
  <Link 
    to="/ProductList" 
    className="text-l font-medium underline-offset-8 nav-link header-link"
  >
    <ProductOutlined />
  </Link>
</Tooltip>
<Tooltip title="Lista kontakta">
  <Link 
    to="/ContactsList" 
    className="text-l font-medium underline-offset-8 nav-link header-link"
  >
    <ContactsOutlined />
  </Link>
</Tooltip>
<Tooltip title="Zavrseni poslovi">
  <Link 
    to="/Bills" 
    className="text-l font-medium underline-offset-8 nav-link header-link"
  >
    <DatabaseOutlined />
  </Link>
</Tooltip>
        </div>
        <nav className="ml-auto flex items-left gap-4 l:gap-10 external-links"></nav>
      </header>

      {/* Iframe za prikaz eksternog sajta */}
      {showIframe && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '90%',
              height: '90%',
              backgroundColor: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <iframe
              src="https://rtsplaneta.rs/live/radio/16091/beograd-202"
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="External Website"
            />
            <button
              onClick={closeIframe}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                padding: '10px 20px',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Zatvori
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;