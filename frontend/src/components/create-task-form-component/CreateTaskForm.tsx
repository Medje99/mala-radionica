/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Select, Space } from 'antd'
import { useEffect, useState } from 'react'
import { CustomerSelect } from './types'
import useGetAllContacts from '@/CustomHooks/useGetAllContants'
import createTaskFormActions from './actions'
import { IContacts } from '@/model/response/IContactResponse'
import { concateFullName } from '@/Utilities/setFullName'

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

  const pickedCustomer = customers.find(
    (item) => concateFullName(item.firstName, item.lastName) === currentCustomer
  )

  const filteredOptions = newCustomerSelect?.filter((option: any) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  )

  useEffect(() => {
    setCustomerSelectOptions(customers, setNewCustomerSelect)
  }, [customers])

  useEffect(() => {
    setCustomerFormValues(pickedCustomer, form, setNewCustomer)
  }, [pickedCustomer, form])

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
            name="Ime i prezime"
            noStyle
            rules={[{ required: true, message: 'Izaberi ili dodaj' }]}
            className="flex-1"
          >
            {newCustomer && pickedCustomer ? (
              <>
                <Input
                  value={inputValue}
                  onChange={() => handleInputChange(inputValue, setInputValue)}
                />
              </>
            ) : (
              // ako nije novi korisnik
              <Select
                showSearch
                placeholder="Izaberi ili dodaj"
                className="w-full"
                value={currentCustomer as any}
                onChange={(event: string) =>
                  handleSelectChange(event, setCurrentCustomer, setInputValue)
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
                  <Option value={inputValue}>Dodaj novi kontakt...</Option>
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
        className="mb-4 w-1/2"
      >
        <Input disabled={!newCustomer} />
      </Form.Item>

      <Form.Item
        label="Mesto"
        name="city"
        rules={[{ required: true, message: 'Unesite mesto' }]}
        className="mb-4 w-1/2"
      >
        <Input disabled={!newCustomer} />
      </Form.Item>
      <Form.Item
        label="Adresa"
        name="address"
        rules={[{ required: true, message: 'Unesite adresu' }]}
        className="mb-4 w-1/2"
      >
        <Input disabled={!newCustomer} />
      </Form.Item>
      <Form.Item label="Ostalo" name="other" className="mb-4 w-1/2">
        <Input disabled={!newCustomer} />
      </Form.Item>
    </Form>
  )
}
