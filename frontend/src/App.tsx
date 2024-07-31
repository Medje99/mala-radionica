import Header from './components/Header'
import './index.css'
import CreateTaskSection from './components/CreateTaskSection'
import { Route, Routes } from 'react-router-dom'
import Products from './components/Products'
import ProductsAdvanced from './components/ProductsAdvanced'
import CreateProductForm from './components/create-product-form-component/CreateProductForm'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<CreateTaskSection />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/ProductInput" element={<CreateProductForm />} />
        <Route path="/ProductsAdvanced" element={<ProductsAdvanced />} />
      </Routes>
    </>
  )
}

export default App
