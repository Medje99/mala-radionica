import { useEffect, useState } from 'react'
import TaskService from '@/service/TaskService'
import { ITaskResponse } from '@/model/response/ITaskResponse'

const useGetAllTasks = () => {
  const [allTasks, setAllTasks] = useState<ITaskResponse[]>([])

  useEffect(() => {
    TaskService.getAllTasks()
      .then((response) => {
        setAllTasks(response.data)
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error)
      })
  }, [])

  return { allTasks }
}

export default useGetAllTasks
