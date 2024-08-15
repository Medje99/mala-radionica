import { ModalProvider } from '../contexts/ModalContextProvider'
import CreateTaskModalComponent from './create-task-modal-component/CreateTaskModal'

const CreateTaskSection = () => {
  return (
    <ModalProvider>
      <main className="flex-1">
        <section className="w-full pt-12 md:pt-24 lg:pt-32 border-y">
          <div className="container px-4 md:px-6 space-y-10 xl:space-y-16">
            <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
              <div>
                <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  Dodaj novi posao
                </h1>
                <CreateTaskModalComponent />
              </div>
            </div>
          </div>
        </section>
      </main>
    </ModalProvider>
  )
}

export default CreateTaskSection
