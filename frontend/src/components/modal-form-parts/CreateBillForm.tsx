/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Switch, InputNumber, Typography, message, DatePicker } from 'antd'
import { useEffect, useState } from 'react'
import ActionButton from '../CustomButtons/ActionButton' // recives function , button title, button class , and aditional styles
import { useGlobalContext } from '@/contexts/GlobalContextProvider'
import ProductsComponent from './test/ProductsComponent'
import useGetAllProducts from '../../CustomHooks/useGetAllProducts'
import BillService from '@/service/BillService'
import { IBillResponse } from '@/model/response/IBillResponse'
import dayjs from 'dayjs'
import moment from 'moment'

const CreateBillForm = () => {
  const { customerContact, job, setFormTitle, setModalIsOpen, setCurrentPage } = useGlobalContext()
  const [FormBillCreate] = Form.useForm<IBillResponse>()
  const [isPaid, setIsPaid] = useState(false)
  const [animating, setAnimating] = useState(false)
  const { allProducts } = useGetAllProducts()

  useEffect(() => {
    setAnimating(true)
    const timer = setTimeout(() => setAnimating(false), 300)
    return () => clearTimeout(timer)
  }, [isPaid])

  useEffect(() => {
    setFormTitle('Naplata: ' + customerContact?.fullName)
    console.log(customerContact?.fullName)
  }),
    [FormBillCreate]

  // form submitAction()
  const submitLogic = () => {
    FormBillCreate.validateFields()
      .then(async (values) => {
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
          job_id: job.task_id ?? 0,
          parts_cost: 20,
          labor_cost: values.labor_cost,
          total_cost: values.labor_cost,
        }

        BillService.createBill(updatedValues)
        message.success('Racun uspesno kreiran !') // Show error message
        setModalIsOpen(false)
        setCurrentPage(0)
      })
      .catch((error) => {
        console.error('Error creating bill:', error)
        message.error('Greška prilikom kreiranja racuna! Kontaktirajte administratora.') // Show error message
      })
  }

  return (
    <Form
      form={FormBillCreate}
      name="task-form"
      layout="vertical"
      className="bg-white p-5 rounded-lg"
      onFinish={submitLogic}
      initialValues={{
        paid: false,
        end_date: job.end_date ? dayjs(job.end_date) : dayjs(moment().toDate()),
        quantity: 1,
      }}
    >
      <Typography className="font-bold text-xl mb-4 text-center">
        {'Naplata za: ' + customerContact?.fullName}
      </Typography>
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
      <ProductsComponent />
      <Form.Item label="Datum placanja:" name="end_date">
        <DatePicker
          showTime={{ minuteStep: 15 }}
          format="MMM-DD HH:mm"
          name="end_date"
          //defaultOpenValue={dayjs(FormBillCreate.getFieldValue('end_date'))}
        />
      </Form.Item>

      <div className="flex flex-row justify-between mt-5">
        <ActionButton
          onClickHandler={submitLogic}
          title={isPaid ? 'Naplata' : 'Dodaj na listu dugova'}
          className={`transition-all duration-500 transform ${
            animating ? 'opacity-0 rotate-45' : 'opacity-100 rotate-0'
          }`}
        />
      </div>
    </Form>
  )
}

export default CreateBillForm
