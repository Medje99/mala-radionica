import { useEffect, useState } from 'react'
import TaskService from '@/service/TaskService'
import { ITaskResponse } from '@/model/response/ITaskResponse'

const useGetUnfinishedTasks = () => {
  const [UnfinishedOnes, setUnfinishedTasks] = useState<ITaskResponse[]>([])

  useEffect(() => {
    TaskService.getUnfinishedTasks()
      .then((response) => {
        setUnfinishedTasks(response.data)
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error)
      })
  }, [])

  return { UnfinishedOnes }
}

export default useGetUnfinishedTasks
