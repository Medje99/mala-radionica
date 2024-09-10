/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Switch, InputNumber, Typography, message, DatePicker } from 'antd'
import { useEffect, useState } from 'react'
import ActionButton from '../CustomButtons/ActionButton' // recives function , button title, button class , and aditional styles
import BillService from '@/services/BillService'
import { IBillResponse } from '@/model/response/IBillResponse'
import dayjs from 'dayjs'
import moment from 'moment'
import { VerticalRightOutlined } from '@ant-design/icons'
import { useGlobalContext } from '../GlobalContextProvider'
import SelectProductsComponent from '../SelectProductsComponent'

const CreateBillForm = ({ callback }: { callback: () => void }) => {
  // even if optional vscode throws error so we need to pass callback={() => {}} in components that dont have things to pass

  //SelectProductComponent States
  const [rows, setRows] = useState<{ product: any; quantity: number }[]>([])
  const addRow = () => {
    setRows([...rows, { product: null, quantity: 1 }])
  }

  const removeRow = () => {
    if (rows.length > 0) {
      const newRows = [...rows]
      newRows.pop() // Remove the last row
      setRows(newRows)
      console.log(newRows, 'newRows')
      FormBillCreate.setFieldsValue({
        products_used: newRows, // Update Ant Form's field value directly
      })
    }
  }
  //SelectProductRelated States

  const { customerContact, currentTask, setModalIsOpen, setCurrentPage, currentPage } = useGlobalContext()
  const [FormBillCreate] = Form.useForm<IBillResponse>()
  const [isPaid, setIsPaid] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    setAnimating(true)
    const timer = setTimeout(() => setAnimating(false), 300)
    return () => clearTimeout(timer)
  }, [isPaid])

  const submitLogic = () => {
    FormBillCreate.validateFields().then(async (values) => {
      console.log(values, 'values')
      // Ensure quantity and price are numbers
      const updatedProductsUsed = values.products_used?.map((item) => ({
        product_id: item.product?.id,
        name: item.product?.name,
        manufacturer: item.product?.manufacturer,
        quantity: Number(item.quantity),
        price: Number(item.product?.price),
      }))
      console.log(updatedProductsUsed)

      // Calculate the total parts cost
      const parts_cost = updatedProductsUsed?.reduce((acc, item) => acc + item.quantity * item.price, 0)

      // Calculate the total cost (parts cost + labor cost)
      const total_cost = parts_cost + values.labor_cost

      // Prepare the final values to send to the backend
      const updatedValues = {
        ...values,
        products_used: updatedProductsUsed, // Send product details including price
        contact_id: customerContact?.id,
        job_id: currentTask.task_id,
        parts_cost, // Add parts cost
        total_cost, // Add total cost
      }

      // Send the bill data to the backend
      BillService.createBill(updatedValues as IBillResponse)
        .then(() => {
          values.products_used && BillService.productQUpdate(updatedProductsUsed)
          message.success('Bill created successfully!')
          setModalIsOpen(false)
          FormBillCreate.resetFields()
          setCurrentPage(0)

          if (callback) {
            callback()
            console.log('Resetfields')
            FormBillCreate.resetFields() // Close the modal after submission
          }
        })
        .catch((error) => {
          console.error('Error creating bill:', error)
          message.error('Doslo je do greske, kontaktirajte administratora.')
        })
    })
  }

  return (
    <Form
      id="bill-form"
      form={FormBillCreate}
      layout="vertical"
      onFinish={submitLogic}
      initialValues={{
        paid: false,
        end_date: currentTask.end_date ? dayjs(currentTask.end_date) : dayjs(moment().toDate()),
        quantity: 1,
        labor_cost: 0,
      }}
    >
      <Typography className="font-bold text-xl mb-8 text-center">
        {'Naplata za: ' + customerContact?.fullName}
      </Typography>

      <div className="flex justify-center">
        <Form.Item
          className="w-full flex flex-row justify"
          label="Cena usluge"
          name="labor_cost"
          rules={[{ required: true, message: 'Cena usluge je obavezna!' }]}
        >
          <InputNumber
            suffix="RSD"
            style={{ width: '100%' }} // InputNumber now takes full width
            min={0}
            step={100}
            className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </Form.Item>
        <Form.Item
          className="w-1/4 pt-5 flex flex-row justify-between cursor-pointer  "
          label={isPaid ? 'Izmireno' : 'Neizmireno'}
          name="paid"
          valuePropName="checked"
        >
          <Switch checked={isPaid} onChange={() => setIsPaid(!isPaid)} />
        </Form.Item>
      </div>

      <div id="select-products-component">
        <SelectProductsComponent
          form={FormBillCreate} // Pass the form instance here
          rows={rows}
          addRow={addRow}
          removeRow={removeRow}
          setRows={setRows}
        />
      </div>
      <Form.Item label="Datum placanja:" name="end_date" className="mb-4">
        <DatePicker
          showTime={{ minuteStep: 15 }}
          format="MMM-DD HH:mm"
          name="end_date"
          className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </Form.Item>

      <div className="flex">
        <VerticalRightOutlined
          className="ml-10 hover cursor-pointer backB "
          onClick={() => setCurrentPage(currentPage - 1)}
        />
        <ActionButton
          onClickHandler={submitLogic}
          title={isPaid ? 'Naplata' : 'Dodaj na listu dugova'}
          style={{ marginBlock: '10px' }}
          className={`transition-all duration-500 transform  ${
            animating ? 'opacity-0 rotate-45' : 'opacity-100 rotate-0'
          }  rounded-md bg-blue-500 hover:bg-blue-600 `}
        />
      </div>
    </Form>
  )
}

export default CreateBillForm
