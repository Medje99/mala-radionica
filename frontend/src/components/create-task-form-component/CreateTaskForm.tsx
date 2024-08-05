/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal } from 'antd'

import CreateProgress from '../create-task-progress/CreateTaskProgress'
import CreateTaskFormPt2 from '../create-task-form-parts/CreateTaskFormPt2'
import { useFormContext } from './CreateAPI'
import CreateTaskFromPt1 from '../create-task-form-parts/CreateTaskFromPt1'

export const CreateTaskForm = () => {
  const {
    newCustomer,

    modalIsOpen,
    onHandleSubmit,
    setCurrentPage,
    currentPage,
    setModalIsOpen,
  } = useFormContext()

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
      onCancel={() => setModalIsOpen(false)}
      okText={newCustomer ? 'Dodaj' : 'Izaberi'}
      width={'30%'}
      okButtonProps={{
        type: 'primary',
        className: 'float-left',
      }}
      cancelButtonProps={{
        type: 'default',
      }}
    >
      {currentPage === 0 ? <CreateTaskFromPt1 /> : <CreateTaskFormPt2 />}
      <CreateProgress currentPage={currentPage} />
    </Modal>
  )
}
