import MultiStepForm from './MultiStepForm'
import TasksList from './tables/task-table-components/TaskList'

const HomePage = () => {
  return (
    <main className="flex xl:flex-row flex-col ">
      <section className="w-1/4 xl:p-10  lg:p-5 overflow-y-auto  ">
        <MultiStepForm />
      </section>

      <section className="w-3/4 ">
        <TasksList />
      </section>
    </main>
  )
}

export default HomePage
