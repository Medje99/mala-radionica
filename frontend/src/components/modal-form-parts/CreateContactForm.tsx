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
import { useGlobalContext } from '@/contexts/ModalContextProvider'

const { Option } = Select //redeclare before component body main function
const { setCustomerSelectOptions, setCustomerFormValues, handleSelectChange } = createTaskFormActions() // createTaskFormActions

// Component main function
const CreateContactForm = () => {
  const { setCustomerContact, setCurrentPage, currentPage } = useGlobalContext() // context passing to form 2
  const [newCustomer, setNewCustomer] = useState(false) // definined default false
  const { customers } = useGetAllContacts() // getting customer full list via get request
  const [FormContactCreate] = Form.useForm<IContacts>() // create form instance useState for all fields and elements abstracted
  const [ContactSelect, setContactSelect] = useState<string | undefined>('') //contactSelect
  const [contactSerchCriteria, setContactSearchCriteria] = useState<string>(ContactSelect as string) //contact name,lastname input if no match
  const [ContactSelectionFull, setContactSelectionFull] = useState<CustomerSelect[]>() // if no match set true
  const selectedCustomer = customers.find((item) => concateFullName(item.firstName, item.lastName) === ContactSelect)

  const filteredOptions = ContactSelectionFull?.filter((option: any) =>
    option.label.toLowerCase().includes(contactSerchCriteria.toLowerCase()),
  )

  useEffect(() => {
    if (selectedCustomer) {
      setCustomerContact({
        id: selectedCustomer.id,
        fullName: concateFullName(selectedCustomer.firstName, selectedCustomer.lastName),
      })
    }
  }, [selectedCustomer, contactSerchCriteria, FormContactCreate]) // if selected

  useEffect(() => {
    setCustomerSelectOptions(customers, setContactSelectionFull)
  }, [customers, setContactSelectionFull])

  useEffect(() => {
    setCustomerFormValues(selectedCustomer, FormContactCreate, setNewCustomer)
  }, [selectedCustomer])

  const onClickHandler = () => {
    selectedCustomer //if existing contact advance to next form
      ? setCurrentPage(currentPage + 1) //else validate form , try adding
      : FormContactCreate.validateFields()
          .then((values: any) => {
            const { firstName } = values
            const separatedName = separateFullName(firstName)
            const formatedData = {
              ...values,
              firstName: separatedName.firstName,
              lastName: separatedName.lastName,
            }

            ContactService.createContactCustomer(formatedData)
              .then((response) => {
                const customer = response.data
                setCurrentPage(currentPage + 1)
                setCustomerContact({
                  id: customer.id,
                  fullName: concateFullName(customer.firstName, customer.lastName),
                })
                console.log('Pushed to context need to refine:', customer)
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
    <Form form={FormContactCreate} name="musterija-form" layout="vertical" className="bg-white p-5 rounded-lg">
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
            {newCustomer && selectedCustomer ? (
              <Input value={contactSerchCriteria} onChange={() => setContactSearchCriteria(contactSerchCriteria)} />
            ) : (
              <Select
                showSearch
                placeholder="Izaberi ili dodaj"
                value={ContactSelect as any}
                onChange={(event: string) => handleSelectChange(event, setContactSelect, setContactSearchCriteria)}
                style={{ width: '100%' }} // Ensure the Select input is 100% width
                onSearch={setContactSearchCriteria}
                filterOption={false}
                allowClear
                onKeyDown={(event: any) => {
                  FormContactCreate.setFieldValue('firstName', event.target.value)
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

      <ActionButton onClickHandler={onClickHandler} title={!newCustomer ? 'Nastavi' : 'Dodaj i nastavi'} />
    </Form>
  )
}

export default CreateContactForm
