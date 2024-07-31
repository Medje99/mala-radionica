import Header from './components/Header'
import './index.css'
import CreateTaskSection from './components/CreateTaskSection'
import { Route, Routes } from 'react-router-dom'
import ProductsList from './components/product-list-component/ProductsAdvanced'
import ProductCreate from './components/create-product-form-component/CreateProductForm'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<CreateTaskSection />} />
        <Route path="/ProductCreate" element={<ProductCreate />} />
        <Route path="/ProductList" element={<ProductsList />} />
      </Routes>
    </>
  )
}

export default App
