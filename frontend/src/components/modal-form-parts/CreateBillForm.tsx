import { Form, Input, DatePicker, Switch, InputNumber } from 'antd'
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
    setModalTitle('Task Form - Part 2')
  }, [])

  const [form] = Form.useForm<ITaskResponse>()
  const [isPaid, setIsPaid] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    setAnimating(true)
    const timer = setTimeout(() => setAnimating(false), 300)
    return () => clearTimeout(timer)
  }, [isPaid])

  const onClickHandler = () => {
    form.validateFields().then((values) => {
      const fullData = {
        ...values,
        contact_id: customerContact?.id ?? 0,
      }
      TaskService.createTask(fullData).then((response) => {
        setJob({
          end_date: form.getFieldValue('finished_date'),
          job_id: response.data.id,
        })
      })

      isPaid ? setCurrentPage(currentPage + 1) : setModalIsOpen(false)
    })
  }

  return (
    <Form
      form={form}
      name="task-form"
      layout="vertical"
      className="bg-white p-5 rounded-lg"
    >
      {/* Full Name */}
      <Form.Item label="Selected Customer:">
        <Input disabled={true} placeholder={customerContact?.fullName} />
      </Form.Item>

      {/* Finished Date */}
      <Form.Item
        label="Finished Date"
        name="finished_date"
        rules={[
          { required: true, message: 'Please select the finished date!' },
        ]}
      >
        <DatePicker showNow format="DD/MM/YYYY" />
      </Form.Item>

      {/* Labor Cost */}
      <Form.Item
        label="Labor Cost"
        name="labor_cost"
        rules={[{ required: true, message: 'Please enter the labor cost!' }]}
      >
        <InputNumber prefix="$" style={{ width: '100%' }} min={0} step={0.01} />
      </Form.Item>

      {/* Paid */}
      <Form.Item label="Paid" name="paid" valuePropName="checked">
        <Switch checked={isPaid} onChange={() => setIsPaid(!isPaid)} />
      </Form.Item>

      {/* Products Used */}
      <Form.Item
        label="Products Used"
        name="products_used"
        rules={[{ required: true, message: 'Please list the products used!' }]}
      >
        <Input.TextArea />
      </Form.Item>

      <div className="flex flex-row justify-between mt-5">
        <ActionButton
          onClickHandler={onClickHandler}
          title={isPaid ? 'Complete Payment' : 'Add to Job List'}
          className={`transition-all duration-500 transform ${
            animating ? 'opacity-0 rotate-45' : 'opacity-100 rotate-0'
          }`}
        />
      </div>
    </Form>
  )
}

export default CreateTaskForm
