import { MultiStepForm } from './MultiStepForm'
import TasksList from './task-list-component/TaskList'

const CreateTaskSection = () => {
  return (
    <main className="flex-1 mx-7 ">
      <div className="flex ">
        <section className="w-1/2 pt-12 sm:pt-16 md:pt-24 lg:pt-8">
          <div className="container w-full md:px-6 space-y-10 xl:space-y-16">
            <MultiStepForm />
          </div>
        </section>

        <section className="w-1/2 pt-12 ml-10 sm:pt-16 md:pt-24 lg:pt-8">
          <div className="container w-full md:px-6 space-y-10 xl:space-y-16">
            <TasksList />
          </div>
        </section>
      </div>
    </main>
  )
}

export default CreateTaskSection
