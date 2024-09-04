import { MultiStepForm } from './MultiStepForm'
import TasksList from './task-list-component/TaskList'

const CreateTaskSection = () => {
  return (
    <main className=" flex flex-row">
      <section className="msf">
        <div className="container w-full md:px-4  space-y-10 md:space-y-16 xl:space-y-16">
          <MultiStepForm />
        </div>
      </section>

      <section className="flex ctst">
        <TasksList />
      </section>
    </main>
  )
}

export default CreateTaskSection
