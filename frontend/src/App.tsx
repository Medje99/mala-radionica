import Header from '../src/components/Header'
import './index.css'
import HomePage from './components/HomePage'
import { Route, Routes } from 'react-router-dom'
import CreateNewProductFormComponent from './components/forms/create-product-form/createNewProductForm'
import ProductsList from './components/tables/products-table-components/ProductsList'
import ContactsList from './components/tables/contacts-table-components/ContactsList'
import TaskList from '../src/components/tables/task-table-components/TaskList'
import BillsList from '../src/components/tables/bills-table-components/BillsList'
import Footer from './components/footer'
import { ContextProvider } from '../src/components/GlobalContextProvider'
import MultiStepForm from './components/MultiStepForm'

function App() {
  return (
    <div className="flex flex-col bg-gradient-to-r from-teal-400 to-gray-800 min-h-screen">
      {/* Main content area */}

      <div className="flex flex-row flex-1">
        {/* Left Section */}
        <div className="flex justify-start">
          <MultiStepForm  />
        </div>

        {/* Right Section */}
        <div className="flex flex-col flex-1">
        <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ProductCreate" element={<CreateNewProductFormComponent />} />
            <Route path="/ProductList" element={<ProductsList />} />
            <Route path="/ContactsList" element={<ContactsList />} />
            <Route path="/Tasks" element={<TaskList />} />
            <Route path="/Bills" element={<BillsList />} />
          </Routes>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default () => (
  <ContextProvider>
    <App />
  </ContextProvider>
);
