import Header from './components/Header'
import './index.css'
import CreateTaskSection from './components/CreateTaskSection'
import { Route, Routes } from 'react-router-dom'
import Products from './components/Products.tsx'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<CreateTaskSection />} />
        <Route path="/Products" element={<Products />} />
      </Routes>
    </>
  )
}

export default App
