/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Select, Space } from 'antd'
import TextArea from 'antd/es/input/TextArea'

import createTaskFormActions from '../create-task-form-component/actions'
import { useContext, useEffect, useState } from 'react'
import useGetAllContacts from '@/CustomHooks/useGetAllContants'
import { IContacts } from '@/model/response/IContactResponse'
import { concateFullName } from '@/Utilities/setFullName'
import { CustomerSelect } from '../create-task-form-component/types'
import { FormContext } from '../create-task-form-component/CreateTaskForm'

const { Option } = Select

const { setCustomerSelectOptions, setCustomerFormValues, handleSelectChange } =
  createTaskFormActions()

const CreateTaskFromPt1 = () => {
  const { setCustomerContact } = useContext<any>(FormContext)

  const [newCustomer, setNewCustomer] = useState(false)

  const { customers } = useGetAllContacts()
  const [form] = Form.useForm<IContacts>()
  const [hybridInputSelect, setHybridInputSelect] = useState<
    string | undefined
  >('')
  const [hybridInputText, sethybridInputText] = useState<string>(
    hybridInputSelect as string
  )

  const [newCustomerSelect, setNewCustomerSelect] = useState<CustomerSelect[]>()

  const pickedCustomer = customers.find(
    (item) =>
      concateFullName(item.firstName, item.lastName) === hybridInputSelect
  )

  const filteredOptions = newCustomerSelect?.filter((option: any) =>
    option.label.toLowerCase().includes(hybridInputText.toLowerCase())
  )

  useEffect(() => {
    const fullName = pickedCustomer
      ? concateFullName(pickedCustomer.firstName, pickedCustomer.lastName)
      : ''
    setCustomerContact(pickedCustomer)
  }, [pickedCustomer])

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
                value={hybridInputText}
                onChange={() => sethybridInputText(hybridInputText)}
              />
            ) : (
              <Select
                showSearch
                placeholder="Izaberi ili dodaj"
                value={hybridInputSelect as any}
                onChange={(event: string) =>
                  handleSelectChange(
                    event,
                    setHybridInputSelect,
                    sethybridInputText
                  )
                }
                style={{ width: '100%' }} // Ensure the Select input is 100% width
                onSearch={sethybridInputText}
                filterOption={false}
                allowClear
                onKeyDown={(event: any) => {
                  form.setFieldValue('firstName', event.target.value)
                }}
                notFoundContent={null}
              >
                {filteredOptions?.map((option: any) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
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
