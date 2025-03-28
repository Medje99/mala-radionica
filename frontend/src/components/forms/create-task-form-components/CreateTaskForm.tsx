import { Form, Input, DatePicker, Switch, Space, message, Typography, Col,Image } from 'antd'
import { useEffect, useState } from 'react'
import ActionButton from '../../CustomButtons/ActionButton'
import { useGlobalContext } from '../../GlobalContextProvider'
import TaskService from '@/services/TaskService'
import { ITaskResponse } from '@/model/response/ITaskResponse'
import dayjs from 'dayjs'
import { creation_date } from '@/components/tables/task-table-components/constants'
import { endDate } from '@/components/tables/bills-table-components/contants'
import { LeftOutlined } from '@ant-design/icons'
import heli from "..//..//../assets/heli.svg";
import book from "..//..//../assets/book.svg";
import money from "..//..//../assets/money.svg";


const CreateTaskForm = () => {
  const {
    currentPage,
    setCurrentPage,
    Contact,
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
        contact_id: Contact?.id ?? 0,
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
      id="glowic"
      form={TaskForm}
      layout="vertical"
      className="bg-white opacity-90"
      initialValues={{ creation_date: dayjs(Date.now()), end_date: dayjs(Date.now()) }}
    >
      <div className="flex flex-row justify-between mt-5" />
      <Typography className="font-bold text-xl mb-12  text-center">{'Posao za: ' + Contact?.fullName}</Typography>

      {/* Job Name */}
      <Form.Item label="Naslov posla:" name="job_name" rules={[{ required: false, message: 'Popuni naziv posla!' }]}>
        <Input />
      </Form.Item>

      {/* Job Description */}
      <Form.Item label="Detalji posla:" name="job_description" rules={[{ required: false }]}>
        <Input.TextArea />
      </Form.Item>

      {/* Creation Date */}
      <div className="flex flex-row">
        <Col span={8}>
          <Form.Item label="Zapocet:" name="creation_date" className="mt-5">
            <Space direction="vertical">
              <DatePicker
                id="creation_date"
                showTime={{ minuteStep: 15 }}
                format="MMM-DD HH:mm"
                defaultValue={dayjs(TaskForm.getFieldValue('creation_date'))}
                onChange={(date) => TaskForm.setFieldValue('creation_date', date)}
              />
            </Space>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={!isFinished ? 'Aktivan' : 'Status:'} className="ml-6 mt-5">
            <Switch checked={isFinished} onChange={() => setIsFinished(!isFinished)} className="mr-10" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Zavrsen" name="end_date" className="mt-5">
            <DatePicker
              showTime={{ minuteStep: 15 }}
              format="MMM-DD HH:mm"
              defaultOpenValue={dayjs(TaskForm.getFieldValue('end_date'))}
              defaultValue={dayjs(TaskForm.getFieldValue('end_date'))}
              onChange={(date) => TaskForm.setFieldValue('end_date', date)}
              disabled={!isFinished} // Disable when not finished
              hidden={!isFinished} // Optionally hide when not finished
            />
          </Form.Item>
        </Col>
      </div>
      <div className="flex flex-row justify-between mt-5">
        {/* <LeftOutlined className="ml-10 backB" title="Nazad" /> */}
        <div 
 onClick={() => setCurrentPage(currentPage - 1)} 
  style={{ cursor: "pointer", marginTop: "-10px" }} // Adjust this value as needed
>
  <Image 
    src={heli} 
    className="buto" 
    style={{ 
      transform: "scale(1.5, 1.5)", 
      transformOrigin: "center" 
    }} 
    preview={false} 
  />
</div>

<div onClick={onClickHandler} style={{ cursor: "pointer" }}>
<Image 
    src={isFinished ? money : book} 
    className="buto" 
    style={{ 
      transform: "scale(1.5, 1.5)", 
      transformOrigin: "center" 
    }} 
    preview={false} 
  />
  
  </div>
  </div>

    </Form>
  )
}

export default CreateTaskForm
