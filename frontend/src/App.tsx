import Header from './components/Header'
import './index.css'
import CreateTaskSection from './components/CreateTaskSection'
import { Route, Routes } from 'react-router-dom'
import Products from './components/Products'
import ProductsAdvanced from './components/ProductsAdvanced'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<CreateTaskSection />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/ProductsAdvanced" element={<ProductsAdvanced />} />
      </Routes>
    </>
  )
}

export default App
