import { Form, Input, DatePicker, Switch, Space } from 'antd'
import { useEffect, useState } from 'react'
import ActionButton from '../CustomButtons/ActionButton'
import { useModalContext } from '@/contexts/ModalContextProvider'
import TaskService from '@/service/TaskService'
import { ITaskResponse } from '@/model/response/ITaskResponse'
import moment from 'moment'
import dayjs from 'dayjs'

const CreateTaskForm = () => {
  const { currentPage, setCurrentPage, customerContact, setModalTitle, setJob, setModalIsOpen } = useModalContext()

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

  // useEffect(() => {
  //   // Set initial values for creation_date and end_date in form state
  //   console.log('creaton date and end date values set')
  //   form.setFieldsValue({
  //     creation_date: dayjs(moment().toDate()),
  //     end_date: dayjs(moment().toDate()),
  //   })
  // }, []) // Add form as a dependency

  const onClickHandler = () => {
    form.validateFields().then((values) => {
      const fullData = {
        ...values,
        contact_id: customerContact?.id ?? 0,
      }

      TaskService.createTask(fullData).then((response) => {
        // Update the job object in the context
        setJob({
          task_id: response.data.id,
          end_date: values.end_date,
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
      initialValues={{
        creation_date: moment(),
        end_date: moment(),
      }}
    >
      {/* Job Name */}
      <Form.Item label="Odabrana musterija:">
        <Input disabled={true} placeholder={customerContact?.fullName} />
      </Form.Item>

      <Form.Item
        label="Naslov posla:"
        name="job_name"
        rules={[{ required: true, message: 'Please input the job name!' }]}
      >
        <Input />
      </Form.Item>

      {/* Job Description */}
      <Form.Item
        label="Detalji posla:"
        name="job_description"
        rules={[{ required: false, message: 'Please input the job description!' }]}
      >
        <Input.TextArea />
      </Form.Item>

      {/* Creation Date */}
      <div className="flex flex-row">
        <Form.Item label="Posao zapocet:" name="creation_date">
          <Space direction="vertical">
            <DatePicker
              showTime={{ minuteStep: 15 }}
              format="MMM-DD HH:mm"
              name="creation_date"
              defaultOpenValue={dayjs(moment().toDate())}
              defaultValue={dayjs(moment().toDate())}
            />
          </Space>
        </Form.Item>
        <Form.Item label={!isFinished && 'Posao zavrsen:'} style={{ marginLeft: '30px' }}>
          <Switch checked={isFinished} onChange={() => setIsFinished(!isFinished)} className="mr-10" />
        </Form.Item>
        {isFinished && (
          <Form.Item label="Posao zavrsen:" name="end_date">
            <Space direction="vertical">
              <DatePicker
                showTime={{ minuteStep: 15 }}
                format="MMM-DD HH:mm"
                name="end_date"
                defaultOpenValue={dayjs(moment().toDate())}
                defaultValue={dayjs(moment().toDate())}
              />
            </Space>
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
