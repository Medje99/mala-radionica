/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Modal, Select, Space } from 'antd'
import { useEffect, useState } from 'react'
import { CustomerSelect } from './types'
import useGetAllContacts from '@/CustomHooks/useGetAllContants'
import createTaskFormActions from './actions'
import { IContacts } from '@/model/response/IContactResponse'
import { concateFullName } from '@/Utilities/setFullName'
import ContactService from '@/service/ContactsService'
import { separateFullName } from '@/Utilities/getSeparatedFullName'
import TextArea from 'antd/es/input/TextArea'

const { Option } = Select

const {
  setCustomerSelectOptions,
  setCustomerFormValues,
  handleSelectChange,
  handleInputChange,
} = createTaskFormActions()

export const CreateTaskForm = ({ ...props }: any) => {
  const { setModalIsOpen, modalIsOpen } = props

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

  const onHandleSubmit = (event: any) => {
    event.preventDefault()
    setModalIsOpen(false)

    // Assuming form is an Ant Design Form instance
    form
      .validateFields()
      .then((values) => {
        const { firstName } = values
        const separatedName = separateFullName(firstName)

        const formatedData = {
          ...values,
          firstName: separatedName.firstName,
          lastName: separatedName.lastName,
          id: 200,
        }

        ContactService.createContactCustomer(formatedData)
          .then((createdContact) => {
            console.log('Contact created:', createdContact)
            // Additional success handling, e.g., reset form, show success message
          })
          .catch((error) => {
            console.error('Error:', error)
            // Provide user feedback on error
          })
      })
      .catch((errorInfo) => {
        console.error('Validation failed:', errorInfo)
        // Provide user feedback on validation failure
      })
  }

  return (
    <Modal
      title="Izaberi musteriju ili dodaj novu:"
      centered
      open={modalIsOpen}
      onOk={
        newCustomer
          ? () => onHandleSubmit(event)
          : () => console.log('Next step')
      }
      onCancel={() => setModalIsOpen(false)}
      okText={newCustomer ? 'Dodaj' : 'Izaberi'}
      width={'30%'}
      okButtonProps={{
        type: 'primary',
        className: 'float-left',
      }}
      cancelButtonProps={{
        type: 'default',
      }}
    >
      <Form
        form={form}
        name="musterija-form"
        layout="vertical"
        className="bg-white p-5 rounded-lg"
      >
        <Form.Item label="Musterija" required className="mb-4">
          <Space.Compact>
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
                  className="w-full"
                  value={currentCustomer as any}
                  onChange={(event: string) =>
                    handleSelectChange(event, setCurrentCustomer, setInputValue)
                  }
                  onSearch={setInputValue}
                  filterOption={false}
                  allowClear
                  onKeyDown={(event: any) => {
                    form.setFieldValue('firstName', event.target.value)
                  }}
                >
                  {filteredOptions?.map((option) => (
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
          <TextArea disabled={!newCustomer} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
