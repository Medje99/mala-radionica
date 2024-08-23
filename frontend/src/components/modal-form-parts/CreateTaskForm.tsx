import { Form, Input, DatePicker, Switch, Space } from 'antd'
import { useEffect, useState } from 'react'
import ActionButton from '../CustomButtons/ActionButton'
import { useModalContext } from '@/contexts/ModalContextProvider'
import TaskService from '@/service/TaskService'
import { ITaskResponse } from '@/model/response/ITaskResponse'
import moment from 'moment'

//Date/timepiceker logic

//Date/timepicker logic

const CreateTaskForm = () => {
  const { currentPage, setCurrentPage, customerContact, setModalTitle, setJob, setModalIsOpen } = useModalContext()

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

  useEffect(() => {
    // Set initial values for creation_date and end_date in form state
    console.log('creaton date and end date values set')
    form.setFieldsValue({
      creation_date: moment(),
      end_date: moment(),
    })
  }, []) // Add form as a dependency

  const onClickHandler = () => {
    form.validateFields().then((values) => {
      const { end_date, ...restValues } = values

      const fullData = {
        ...restValues,
        contact_id: customerContact?.id ?? 0,
      }

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
        <Form.Item
          label={`Posao primljen : ${form?.getFieldValue('creation_date')?.format('MMM-DD HH:mm')}`}
          name="creation_date"
        >
          <div>
            <Space direction="vertical">
              <DatePicker
                showTime={{ minuteStep: 15 }}
                format="MMM-DD HH:mm"
                onChange={(date) => form.setFieldsValue({ creation_date: date })}
                value={form.getFieldValue('creation_date')}
              />
            </Space>
          </div>
        </Form.Item>
        <Form.Item label="End Date" name="end_date">
          <Switch checked={isFinished} onChange={() => setIsFinished(!isFinished)} className="mr-10" />
        </Form.Item>
        {isFinished && (
          <Form.Item
            label={`Zavrsetak posla : ${form.getFieldValue('creation_date')?.format('MMM-DD HH:mm')}`}
            name="creation_date"
          >
            <div>
              <Space direction="vertical">
                <DatePicker
                  showTime={{ minuteStep: 15 }}
                  format="MMM-DD HH:mm"
                  onChange={(date) => form.setFieldsValue({ creation_date: date })}
                />
              </Space>
            </div>
          </Form.Item>
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
