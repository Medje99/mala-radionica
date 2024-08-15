/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Modal } from 'antd'
import CreateProgress from '../create-task-progress/CreateTaskProgress'
import CreateTaskFormPt2 from '../create-task-form-parts/CreateTaskFormPt2'
import CreateTaskFromPt1 from '../create-task-form-parts/CreateTaskFromPt1'
import { useModal } from '../../contexts/ModalContextProvider'
import { createContext, useState } from 'react'

export const FormContext = createContext<any | null>(null)

export const CreateTaskForm = () => {
  const [customerContact, setCustomerContact] = useState<any>()

  const { modalIsOpen, setCurrentPage, currentPage, setModalIsOpen } =
    useModal()
  const onHandleSubmit = (event: any) => {
    // event.preventDefault()
    // form
    //   .validateFields()
    //   .then((values: any) => {
    //     const { firstName } = values
    //     const separatedName = separateFullName(firstName)
    //     const formatedData = {
    //       ...values,
    //       firstName: separatedName.firstName,
    //       lastName: separatedName.lastName,
    //       id: 200,
    //     }
    //     ContactService.createContactCustomer(formatedData)
    //       .then((createdContact) => {
    //         console.log('Contact created:', createdContact)
    //       })
    //       .catch((error) => {
    //         console.error('Error:', error)
    //       })
    //   })
    //   .catch((errorInfo: any) => {
    //     console.error('Validation failed:', errorInfo)
    //   })
    console.log(customerContact, 'IN CREATE TASK FORM')
    console.log('change')
  }

  return (
    <FormContext.Provider value={{ customerContact, setCustomerContact }}>
      <Modal
        title={
          <div style={{ textAlign: 'center', width: '100%' }}>
            Izaberi musteriju ili dodaj novu
          </div>
        }
        centered
        open={modalIsOpen}
        okText={!customerContact ? 'Dodaj' : 'Dalje'}
        width={'30%'}
        onCancel={() => setModalIsOpen(false)}
        footer={[
          !customerContact && (
            <Button
              key="custom"
              onClick={() => {
                onHandleSubmit(event)
                setModalIsOpen(false)
              }}
              style={{ float: 'left' }}
            >
              Dodaj kontakt i zatvori
            </Button>
          ),
          currentPage !== 0 && (
            <Button
              key="custom"
              onClick={() => setCurrentPage(currentPage + -1)}
            >
              Nazad
            </Button>
          ),
          <Button
            key="submit"
            type="primary"
            onClick={
              !customerContact
                ? () => onHandleSubmit(event)
                : () => setCurrentPage(currentPage + 1)
            }
          >
            {!customerContact ? 'Dodaj i dalje' : 'Dalje'}
          </Button>,
        ]}
      >
        {currentPage === 0 ? <CreateTaskFromPt1 /> : <CreateTaskFormPt2 />}
        <CreateProgress currentPage={currentPage} />
      </Modal>
    </FormContext.Provider>
  )
}
