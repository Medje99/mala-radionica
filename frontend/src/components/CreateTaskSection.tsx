import { MultiStepForm } from './MultiStepForm'
import TasksList from './task-list-component/TaskList'

const CreateTaskSection = () => {
  return (
    <main className="  no-vertical-scroll">
      <div className="flex">
        <section className="w-1/3 border-2 border-grey-500 shadow-2xl pt-10 max-h-screen overflow-y-auto ">
          <div className="container w-full md:px-4  space-y-10 md:space-y-16 xl:space-y-16">
            <MultiStepForm />
          </div>
        </section>

        <section className="w-2/3">
          <div className="container w-full mx-auto">
            <TasksList />
          </div>
        </section>
      </div>
    </main>
  )
}

export default CreateTaskSection
