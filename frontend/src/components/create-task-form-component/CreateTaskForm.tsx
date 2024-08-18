/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal } from 'antd'
import CreateProgress from '../create-task-progress/CreateTaskProgress'
import CreateTaskFormPt2 from '../create-task-form-parts/CreateTaskFormPt2'
import CreateTaskFromPt1 from '../create-task-form-parts/CreateTaskFromPt1'
import CreateTaskFormPt3 from '../create-task-form-parts/CreateTaskFormPt3'
import { useModal } from '../../contexts/ModalContextProvider'
import { createContext, useState } from 'react'

interface ICustomerContact {
  id: number
  fullName: string
}

export const FormContext = createContext<any | null>(null)

export const CreateTaskForm = () => {
  const [customerContact, setCustomerContact] = useState<ICustomerContact>()

  const { modalIsOpen, currentPage, setModalIsOpen } = useModal()
  const [modalTitle, setModalTitle] = useState()
  const renderFormPart = () => {
    switch (currentPage) {
      case 0:
        return <CreateTaskFromPt1 />
      case 1:
        return <CreateTaskFormPt2 />
      case 2:
        return <CreateTaskFormPt3 />
      default:
        return null
    }
  }

  const x = (
    <div style={{ textAlign: 'center', width: '100%' }}>{modalTitle}</div>
  )

  return (
    <FormContext.Provider
      value={{ customerContact, setCustomerContact, setModalTitle }}
    >
      <Modal
        title={x}
        centered
        open={modalIsOpen}
        width={'30%'}
        onCancel={() => setModalIsOpen(false)}
        footer={null}
      >
        {renderFormPart()}
        <CreateProgress currentPage={currentPage} />
      </Modal>
    </FormContext.Provider>
  )
}
