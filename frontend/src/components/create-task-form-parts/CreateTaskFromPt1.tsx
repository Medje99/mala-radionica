/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, Select, Space } from 'antd'
import TextArea from 'antd/es/input/TextArea'

import createTaskFormActions from '../create-task-form-component/actions'
import { useContext, useEffect, useState } from 'react'
import useGetAllContacts from '@/CustomHooks/useGetAllContants'
import { IContacts } from '@/model/response/IContactResponse'
import { concateFullName } from '@/Utilities/setFullName'
import { CustomerSelect } from '../create-task-form-component/types'
import { FormContext } from '../create-task-form-component/CreateTaskForm'
import { useModal } from '@/contexts/ModalContextProvider'
import NextButton from '../CustomButtons/NextButton'
import { separateFullName } from '@/Utilities/getSeparatedFullName'
import ContactService from '@/service/ContactsService'

const { Option } = Select

const { setCustomerSelectOptions, setCustomerFormValues, handleSelectChange } =
  createTaskFormActions()

const CreateTaskFromPt1 = () => {
  const { currentPage, setCurrentPage } = useModal()
  const { setCustomerContact, setModalTitle } = useContext<any>(FormContext)
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
    pickedCustomer
      ? setCurrentPage(currentPage + 1)
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
                setCurrentPage(currentPage + 1)
                console.log('Contact created:', createdContact)
              })
              .catch((error) => {
                console.error('Error:', error)
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
      <Form.Item label="Ostalo" name="other" className="mb-4 mr-10 ml-10">
        <Button onClick={() => setCurrentPage(currentPage + 1)}>Create</Button>
      </Form.Item>
      <NextButton onClickHandler={onClickHandler} title="Dalje" />
    </Form>
  )
}

export default CreateTaskFromPt1
