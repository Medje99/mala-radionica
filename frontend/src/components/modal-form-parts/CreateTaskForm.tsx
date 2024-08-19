import { Form, Input, DatePicker, Switch } from 'antd'
import { useEffect, useState } from 'react'
import ActionButton from '../CustomButtons/ActionButton'
import { useModalContext } from '@/contexts/ModalContextProvider'
import TaskService from '@/service/TaskService'
import { ITaskResponse } from '@/model/response/ITaskResponse'

const CreateTaskForm = () => {
  const {
    currentPage,
    setCurrentPage,
    customerContact,
    setModalTitle,
    setJob,
    setModalIsOpen,
  } = useModalContext()

  useEffect(() => {
    setModalTitle('Forma 2')
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
        setJob({
          end_date: form.getFieldValue('end_date'),
          job_id: response.data.id,
        })
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
    >
      {/* Job Name */}
      <Form.Item label="Selected Customer:">
        <Input disabled={true} placeholder={customerContact?.fullName} />
      </Form.Item>

      <Form.Item
        label="Job Name"
        name="job_name"
        rules={[{ required: true, message: 'Please input the job name!' }]}
      >
        <Input />
      </Form.Item>

      {/* Job Description */}
      <Form.Item
        label="Job Description"
        name="job_description"
        rules={[
          { required: true, message: 'Please input the job description!' },
        ]}
      >
        <Input.TextArea />
      </Form.Item>

      {/* Creation Date */}
      <div className="flex flex-row">
        <Form.Item
          label="Creation Date"
          name="creation_date"
          rules={[
            { required: true, message: 'Please select the creation date!' },
          ]}
        >
          <DatePicker showNow format="DD/MM/YYYY" className="mr-10" />
        </Form.Item>
        <Form.Item label="End Date">
          <Switch
            checked={isFinished}
            onChange={() => setIsFinished(!isFinished)}
            className="mr-10"
          />
          {/**/}
        </Form.Item>
        {isFinished && (
          <Form.Item
            label="Finish Date"
            name="end_date"
            rules={[
              { required: true, message: 'Please select the creation date!' },
            ]}
            className={`transition-all duration-500 transform ${
              animating ? 'opacity-0 rotate-45' : 'opacity-100 rotate-0'
            }`}
          >
            <DatePicker showNow format="DD/MM/YYYY" />
          </Form.Item>
        )}
      </div>
      <div className="flex flex-row justify-between mt-5">
        <ActionButton
          onClickHandler={() => setCurrentPage(currentPage - 1)}
          title="Nazad"
        />
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
