/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Select, Typography, message } from 'antd' // Import message from antd
import contactFormActions from './actions'
import { useEffect, useState } from 'react'
import ContactService from '@/services/ContactsService'
import { IContactsResponse } from '@/model/response/IContactResponse'
import { concateFullName } from '@/Utilities/setFullName'
import { CustomerSelect } from './types'
import { separateFullName } from '@/Utilities/getSeparatedFullName'
import ActionButton from '../../CustomButtons/ActionButton'
import { useGlobalContext } from '../../GlobalContextProvider'

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

  const handleSaveContact = (advanceToNextForm: boolean = false) => {
    if (newCustomer) {
      // Validate and submit the form for new customers
      FormContactCreate.validateFields().then((values: any) => {
        const { fullName } = values
        const separatedName = separateFullName(fullName)
        const formatedData = {
          ...values,
          firstName: separatedName.firstName,
          lastName: separatedName.lastName,
        }

        ContactService.createContactCustomer(formatedData)
          .then((response) => {
            const customer = response.data

            // Update the context with the new customer ID
            setContextCustomer({
              id: customer.id,
              fullName: concateFullName(customer.firstName, customer.lastName),
            })

            if (advanceToNextForm) {
              setCurrentPage(currentPage + 1)
            }

            FormContactCreate.resetFields()
            message.success('Kontakt uspesno kreiran!')
          })
          .catch((error) => {
            console.error('Error creating contact:', error)
            if (error.response && error.response.data && error.response.data.error) {
              if (error.response.data.error.includes('Duplicate entry')) {
                message.error('Kontakt sa istim brojem telefona već postoji.')
                return
              }
            }
            message.error('Problem sa dodavanjem kontakta, kontaktirajte administratora.')
          })
      })
    } else {
      // Set context for existing customers and advance
      if (selectedCustomer) {
        setContextCustomer({
          id: selectedCustomer.id,
          fullName: concateFullName(selectedCustomer.firstName, selectedCustomer.lastName),
        })
      }

      if (advanceToNextForm) {
        setCurrentPage(currentPage + 1)
      }
    }
  }

  return (
    <Form form={FormContactCreate} layout="vertical" id="musterija-form">
      <Typography className="font-bold text-xl mb-12 text-center">Izaberi ili unesi novu musteriju</Typography>

      <Form.Item label={newCustomer ? 'Nova musterija' : 'Izabrana musterija '} name="fullName">
        {newCustomer && selectedCustomer ? null : (
          <Select
            showSearch
            placeholder="Izaberi ili dodaj"
            value={ContactSelect}
            onChange={(event: string) => handleSelectChange(event, setContactSelect, setContactSearchCriteria)}
            onSearch={setContactSearchCriteria}
            filterOption={true}
            allowClear
            onKeyDown={(event: any) => {
              setTimeout(() => {
                FormContactCreate.setFieldValue('fullName', event.target.value)
              }, 0) // fixes cutting last char
            }}
            notFoundContent={null}
          >
            {filteredOptions?.map((Option, index) => (
              <option key={index} value={Option.value}></option>
            ))}
          </Select>
        )}
      </Form.Item>

      <Form.Item
        label="Broj telefona:"
        name="phoneNumber"
        rules={[
          { pattern: /^\d+$/, message: 'Samo brojevi!' },
          { max: 13, message: 'Proveri broj telefona, broj nesme da sadrži više od 13 cifara' },
        ]}
      >
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
        {newCustomer && <ActionButton onClickHandler={() => handleSaveContact(true)} title="Dodaj kontakt" />}
        <ActionButton
          onClickHandler={() => handleSaveContact(true)}
          title={!newCustomer ? 'Nastavi' : 'Dodaj i nastavi'}
        />
      </div>
    </Form>
  )
}

// Possible reasons for the issue and why setTimeout helps:

// React's controlled components and state updates: React's controlled components rely on state updates to reflect changes in the UI. It's possible that the FormContactCreate.setFieldValue call was happening before the input's internal state had fully updated with the latest character, causing the last character to be missed during submission.

// Event handling and timing: The onKeyDown event fires before the input's value is actually updated in the DOM. By using setTimeout, we delay the setFieldValue call until the next event loop tick, giving the browser enough time to update the input's value, thus ensuring that the last character is included.

export default CreateContactForm
