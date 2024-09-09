import { Typography } from 'antd'

const Footer = () => {
  return (
    <footer className="px-6 h-8  flex items-center bg-black  justify-center footer-container">
      <Typography.Text className="text-sm font-medium text-white">
        &copy; {new Date().getFullYear()} Mala Radionica. Sva prava zadržana.
      </Typography.Text>
    </footer>
  )
}

export default Footer
