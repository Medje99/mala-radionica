/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITaskResponse } from '@/model/response/ITaskResponse'
import TaskService from '@/service/TaskService'
import { FormInstance, message } from 'antd'

const TasksAdvancedActions = () => {
  const handleEdit = (
    record: ITaskResponse,
    setEditingTask: React.Dispatch<React.SetStateAction<ITaskResponse>>,
    form: FormInstance<ITaskResponse>,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
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
    setFilteredTasks: React.Dispatch<React.SetStateAction<ITaskResponse[]>>
  ) => {
    // Implement your delete logic here (e.g., call an API to delete the task)
    message.success('Task deleted successfully')
    TaskService.deleteTask(id)
    setFilteredTasks(filteredTasks.filter((task) => task.id !== id))
  }

  const handleSave = async (
    form: FormInstance<ITaskResponse>,
    editingTask: ITaskResponse | null,
    filteredTasks: ITaskResponse[],
    setFilteredTasks: React.Dispatch<React.SetStateAction<ITaskResponse[]>>,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      const values = await form.validateFields()
      const updatedTask = { ...editingTask, ...values } as ITaskResponse
      TaskService.updateTask(updatedTask)
      message.success('Task updated successfully')
      setFilteredTasks(
        filteredTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      )
      setIsModalOpen(false)
    } catch (error) {
      console.error('Validation failed:', error)
      message.error('Validation failed. Please check your inputs.')
    }
  }

  return { handleEdit, handleDelete, handleSave }
}

export default TasksAdvancedActions
