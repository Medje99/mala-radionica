import { baseUrl } from '@/constants/Constants'
import { ITaskResponse } from '@/model/response/ITaskResponse'
import axios from 'axios'

const createTask = async (data: ITaskResponse) => {
  return await axios.post<ITaskResponse[]>(baseUrl + '/tasks', data)
}

// const getAllTasks = async () => {
//   return await axios.get<ITaskResponse[]>(baseUrl + '/tasks') // Adjusted endpoint to plural '/tasks'
// }

const getAllTasks = async () => {
  return await axios.get<ITaskResponse[]>(baseUrl + '/unfinishedTasks') // Adjusted endpoint to plural '/tasks'
}

const getTaskById = async (id: number) => {
  return await axios.get<ITaskResponse>(`${baseUrl}/tasks/${id}`) // Adjusted endpoint to plural '/tasks'
}

const updateTask = async (data: ITaskResponse) => {
  return await axios.put<ITaskResponse>(`${baseUrl}/tasks/${data.id}`, data)
}

const deleteTask = async (id: number) => {
  return await axios.delete(`${baseUrl}/tasks/${id}`)
}

const TaskService = {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
}

export default TaskService
