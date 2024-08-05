import { FormProvider } from './create-task-form-component/CreateAPI'
import TestComponent from './Test/TestComponent'

const CreateTaskSection = () => {
  return (
    <FormProvider>
      <main className="flex-1">
        <section className="w-full pt-12 md:pt-24 lg:pt-32 border-y">
          <div className="container px-4 md:px-6 space-y-10 xl:space-y-16">
            <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
              <div>
                <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  Dodaj novi posao
                </h1>
                <TestComponent />
              </div>
            </div>
          </div>
        </section>
      </main>
    </FormProvider>
  )
}

export default CreateTaskSection
