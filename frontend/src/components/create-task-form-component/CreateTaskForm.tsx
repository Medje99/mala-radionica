/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal } from 'antd'
import CreateProgress from '../create-task-progress/CreateTaskProgress'
import CreateTaskFormPt2 from '../create-task-form-parts/CreateTaskFormPt2'
import CreateTaskFromPt1 from '../create-task-form-parts/CreateTaskFromPt1'
import CreateTaskFormPt3 from '../create-task-form-parts/CreateTaskFormPt3'
import { useModalContext } from '../../contexts/ModalContextProvider'

export const CreateTaskForm = () => {
  const { modalIsOpen, currentPage, setModalIsOpen, modalTitle } =
    useModalContext()

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

  return (
    <Modal
      title={
        <div style={{ textAlign: 'center', width: '100%' }}>{modalTitle}</div>
      }
      centered
      open={modalIsOpen}
      width={'40%'}
      onCancel={() => setModalIsOpen(false)}
      footer={null}
    >
      {renderFormPart()}
      <CreateProgress currentPage={currentPage} />
    </Modal>
  )
}
