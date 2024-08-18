/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Select, Space } from 'antd'
import TextArea from 'antd/es/input/TextArea'

import createTaskFormActions from '../create-task-form-component/actions'
import { useEffect, useState } from 'react'
import useGetAllContacts from '@/CustomHooks/useGetAllContants'
import { IContacts } from '@/model/response/IContactResponse'
import { concateFullName } from '@/Utilities/setFullName'
import { CustomerSelect } from '../create-task-form-component/types'
import { separateFullName } from '@/Utilities/getSeparatedFullName'
import ContactService from '@/service/ContactsService'
import ActionButton from '../CustomButtons/ActionButton'
import { useModalContext } from '@/contexts/ModalContextProvider'

const { Option } = Select

const { setCustomerSelectOptions, setCustomerFormValues, handleSelectChange } =
  createTaskFormActions()

const CreateTaskFromPt1 = () => {
  const { setCustomerContact, setModalTitle, setCurrentPage, currentPage } =
    useModalContext()
  const [newCustomer, setNewCustomer] = useState(false) // definined boolean

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
    if (pickedCustomer) {
      setCustomerContact({
        id: pickedCustomer.id,
        fullName: concateFullName(
          pickedCustomer.firstName,
          pickedCustomer.lastName
        ),
      })
    }
  }, [pickedCustomer, hybridInputText, form])

  useEffect(() => {
    setCustomerSelectOptions(customers, setNewCustomerSelect)
  }, [customers, setNewCustomerSelect])

  useEffect(() => {
    setCustomerFormValues(pickedCustomer, form, setNewCustomer)
  }, [pickedCustomer])

  useEffect(() => {
    setModalTitle('Forma 1')
  }, [])

  const onClickHandler = () => {
    pickedCustomer //if existing customer just continue
      ? setCurrentPage(currentPage + 1) //else validate form , try adding
      : form
          .validateFields()
          .then((values: any) => {
            const { firstName } = values
            const separatedName = separateFullName(firstName)
            const formatedData = {
              ...values,
              firstName: separatedName.firstName,
              lastName: separatedName.lastName,
            }
            ContactService.createContactCustomer(formatedData)
              .then((createdContact) => {
                console.log('Contact created:', createdContact)
              })
              .catch((error) => {
                console.error('Error creating contact:', error)
              })
          })
          .catch((errorInfo: any) => {
            console.error('Validation failed:', errorInfo)
          })
  }

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
        <Input disabled={pickedCustomer ? true : false} />
      </Form.Item>

      <Form.Item
        label="Mesto"
        name="city"
        rules={[{ required: true, message: 'Unesite mesto' }]}
        className="mb-4 mr-10 ml-10"
      >
        <Input disabled={pickedCustomer ? true : false} />
      </Form.Item>
      <Form.Item
        label="Adresa"
        name="address"
        rules={[{ required: true, message: 'Unesite adresu' }]}
        className="mb-4 mr-10 ml-10"
      >
        <Input disabled={pickedCustomer ? true : false} />
      </Form.Item>
      <Form.Item label="Ostalo" name="other" className="mb-4 mr-10 ml-10">
        <TextArea disabled={pickedCustomer ? true : false} />
      </Form.Item>

      <ActionButton
        onClickHandler={onClickHandler}
        title={pickedCustomer ? 'Nastavi' : 'Dodaj i nastavi'}
      />
    </Form>
  )
}

export default CreateTaskFromPt1
