import { Button } from 'antd'
import { CreateTaskForm } from '../create-task-form-component/CreateTaskForm'
import { useModalContext } from '../../contexts/ModalContextProvider'

const CreateTaskModalComponent = () => {
  const { setModalIsOpen, modalIsOpen } = useModalContext()

  return (
    <div className="mt-6">
      <Button
        type="primary"
        onClick={() => setModalIsOpen(true)}
        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        Dodaj
      </Button>
      {modalIsOpen && <CreateTaskForm />}
    </div>
  )
}

export default CreateTaskModalComponent
