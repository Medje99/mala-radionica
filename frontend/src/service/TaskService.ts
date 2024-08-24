import { baseUrl } from '@/constants/Constants'
import { ITaskResponse } from '@/model/response/ITaskResponse'
import axios from 'axios'

const createTask = async (data: ITaskResponse) => {
  return await axios.post<ITaskResponse>(baseUrl + '/task', data)
}

const getAllTasks = async () => {
  return await axios.get<ITaskResponse[]>(baseUrl + '/tasks') // Adjusted endpoint to plural '/tasks'
}

const getUnfinishedTasks = async () => {
  return await axios.get<ITaskResponse[]>(baseUrl + '/unfinishedTasks') // Adjusted endpoint to plural '/tasks'
}

const getTaskById = async (id: number) => {
  return await axios.get<ITaskResponse>(`${baseUrl}/tasks/${id}`) // Adjusted endpoint to plural '/tasks'
}

const updateTask = async (data: ITaskResponse) => {
  return await axios.put<ITaskResponse>(`${baseUrl}/task/${data.id}`, data)
}

const deleteTask = async (id: number) => {
  return await axios.delete(`${baseUrl}/task/${id}`)
}

const TaskService = {
  getAllTasks,
  getUnfinishedTasks,
  createTask,
  getTaskById, // Added getTaskById method
  updateTask,
  deleteTask,
}

export default TaskService
