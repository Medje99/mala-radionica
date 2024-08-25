/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal } from 'antd'
import CreateContactForm from '../modal-form-parts/CreateContactForm'
import { useGlobalContext } from '../../contexts/GlobalContextProvider'
import CreateTaskForm from '../modal-form-parts/CreateTaskForm'
import CreateBillForm from '../modal-form-parts/CreateBillForm'
import { useEffect } from 'react'

export const ModalBody = () => {
  const { modalIsOpen, currentPage, setModalIsOpen, modalTitle, setModalTitle, setCurrentPage } = useGlobalContext()

  //must be separate inside of useEffect because it needs to load when currentPage is loaded
  useEffect(() => {
    switch (currentPage) {
      case 0:
        setModalTitle('Izaberi ili dodaj musteriju ')
        break
      case 1:
        setModalTitle('Unesi podatke o poslu')
        break
      case 2:
        setModalTitle('Naplata:')
        break
      default:
        break
    }
  }, [currentPage]) // Add currentPage as a dependency

  const renderFormPart = () => {
    switch (currentPage) {
      case 0:
        return <CreateContactForm />
      case 1:
        return <CreateTaskForm />
      case 2:
        return <CreateBillForm />
      default:
        return null
    }
  }

  return (
    <Modal
      title={<div className="modal-title">{modalTitle}</div>}
      centered
      open={modalIsOpen}
      width={'400px'}
      onCancel={() => {
        setCurrentPage(0)
        setModalIsOpen(false)
      }}
      footer={null}
    >
      {renderFormPart()}
    </Modal>
  )
}
