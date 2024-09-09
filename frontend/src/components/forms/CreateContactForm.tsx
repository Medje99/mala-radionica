/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Select, Typography, message } from 'antd' // Import message from antd
import contactFormActions from './create-task-form-components/actions'
import { useEffect, useState } from 'react'
import ContactService from '@/services/ContactsService'
import { IContactsResponse } from '@/model/response/IContactResponse'
import { concateFullName } from '@/Utilities/setFullName'
import { CustomerSelect } from './create-task-form-components/types'
import { separateFullName } from '@/Utilities/getSeparatedFullName'
import ActionButton from '../CustomButtons/ActionButton'
import { useGlobalContext } from '../GlobalContextProvider'

const { setCustomerSelectOptions, setCustomerFormValues, handleSelectChange, useGetAllContacts } = contactFormActions() // createTaskFormActions

// Component main function
const CreateContactForm = () => {
  const { setContextCustomer, setCurrentPage, currentPage } = useGlobalContext() // context passing to form 2
  const [newCustomer, setNewCustomer] = useState(false) // definined default false
  const { customers } = useGetAllContacts() // getting customer full list via get request
  const [FormContactCreate] = Form.useForm<IContactsResponse>() // create form instance useState for all fields and elements abstracted
  const [ContactSelect, setContactSelect] = useState<string | undefined>('') //contactSelect one from select dropdown
  const [contactSerchCriteria, setContactSearchCriteria] = useState<string>(ContactSelect as string) //contact name,lastname input if no match
  const [searchMatch, searchMatchQuerry] = useState<CustomerSelect[]>() // if no match set true
  const selectedCustomer = customers.find((item) => concateFullName(item.firstName, item.lastName) === ContactSelect)

  const filteredOptions = searchMatch?.filter((option: any) =>
    option.label.toLowerCase().includes(contactSerchCriteria.toLowerCase()),
  )

  useEffect(() => {
    if (selectedCustomer) {
      setContextCustomer({
        id: selectedCustomer.id,
        fullName: concateFullName(selectedCustomer.firstName, selectedCustomer.lastName),
      })
    }
  }, [selectedCustomer, contactSerchCriteria, FormContactCreate]) // if selected

  useEffect(() => {
    setCustomerSelectOptions(customers, searchMatchQuerry)
  }, [customers, searchMatchQuerry])

  useEffect(() => {
    setCustomerFormValues(selectedCustomer, FormContactCreate, setNewCustomer)
  }, [selectedCustomer])

  const onClickHandler = () => {
    selectedCustomer //if existing contact advance to next form
      ? setCurrentPage(currentPage + 1) //else validate form , try adding
      : FormContactCreate.validateFields().then((values: any) => {
          const { fullName } = values
          const separatedName = separateFullName(fullName)
          const formatedData = {
            ...values,
            firstName: separatedName.firstName,
            lastName: separatedName.lastName,
          }

          ContactService.createContactCustomer(formatedData)
            .then((response) => {
              //responese as input
              const customer = response.data
              setCurrentPage(currentPage + 1)
              setContextCustomer({
                id: customer.id,
                fullName: concateFullName(customer.firstName, customer.lastName),
              })
              console.log('Pushed to context', customer)
              message.success('Kontakt uspesno kreiran!')
            })
            .catch((error) => {
              console.error('Error creating contact:', error)
              message.error('Greška prilikom kreiranja kontakta.Kontaktirajte administratora.')
            })
        })
  }

  return (
    <Form form={FormContactCreate} layout="vertical" id="musterija-form">
      <Typography className="font-bold text-xl mb-12 text-center">Izaberi ili unesi novu musteriju</Typography>

      <Form.Item label="Musterija" name="fullName">
        {/*this sometimes fixes select not showing sometime breaks it.. wtf*/}
        {/* <p className="hidden">{selectedCustomer?.fullName}</p> */}
        {/*this sometimes fixes select not showing sometime breaks it.. wtf*/}

        {newCustomer && selectedCustomer ? null : (
          <Select
            showSearch
            placeholder="Izaberi ili dodaj"
            value={ContactSelect as any}
            onChange={(event: string) => handleSelectChange(event, setContactSelect, setContactSearchCriteria)}
            onSearch={setContactSearchCriteria}
            filterOption={true}
            allowClear
            onKeyDown={(event: any) => {
              // Instead of using event.target.value directly, schedule the update so it takes all characters
              setTimeout(() => {
                FormContactCreate.setFieldValue('fullName', event.target.value)
              }, 0)
            }}
            notFoundContent={null}
          >
            {filteredOptions?.map((Option, index) => (
              <option key={index} value={Option.value}></option>
            ))}
          </Select>
        )}
      </Form.Item>

      <Form.Item label="Broj telefona:" name="phoneNumber" rules={[{ pattern: /^\d+$/, message: 'Samo brojevi!' }]}>
        <Input disabled={!newCustomer} />
      </Form.Item>

      <Form.Item label="Mesto" name="city">
        <Input disabled={!newCustomer} />
      </Form.Item>
      <Form.Item label="Adresa" name="address">
        <Input disabled={!newCustomer} />
      </Form.Item>
      {/* <Form.Item label="Ostalo" name="other" className="mb-4 mr-10 ml-10">
        <TextArea disabled={!newCustomer} />
      </Form.Item> */}
      <div className="flex flex-row justify-between mt-5">
        <ActionButton onClickHandler={onClickHandler} title={!newCustomer ? 'Nastavi' : 'Dodaj i nastavi'} />
      </div>
    </Form>
  )
}

export default CreateContactForm
