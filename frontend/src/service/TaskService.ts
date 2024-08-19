import { baseUrl } from '@/constants/Constants'
import { ITaskResponse } from '@/model/response/ITaskResponse'
import axios from 'axios'

const createTask = async (data: any) => {
  return await axios.post<ITaskResponse[]>(baseUrl + '/task', data)
}

const TaskService = {
  createTask,
}

export default TaskService
