/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Switch, InputNumber, Typography, message, DatePicker,Image } from 'antd'
import { useEffect, useState } from 'react'
import ActionButton from '../../CustomButtons/ActionButton' // recives function , button title, button class , and aditional styles
import BillService from '@/services/BillService'
import { IBillResponse } from '@/model/response/IBillResponse'
import dayjs from 'dayjs'
import moment from 'moment'
import { VerticalRightOutlined } from '@ant-design/icons'
import { useGlobalContext } from '../../GlobalContextProvider'
import SelectProductsComponent from '../../SelectProductsComponent'
import poor_dude from "..//..//../assets/poor_dude.svg";
import money from "..//..//../assets/money.svg";
import heli from "..//..//../assets/heli.svg";






const CreateBillForm = ({ callback }: { callback: () => void }) => {
  //using callback so that tasklist refreshes when some item is billed
  // even if optional vscode throws error so we need to pass callback={() => {}} in components that dont have things to pass

  //SelectProductComponent States lifted here because BillForm instance is in this component and passing it down causes latency in state
  const [rows, setRows] = useState<{ product: any; quantity: number }[]>([]) // we store rows here before giving them to Ant Form why ?
  const addRow = () => {
    setRows([...rows, { product: null, quantity: 1 }])
  }
  const removeRow = () => {
    if (rows.length > 0) {
      // if there are rows at all
      const newRows = [...rows] //put current rows into newRows
      newRows.pop() // Remove the last entry
      setRows(newRows) //set newRows to list without last item
      console.log(newRows, 'newRows') // verify its done correctly
      FormBillCreate.setFieldsValue({
        products_used: newRows, // Update Ant Form's field value to reflect change
      })
    }
  }
  //SelectProductRelated States

  const { Contact, currentTask, setCurrentPage, currentPage } = useGlobalContext() // contact_id, task_id_
  const [FormBillCreate] = Form.useForm<IBillResponse>()
  const [isPaid, setIsPaid] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    setAnimating(true)
    const timer = setTimeout(() => setAnimating(false), 300)
    return () => clearTimeout(timer)
  }, [isPaid]) // Gig nothin more

  const submitLogic = () => {
    // needs refactoring since products are now saved as
    FormBillCreate.validateFields().then(async (values) => {
      // validates fields passes values to processing
      console.log('raw values from ant form: ' + JSON.stringify(values, null, 2), ' raw values')
      // labor_cost, paid, end_date, products_used as array of nested object {{id,name,manufacturer,model,price,quanitity<(total_q),SKU}quantity(to remove)}
      // Ensure quantity and price are numbers
      const billed_product = values.products_used?.map((item) => ({
        // takes billed products
        product_id: item.product?.id,
        name: item.product?.name,
        manufacturer: item.product?.manufacturer,
        quantity: Number(item.quantity),
        price: Number(item.product?.price),
      }))
      console.log('Billed products : ' + JSON.stringify(values, null, 2), ' values')

      // Calculate the total parts cost
      const parts_cost = billed_product?.reduce((acc, item) => acc + item.quantity * item.price, 0)

      // Calculate the total cost (parts cost + labor cost)
      const total_cost = parts_cost + values.labor_cost

      // Prepare the final values to send to the backend
      const updatedValues = {
        ...values,
        products_used: billed_product, // Send product details including price
        contact_id: Contact?.id,
        job_id: currentTask.task_id,
        parts_cost, // Add parts cost
        total_cost, // Add total cost
      }

      // Send the bill data to the backend
      BillService.createBill(updatedValues as IBillResponse)
        .then(() => {
          values.products_used && BillService.productQUpdate(billed_product)
          message.success('Račun je uspješno kreiran!')
          FormBillCreate.resetFields()
          setCurrentPage(0)

          if (callback) {
            callback() // closes modal or does nothing if empty callback passed
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
      id="glowic"
      className='bg-white opacity-90'
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
      <Typography className="font-bold text-xl mb-8 text-center">{'Naplata za: ' + Contact?.fullName}</Typography>

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
      <div className="flex flex-col mt-5 mx-6">
      <div className="flex flex-row justify-between w-full">

      <div 
  onClick={() => setCurrentPage(currentPage - 1)}
  style={{ cursor: "pointer", marginTop: "-10px" }} // Adjust this value as needed
>
  <Image 
    src={heli} 
    className="buto" 
    style={{ 
      transform: "scale(1.8, 1.8)", 
      transformOrigin: "center" 
    }} 
    preview={false} 
  />
</div>
      
   
      <div onClick={submitLogic} style={{ cursor: "pointer" }}>
<Image 
    src={isPaid?money:poor_dude} 
    className="buto" 
    style={{ 
      transform: "scale(1.5, 1.5)", 
      transformOrigin: "center" 
    }} 
    preview={false} 
  />
  
  </div>
      </div>
      </div>
    </Form>
  )
}

export default CreateBillForm
