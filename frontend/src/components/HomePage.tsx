import MultiStepForm from './MultiStepForm'
import TasksList from './tables/task-table-components/TaskList'
import SellItemForm from './forms/sell-item-form/SellItemForm'

const HomePage = () => {
  return (
    <main className="flex xl:flex-row flex-col ">
      <section className="lg:w-2/6 lg:p-5 overflow-y-auto p-5  ">
        <MultiStepForm />
        {/* <SellItemForm /> */}
      </section>
      <section className="lg:w-4/6 lg:block hidden  w-2/3  ">
        <TasksList />
      </section>
    </main>
  )
}

export default HomePage
