import Header from './components/Header'
import './index.css'
import HomePage from './components/HomePage'
import { Route, Routes } from 'react-router-dom'
import CreateNewProductFormComponent from './components/forms/create-product-form/createNewProductForm'
import ProductsList from './components/product-list-components/ProductsList'
import ContactsList from './components/contact-list-components/ContactsList'
import TaskList from './components/task-list-components/TaskList'
import BillsList from './components/bills-list-components/BillsList'
import { ContextProvider } from './contexts/GlobalContextProvider'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ProductCreate" element={<CreateNewProductFormComponent />} />
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
