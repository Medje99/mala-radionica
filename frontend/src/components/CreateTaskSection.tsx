import MultiStepForm from './MultiStepForm'
import TasksList from './task-list-component/TaskList'

const CreateTaskSection = () => {
  return (
    <main className="flex xl:flex-row flex-col h-h-[calc(100vh-10rem)]">
      <section className="w-4/12 xl:p-10 lg:p-5 overflow-y-auto max-h-[calc(100vh-4rem)]">
        <MultiStepForm />
      </section>

      <section className="w-8/12">
        <TasksList />
      </section>
    </main>
  )
}

export default CreateTaskSection
