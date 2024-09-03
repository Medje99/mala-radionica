import { useEffect, useState } from 'react'
import TaskService from '@/service/TaskService'
import { ITaskResponse } from '@/model/response/ITaskResponse'
import { useGlobalContext } from '@/contexts/GlobalContextProvider'

const useGetUnfinishedTasks = () => {
  const [UnfinishedOnes, setUnfinishedTasks] = useState<ITaskResponse[]>([])
  const { currentTask, modalIsOpen } = useGlobalContext()

  useEffect(() => {
    TaskService.getUnfinishedTasks()
      .then((response) => {
        setUnfinishedTasks(response.data)
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error)
      })
  }, [currentTask, modalIsOpen])

  return { UnfinishedOnes }
}

export default useGetUnfinishedTasks
