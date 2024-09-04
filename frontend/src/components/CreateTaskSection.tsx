import { MultiStepForm } from './MultiStepForm'
import TasksList from './task-list-component/TaskList'

const CreateTaskSection = () => {
  return (
    <main className="flex flex-row justify-center">
      <section className="w-4/12 pr-24 pt-10">
        <div className="col-span-2">
          <MultiStepForm />
        </div>
      </section>

      <section className="w-7/12 pt-10">
        <TasksList />
      </section>
    </main>
  )
}

export default CreateTaskSection
