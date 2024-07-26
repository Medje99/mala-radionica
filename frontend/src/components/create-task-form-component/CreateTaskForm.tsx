/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Select, Space } from 'antd'
import { useEffect, useState } from 'react'
import { CustomerSelect } from './types'
import useGetAllContacts from '@/CustomHooks/useGetAllContants'
import createTaskFormActions from './actions'
import { IContacts } from '@/model/response/IContactResponse'

const { Option } = Select

const {
  setCustomerSelectOptions,
  setCustomerFormValues,
  handleSelectChange,
  handleInputChange,
} = createTaskFormActions()

export const CreateTaskForm = () => {
  const { customers } = useGetAllContacts()
  const [form] = Form.useForm<IContacts>()
  const [currentCustomer, setCurrentCustomer] = useState<string | undefined>('')
  const [inputValue, setInputValue] = useState<string>(
    currentCustomer as string
  )
  const [newCustomer, setNewCustomer] = useState(false)

  const [newCustomerSelect, setNewCustomerSelect] = useState<CustomerSelect[]>()

  useEffect(() => {
    setCustomerSelectOptions(customers, setNewCustomerSelect)
  }, [customers])
  useEffect(() => {
    setCustomerFormValues(customers, currentCustomer, form, setNewCustomer)
  }, [currentCustomer, customers, form])

  //Filters options based on inputValue
  const filteredOptions = newCustomerSelect?.filter((option: any) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  )

  return (
    <Form
      form={form}
      name="musterija-form"
      layout="vertical"
      className="bg-white p-5 rounded-lg"
    >
      <Form.Item label="Musterija" required className="mb-4">
        <Space.Compact>
          <Form.Item
            name="musterija"
            noStyle
            rules={[
              { required: true, message: 'Please select or enter a customer' },
            ]}
            className="flex-1"
          >
            {!newCustomer ? (
              <>
                <Input
                  placeholder="Enter new customer"
                  value={inputValue}
                  onChange={() => handleInputChange(inputValue, setInputValue)}
                />
              </>
            ) : (
              <Select
                showSearch
                placeholder="Select or type a customer"
                className="w-full"
                value={currentCustomer}
                onChange={() =>
                  handleSelectChange(
                    currentCustomer,
                    setCurrentCustomer,
                    setInputValue
                  )
                }
                onSearch={setInputValue} // Update inputValue based on search
                filterOption={false} // Disable default filtering
                allowClear
              >
                {filteredOptions?.map((option: any) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
                {filteredOptions?.length === 0 && (
                  <Option value={inputValue}>Add new customer...</Option>
                )}
              </Select>
            )}
          </Form.Item>
        </Space.Compact>
      </Form.Item>
      <Form.Item
        label="Broj telefona"
        name="phoneNumber"
        rules={[
          { required: true, message: 'Please input a phone number' },
          { pattern: /^\d+$/, message: 'Phone number must be numeric' },
        ]}
        className="mb-4 w-1/2"
      >
        <Input disabled={!newCustomer} />
      </Form.Item>

      <Form.Item
        label="City"
        name="city"
        rules={[{ required: true, message: 'Please input a city' }]}
        className="mb-4 w-1/2"
      >
        <Input disabled={!newCustomer} />
      </Form.Item>
      <Form.Item
        label="Address"
        name="address"
        rules={[{ required: true, message: 'Please input an address' }]}
        className="mb-4 w-1/2"
      >
        <Input disabled={!newCustomer} />
      </Form.Item>
      <Form.Item label="Other" name="other" className="mb-4 w-1/2">
        <Input disabled={!newCustomer} />
      </Form.Item>
    </Form>
  )
}
