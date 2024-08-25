import { Button } from 'antd'
import { useGlobalContext } from '../../contexts/GlobalContextProvider'
import { ModalBody } from '../create-task-form-component/ModalBody'

const CreateTaskModalComponent = () => {
  const { setModalIsOpen, modalIsOpen } = useGlobalContext()

  return (
    <div className="mt-8">
      <Button type="primary" onClick={() => setModalIsOpen(true)}>
        Dodaj
      </Button>
      {modalIsOpen && <ModalBody />}
    </div>
  )
}

export default CreateTaskModalComponent
