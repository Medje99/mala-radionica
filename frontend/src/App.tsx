import Header from './components/Header'
import './index.css'
import CreateTaskSection from './components/CreateTaskSection'
import { Route, Routes } from 'react-router-dom'
import ProductCreate from './components/create-product-form-component/CreateProductForm'
import ProductsList from './components/product-list-component/ProductsList'
import ContactsList from './components/contact-list-component/ContactsList'
import TaskList from './components/task-list-component/TaskList'
import BillsList from './components/bills-list-component/BillsList'
import { useEffect } from 'react'
import { useGlobalContext, ContextProvider } from './contexts/GlobalContextProvider'

function App() {
  const { setHeaderTitle } = useGlobalContext()
  useEffect(() => {
    setHeaderTitle('Pocetna')
  }, [])
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<CreateTaskSection />} />
        <Route path="/ProductCreate" element={<ProductCreate />} />
        <Route path="/ProductList" element={<ProductsList />} />
        <Route path="/ContactsList" element={<ContactsList />} />
        <Route path="/Tasks" element={<TaskList />} />
        <Route path="/Bills" element={<BillsList />} />
      </Routes>
    </>
  )
}

export default () => (
  <ContextProvider>
    <App />
  </ContextProvider>
)
