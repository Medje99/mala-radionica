import { MultiStepForm } from './MultiStepForm'

const CreateTaskSection = () => {
  return (
    <main className="flex-1">
      <section className="w-full pt-12 md:pt-24 lg:pt-32 border-y">
        <div className="grid max-w-[600px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:gap-16">
          <MultiStepForm />
          {/* <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                 <ModalBody />
                </h1> */}
        </div>
        <div className="container px-4 md:px-6 space-y-10 xl:space-y-16 ml-auto bg-black"></div>
      </section>
    </main>
  )
}

export default CreateTaskSection
