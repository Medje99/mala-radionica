import { Form, Input, DatePicker, Switch, Space, message, Typography } from 'antd'
import { useEffect, useState } from 'react'
import ActionButton from '../CustomButtons/ActionButton'
import { useGlobalContext } from '../GlobalContextProvider'
import TaskService from '@/service/TaskService'
import { ITaskResponse } from '@/model/response/ITaskResponse'
import moment from 'moment'
import dayjs from 'dayjs'
import { VerticalRightOutlined } from '@ant-design/icons'

const CreateTaskForm = () => {
  const {
    currentPage,
    setCurrentPage,
    customerContact,
    setFormTitle: setFormTitle,
    setCurrentTask,
    setModalIsOpen,
  } = useGlobalContext()

  useEffect(() => {
    setFormTitle('Detalji posla')
  }, [])

  const [TaskForm] = Form.useForm<ITaskResponse>()
  const [isFinished, setIsFinished] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    setAnimating(true)
    const timer = setTimeout(() => setAnimating(false), 300)
    return () => clearTimeout(timer)
  }, [isFinished])

  const onClickHandler = () => {
    TaskForm.validateFields().then((values) => {
      const fullData = {
        ...values,
        contact_id: customerContact?.id ?? 0,
      }

      TaskService.createTask(fullData)
        .then((response) => {
          console.log(fullData, 'data')
          console.log(response, 'response')
          message.success('Posao uspesno kreiran!')
          // Update the job object in the context
          setCurrentTask({
            task_id: response.data.id,
            end_date: values.end_date,
          })
          setCurrentPage(0)
        })
        .then(() => {
          isFinished ? setCurrentPage(currentPage + 1) : setModalIsOpen(false)
        })

        .catch((error) => {
          console.error('Error creating contact:', error)
          message.error('Greška prilikom kreiranja unosa .Kontaktirajte administratora.')
        })
    })
  }

  return (
    <Form
      id="task-form"
      form={TaskForm}
      layout="vertical"
      className="rounded-lg"
      initialValues={{
        creation_date: moment(),
        end_date: moment(),
      }}
    >
      <Typography className="font-bold text-xl mb-12  text-center">
        {'Posao za: ' + customerContact?.fullName}
      </Typography>

      {/* Job Name */}
      <Form.Item label="Naslov posla:" name="job_name" rules={[{ required: true, message: 'Popuni naziv posla!' }]}>
        <Input />
      </Form.Item>

      {/* Job Description */}
      <Form.Item label="Detalji posla:" name="job_description" rules={[{ required: false }]}>
        <Input.TextArea />
      </Form.Item>

      {/* Creation Date */}
      <div className="flex flex-row">
        <Form.Item label="Posao zapocet:" name="creation_date">
          <Space direction="vertical">
            <DatePicker
              id="creation_date"
              showTime={{ minuteStep: 15 }}
              format="MMM-DD HH:mm"
              name="creation_date"
              defaultOpenValue={dayjs(TaskForm.getFieldValue('creation_date'))}
              defaultValue={dayjs(TaskForm.getFieldValue('creation_date'))}
              onChange={(date) => TaskForm.setFieldValue('creation_date', date)}
            />
          </Space>
        </Form.Item>
        <Form.Item label={!isFinished ? 'Posao aktivan' : 'Status:'} className="ml-8">
          <Switch checked={isFinished} onChange={() => setIsFinished(!isFinished)} className="mr-10" />
        </Form.Item>
        {isFinished && (
          <Form.Item label="Zavrsen" name="end_date">
            <Space direction="vertical">
              <DatePicker
                showTime={{ minuteStep: 15 }}
                format="MMM-DD HH:mm"
                name="end_date"
                defaultOpenValue={dayjs(TaskForm.getFieldValue('end_date'))}
                defaultValue={dayjs(TaskForm.getFieldValue('end_date'))}
                onChange={(date) => TaskForm.setFieldValue('end_date', date)}
              />
            </Space>
          </Form.Item>
        )}
      </div>
      <div className="flex flex-row justify-between mt-5">
        <VerticalRightOutlined className="ml-10 backB" onClick={() => setCurrentPage(currentPage - 1)} title="Nazad" />
        <ActionButton
          onClickHandler={onClickHandler}
          title={isFinished ? 'Naplata' : 'Dodaj na listu poslova'}
          className={`transition-all duration-500 transform action-button ${
            animating ? 'opacity-0 rotate-45' : 'opacity-100 rotate-0'
          }`}
        />
      </div>
    </Form>
  )
}

export default CreateTaskForm
