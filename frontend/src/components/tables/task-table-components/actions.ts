/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGlobalContext } from '@/components/GlobalContextProvider'
import { ITaskResponse } from '@/model/response/ITaskResponse'
import TaskService from '@/services/TaskService'
import { FormInstance, message } from 'antd'
import { useState, useEffect } from 'react'

const useGetAllTasks = () => {
  const [tasks, setTasks] = useState<ITaskResponse[]>([])
  const { currentPage } = useGlobalContext()
  //refreshes TaskList if current page changes
  useEffect(() => {
    TaskService.getAllTasks()
      .then((response) => {
        setTasks(response.data)
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error)
      })
  }, [currentPage]) // when this changes

  return { tasks }
}

const handleEdit = (
  record: ITaskResponse,
  setEditingTask: React.Dispatch<React.SetStateAction<ITaskResponse>>,
  form: FormInstance<ITaskResponse>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setEditingTask({ ...record })
  form.setFieldsValue({
    ...record,
  })
  setIsModalOpen(true)
}

const handleDelete = (
  id: number,
  filteredTasks: ITaskResponse[],
  setFilteredTasks: React.Dispatch<React.SetStateAction<ITaskResponse[]>>,
) => {
  TaskService.deleteTask(id)
    .then(() => {
      message.success('Posao uspesno obrisan!')
      setFilteredTasks(filteredTasks.filter((task) => task.id !== id))
    })
    .catch((error) => {
      console.error('Error deleting task:', error)
      message.error('Greška prilikom brisanja posla.')
    })
}

const handleSave = async (
  form: FormInstance<ITaskResponse>,
  editingTask: ITaskResponse | null,
  filteredTasks: ITaskResponse[],
  setFilteredTasks: React.Dispatch<React.SetStateAction<ITaskResponse[]>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    const values = await form.validateFields()
    const updatedTask = { ...editingTask, ...values } as ITaskResponse

    TaskService.updateTask(updatedTask)
      .then(() => {
        message.success('Posao uspesno izmenjen!')
        setFilteredTasks(filteredTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
        form.resetFields()
        setIsModalOpen(false)
      })
      .catch((error) => {
        console.error('Error updating task:', error)
        message.error('Greška prilikom ažuriranja posla.')
      })
  } catch (error) {
    console.error('Validation failed:', error)
    message.error('Validacija nije uspesna, popunite sva polja i pokusajte ponovo.')
  }
}

export { useGetAllTasks, handleEdit, handleDelete, handleSave }
