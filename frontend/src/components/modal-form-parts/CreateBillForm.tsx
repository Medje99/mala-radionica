/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, DatePicker, Switch, InputNumber, Typography } from 'antd'
import { useEffect, useState } from 'react'
import ActionButton from '../CustomButtons/ActionButton'
import { useModalContext } from '@/contexts/ModalContextProvider'
import TaskService from '@/service/TaskService'
import { ITaskResponse } from '@/model/response/ITaskResponse'
import Hybrid from './test/hybrid'
import ProductsService from '@/service/ProductsService'
import useGetAllProducts from '../../CustomHooks/useGetAllProducts'
import { end_date } from '../task-list-component/constants'

const CreateTaskForm = () => {
  const { customerContact, setModalTitle, setJob, job } = useModalContext()

  useEffect(() => {
    setModalTitle('Billing Form')
    console.log('form pt3 clg' + job.end_date)
  }, [])

  const [form] = Form.useForm<ITaskResponse>()
  const [isPaid, setIsPaid] = useState(false)
  const [animating, setAnimating] = useState(false)
  const { allProducts } = useGetAllProducts()

  useEffect(() => {
    setAnimating(true)
    const timer = setTimeout(() => setAnimating(false), 300)
    return () => clearTimeout(timer)
  }, [isPaid])

  // products used from hybrid child component with name prop
  const onClickHandler = () => {
    form.validateFields().then((values) => {
      const updatedProductsUsed = values.products_used?.map((item) => {
        const productName = allProducts.find((p) => p.id === item.product)?.name
        return {
          ...item,
          name: productName,
        }
      })

      const updatedValues = {
        ...values,
        products_used: updatedProductsUsed,
        contact_id: customerContact?.id ?? 0,
      }

      //prob should be in useEffect bcs it's async
      // This will now log the product name correctly
      TaskService.createTask(updatedValues).then((response) => {
        // this first
        setJob({
          end_date: form.getFieldValue('end_date'),
          job_id: response.data.id,
        })
      })
    })
  }
  // onClick Handler closed

  return (
    <Form
      form={form}
      name="task-form"
      layout="vertical"
      className="bg-white p-5 rounded-lg"
      onFinish={onClickHandler}
      initialValues={{ end_date: job.end_date }}
      // good
    >
      {/* Full Name */}
      <Form.Item label="Izabrana musterija:">
        <Input disabled={true} placeholder={customerContact?.fullName} />
      </Form.Item>

      {/* endDate */}
      <Form.Item
        label="Datum zavrsetka posla"
        name="end_date"
        rules={[{ required: true, message: 'Please select the end date!' }]}
      >
        <DatePicker showNow format="DD/MM/YYYY" />
      </Form.Item>

      {/* Labor Cost */}
      <Form.Item
        label="Cena usluge"
        name="labor_cost"
        rules={[{ required: true, message: 'Cena usluge je obavezna!' }]}
      >
        <InputNumber suffix="RSD" style={{ width: '100%' }} min={0} step={1} />
      </Form.Item>

      {/* Paid */}

      <Form.Item label={isPaid ? 'Izmireno' : 'Neizmireno'} name="paid" valuePropName="checked">
        <Switch checked={isPaid} onChange={() => setIsPaid(!isPaid)} />
      </Form.Item>
      <Typography>Iskoristeni proizvodi:</Typography>
      <Hybrid />

      <div className="flex flex-row justify-between mt-5">
        <ActionButton
          onClickHandler={onClickHandler}
          title={isPaid ? 'Naplata' : 'Dodaj na listu dugova'}
          className={`transition-all duration-500 transform ${
            animating ? 'opacity-0 rotate-45' : 'opacity-100 rotate-0'
          }`}
        />
      </div>
    </Form>
  )
}

export default CreateTaskForm
