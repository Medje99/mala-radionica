/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Select, Space } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useFormContext } from '../../contexts/FormContextProvider'

import createTaskFormActions from '../create-task-form-component/actions'
import { useEffect, useState } from 'react'

const { Option } = Select

const {
  setCustomerSelectOptions,
  setCustomerFormValues,
  handleInputChange,
  handleSelectChange,
} = createTaskFormActions()

const CreateTaskFromPt1 = () => {
  const [newCustomer, setNewCustomer] = useState(false)

  const {
    form,
    customers,
    inputValue,
    pickedCustomer,
    filteredOptions,
    currentCustomer,
    setCurrentCustomer,
    setNewCustomerSelect,
    setInputValue,
  } = useFormContext()

  useEffect(() => {
    setCustomerSelectOptions(customers, setNewCustomerSelect)
  }, [customers, setNewCustomerSelect])

  useEffect(() => {
    setCustomerFormValues(pickedCustomer, form, setNewCustomer)
  }, [pickedCustomer, form])

  return (
    <Form
      form={form}
      name="musterija-form"
      layout="vertical"
      className="bg-white p-5 rounded-lg"
      initialValues={form.getFieldsValue}
    >
      <Form.Item label="Musterija" required className="mb-4 mr-10 ml-10">
        <Space.Compact
          style={{ width: '100%' }} // Ensure the Space.Compact wrapper takes full width
        >
          <Form.Item
            name="firstName"
            noStyle
            rules={[{ required: true, message: 'Izaberi ili dodaj' }]}
            className="flex-1"
          >
            {newCustomer && pickedCustomer ? (
              <Input
                value={inputValue}
                onChange={() => handleInputChange(inputValue, setInputValue)}
              />
            ) : (
              <Select
                showSearch
                placeholder="Izaberi ili dodaj"
                value={currentCustomer as any}
                onChange={(event: string) =>
                  handleSelectChange(event, setCurrentCustomer, setInputValue)
                }
                style={{ width: '100%' }} // Ensure the Select input is 100% width
                onSearch={setInputValue}
                filterOption={false}
                allowClear
                onKeyDown={(event: any) => {
                  form.setFieldValue('firstName', event.target.value)
                }}
              >
                {filteredOptions?.map((option: any) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
                {filteredOptions?.length === 0 && (
                  <Option value={inputValue}>{inputValue}</Option>
                )}
              </Select>
            )}
          </Form.Item>
        </Space.Compact>
      </Form.Item>
      <Form.Item
        label="Broj telefona:"
        name="phoneNumber"
        rules={[
          { required: true, message: 'Unesite broj telefona' },
          { pattern: /^\d+$/, message: 'Samo brojevi!' },
        ]}
        className="mb-4 mr-10 ml-10"
      >
        <Input disabled={!newCustomer} />
      </Form.Item>

      <Form.Item
        label="Mesto"
        name="city"
        rules={[{ required: true, message: 'Unesite mesto' }]}
        className="mb-4 mr-10 ml-10"
      >
        <Input disabled={!newCustomer} />
      </Form.Item>
      <Form.Item
        label="Adresa"
        name="address"
        rules={[{ required: true, message: 'Unesite adresu' }]}
        className="mb-4 mr-10 ml-10"
      >
        <Input disabled={!newCustomer} />
      </Form.Item>
      <Form.Item label="Ostalo" name="other" className="mb-4 mr-10 ml-10">
        <TextArea disabled={!newCustomer} />
      </Form.Item>
    </Form>
  )
}

export default CreateTaskFromPt1
