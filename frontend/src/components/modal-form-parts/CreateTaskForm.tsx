import { Form, Input, DatePicker, Switch } from 'antd'
import { useEffect, useState } from 'react'
import ActionButton from '../CustomButtons/ActionButton'
import { useModalContext } from '@/contexts/ModalContextProvider'
import TaskService from '@/service/TaskService'
import { ITaskResponse } from '@/model/response/ITaskResponse'
import moment from 'moment'

const CreateTaskForm = () => {
  const { currentPage, setCurrentPage, customerContact, setModalTitle, setJob, job, setModalIsOpen } = useModalContext()

  useEffect(() => {
    setModalTitle('Forma 2')
    setJob({
      end_date: form.getFieldValue('end_date'),
    })
  }, [])

  const [form] = Form.useForm<ITaskResponse>()
  const [isFinished, setIsFinished] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    setAnimating(true)
    const timer = setTimeout(() => setAnimating(false), 300)
    return () => clearTimeout(timer)
  }, [isFinished])

  const onClickHandler = () => {
    form.validateFields().then((values) => {
      const fullData = {
        ...values,
        contact_id: customerContact?.id ?? 0,
      }

      TaskService.createTask(fullData).then((response) => {
        console.log('clg forma 2 posle setJob : job.end_date ' + job.end_date)
      })

      isFinished ? setCurrentPage(currentPage + 1) : setModalIsOpen(false)
    })
  }

  return (
    <Form
      form={form}
      name="job-form"
      layout="vertical"
      className="bg-white p-5 rounded-lg"
      initialValues={{
        creation_date: moment(),
        end_date: moment(),
      }}
    >
      {/* Job Name */}
      <Form.Item label="Selected Customer:">
        <Input disabled={true} placeholder={customerContact?.fullName} />
      </Form.Item>

      <Form.Item label="Job Name" name="job_name" rules={[{ required: true, message: 'Please input the job name!' }]}>
        <Input />
      </Form.Item>

      {/* Job Description */}
      <Form.Item
        label="Job Description"
        name="job_description"
        rules={[{ required: false, message: 'Please input the job description!' }]}
      >
        <Input.TextArea />
      </Form.Item>

      {/* Creation Date */}
      <div className="flex flex-row">
        <Form.Item label="Posao primljen:" name="creation_date">
          <DatePicker showNow format="DD/MM/YYYY" className="mr-10" />
        </Form.Item>
        <Form.Item label="End Date">
          <Switch checked={isFinished} onChange={() => setIsFinished(!isFinished)} className="mr-10" />
          {/**/}
        </Form.Item>
        {isFinished && (
          <div>
            <Form.Item
              label="Datum zavrsetka:"
              name="end_date"
              className={`transition-all duration-500 transform ${
                animating ? 'opacity-0 rotate-45' : 'opacity-100 rotate-0'
              }`}
              preserve // bcause not always loaded !
            >
              <DatePicker showNow format="DD/MM/YYYY" />
            </Form.Item>
          </div>
        )}
      </div>
      <div className="flex flex-row justify-between mt-5">
        <ActionButton onClickHandler={() => setCurrentPage(currentPage - 1)} title="Nazad" />
        <ActionButton
          onClickHandler={onClickHandler}
          title={isFinished ? 'Naplata' : 'Dodaj na listu poslova'}
          className={`transition-all duration-500 transform ${
            animating ? 'opacity-0 rotate-45' : 'opacity-100 rotate-0'
          }`}
        />
      </div>
    </Form>
  )
}

export default CreateTaskForm
