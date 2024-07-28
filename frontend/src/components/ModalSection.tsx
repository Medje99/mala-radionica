import { useState } from 'react'
import { Button, Modal } from 'antd'
import { CreateTaskForm } from './create-task-form-component/CreateTaskForm'

const ModalSection = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  return (
    <>
      <Button
        type="primary"
        onClick={() => setModalIsOpen(true)}
        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        Dodaj
      </Button>

      <Modal
        title="Izaberi musteriju ili dodaj novu:"
        centered
        open={modalIsOpen}
        onOk={() => setModalIsOpen(false)}
        onCancel={() => setModalIsOpen(false)}
        okText="Continue"
        width={'30%'}
        okButtonProps={{
          type: 'primary',
          className: 'float-left',
        }}
        cancelButtonProps={{
          type: 'default',
        }}
      >
        <CreateTaskForm />
      </Modal>
    </>
  )
}

export default ModalSection
