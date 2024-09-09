/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Modal } from 'antd'
import CreateContactForm from '../forms/CreateContactForm'
import { useGlobalContext } from '../GlobalContextProvider'
import CreateTaskForm from '../forms/CreateTaskForm'
import CreateBillForm from '../forms/CreateBillForm'
import { useEffect } from 'react'

export const ModalBody = () => {
  const { modalIsOpen, currentPage, setModalIsOpen, formTitle, setFormTitle, setCurrentPage } = useGlobalContext()

  //must be separate inside of useEffect because it needs to load when currentPage is loaded
  useEffect(() => {
    switch (currentPage) {
      case 0:
        setFormTitle('Izaberi ili dodaj musteriju ')
        break
      case 1:
        setFormTitle('Unesi podatke o poslu')
        break
      case 2:
        setFormTitle('Naplata:')
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

  return modalIsOpen ? (
    <Modal
      title={formTitle}
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
  ) : (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Button
        className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem] "
        type="primary"
        size="large"
        onClick={() => setModalIsOpen(true)}
        ghost
      >
        Kreiraj novi posao
      </Button>
    </div>
  )
}
