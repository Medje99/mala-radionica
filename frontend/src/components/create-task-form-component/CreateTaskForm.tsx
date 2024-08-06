/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal } from 'antd'
import CreateProgress from '../create-task-progress/CreateTaskProgress'
import CreateTaskFormPt2 from '../create-task-form-parts/CreateTaskFormPt2'
import { useFormContext } from '../../contexts/FormContextProvider'
import CreateTaskFromPt1 from '../create-task-form-parts/CreateTaskFromPt1'
import { separateFullName } from '@/Utilities/getSeparatedFullName'
import ContactService from '@/service/ContactsService'
import { useModal } from '../../contexts/ModalContextProvider'

export const CreateTaskForm = () => {
  const { newCustomer, form } = useFormContext()
  const { modalIsOpen, setCurrentPage, currentPage, setModalIsOpen } =
    useModal()

  const onHandleSubmit = (event: any) => {
    event.preventDefault()
    form
      .validateFields()
      .then((values: any) => {
        const { firstName } = values
        const separatedName = separateFullName(firstName)

        const formatedData = {
          ...values,
          firstName: separatedName.firstName,
          lastName: separatedName.lastName,
          id: 200,
        }

        ContactService.createContactCustomer(formatedData)
          .then((createdContact) => {
            console.log('Contact created:', createdContact)
          })
          .catch((error) => {
            console.error('Error:', error)
          })
      })
      .catch((errorInfo: any) => {
        console.error('Validation failed:', errorInfo)
      })
  }

  const handleXButtonClick = () => {
    // Custom logic for the "X" button
    setModalIsOpen(false) // Close the modal
  }

  const handleNazadButtonClick = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1) // Go back to the previous page
    } else {
      alert('nema nazad')
    }
  }

  return (
    <Modal
      title={
        <div style={{ textAlign: 'center', width: '100%' }}>
          Izaberi musteriju ili dodaj novu
        </div>
      }
      centered
      open={modalIsOpen}
      onOk={
        newCustomer
          ? () => onHandleSubmit(event)
          : () => setCurrentPage(currentPage + 1)
      }
      onCancel={handleXButtonClick} // Handle the "X" button functionality
      okText={newCustomer ? 'Dodaj' : 'Dalje'}
      width={'30%'}
      okButtonProps={{
        type: 'primary',
        className: 'float-left',
      }}
      cancelButtonProps={{
        type: 'default',
        onClick: handleNazadButtonClick, // Handle the "Nazad" button functionality
      }}
      cancelText={'Nazad'}
    >
      {currentPage === 0 ? <CreateTaskFromPt1 /> : <CreateTaskFormPt2 />}
      <CreateProgress currentPage={currentPage} />
    </Modal>
  )
}
