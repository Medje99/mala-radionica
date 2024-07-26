// import { Link } from 'react-router-dom'
import ModalSection from './ModalSection'

const CreateTaskSection = () => {
  return (
    <main className="flex-1">
      <section className="w-full pt-12 md:pt-24 lg:pt-32 border-y">
        <div className="container px-4 md:px-6 space-y-10 xl:space-y-16">
          <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
            <div>
              <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                Manage Your Tasks with Ease
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Stay organized and on top of your tasks with our powerful task
                management tool.
              </p>
              <div className="mt-6">
                {/* <Link
                  to="/create-task"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Create New Task
                </Link> */}
                <ModalSection />
              </div>
            </div>
            <img
              src="/placeholder.svg"
              width="550"
              height="550"
              alt="Hero"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full lg:order-last lg:aspect-square"
            />
          </div>
        </div>
      </section>
    </main>
  )
}

export default CreateTaskSection
