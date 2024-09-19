/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Select, Typography, message } from 'antd' // Import message from antd
import contactFormActions from './actions'
import { useEffect, useState } from 'react'
import ContactService from '@/services/ContactsService'
import { IContactsResponse } from '@/model/response/IContactResponse'
import { concateFullName } from '@/Utilities/setFullName'
import { VLI } from './types'
import { separateFullName } from '@/Utilities/getSeparatedFullName'
import ActionButton from '../../CustomButtons/ActionButton'
import { useGlobalContext } from '../../GlobalContextProvider'

const {
  setContactSelectOptions: setContactSelectOptions,
  setContactFormValues: setContactFormValues,
  handleSelectChange,
  useGetAllContacts,
} = contactFormActions() // createTaskFormActions

// Component main function
const CreateContactForm = () => {
  const { setContextContact, setCurrentPage, currentPage } = useGlobalContext() // context passing to form 2
  const [newContact, setNewContact] = useState(false) // definined default false
  const { allContacts } = useGetAllContacts() // getting contact full list via get request
  const [contactForm] = Form.useForm<IContactsResponse>() // create form instance useState for all fields and elements abstracted
  const [selectedContactFullName, setContactSelect] = useState<string | undefined>('') //contactSelect one from select dropdown
  const [contactSerchTerm, setContactSearchTerm] = useState<string>(selectedContactFullName as string) //contact name,lastname input if no match
  const [formattedContactOptions, setFormattedContactOptions] = useState<VLI[]>() // if no match set true
  const selectedContact = allContacts.find(
    (item) => item.id === selectedContactFullName, // Use ID instead of full name
  )

  const displayedContactOptions = formattedContactOptions?.filter((option: any) =>
    option.label.toLowerCase().includes(contactSerchTerm.toLowerCase()),
  )

  useEffect(() => {
    if (formattedContactOptions) {
      console.log('Formatted Contact Options:', formattedContactOptions) // Log all options before filtering
    }
  }, [formattedContactOptions])

  useEffect(() => {
    if (displayedContactOptions) {
      console.log('Displayed Contact Options:', displayedContactOptions) // Log filtered options
    }
  }, [displayedContactOptions])

  useEffect(() => {
    if (selectedContact) {
      setContextContact({
        id: selectedContact.id,
        fullName: concateFullName(selectedContact.firstName, selectedContact.lastName),
      })
    }
  }, [selectedContact, contactSerchTerm, contactForm]) // if selected

  useEffect(() => {
    setContactSelectOptions(allContacts, setFormattedContactOptions) //sending props
  }, [allContacts, setFormattedContactOptions]) //

  useEffect(() => {
    setContactFormValues(selectedContact, contactForm, setNewContact)
  }, [selectedContact])

  const handleSaveContact = (advanceToNextForm: boolean = false) => {
    if (newContact) {
      // Validate and submit the form for new contact
      contactForm.validateFields().then((values: any) => {
        const { fullName } = values
        const separatedName = separateFullName(fullName)
        const formatedData = {
          ...values,
          firstName: separatedName.firstName,
          lastName: separatedName.lastName,
        }

        ContactService.createContact(formatedData)
          .then((response) => {
            const contact = response.data

            // Update the context with the new contact ID
            setContextContact({
              id: contact.id,
              fullName: concateFullName(contact.firstName, contact.lastName),
            })

            if (advanceToNextForm) {
              setCurrentPage(currentPage + 1)
            }

            contactForm.resetFields()
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
      // Set context for existing contact and advance
      if (selectedContact) {
        setContextContact({
          id: selectedContact.id,
          fullName: concateFullName(selectedContact.firstName, selectedContact.lastName),
        })
      }

      if (advanceToNextForm) {
        setCurrentPage(currentPage + 1)
      }
    }
  }

  return (
    <Form form={contactForm} layout="vertical" id="musterija-form">
      <Typography className="font-bold text-xl mb-12 text-center">Izaberi ili unesi novu musteriju</Typography>

      <Form.Item label={newContact ? 'Nova musterija' : 'Izabrana musterija '} name="fullName">
        {newContact && selectedContact ? null : (
          <Select
            showSearch
            placeholder="Izaberi ili dodaj"
            value={selectedContact?.id}
            onChange={(value: string) => handleSelectChange(value, setContactSelect, setContactSearchTerm)}
            onSearch={(input) => {
              setContactSearchTerm(input)
              console.log('Search term:', input) // Log search term
            }}
            filterOption={(input, option) => {
              const label = option?.label

              // Convert label to string or handle as undefined
              const labelAsString = typeof label === 'string' ? label : String(label)

              console.log('Option label:', labelAsString) // Log the option label being compared
              console.log('Option value:', option?.value) // Log the option value (ID)

              return labelAsString.toLowerCase().includes(input.toLowerCase())
            }}
            allowClear
            notFoundContent={null}
          >
            {displayedContactOptions?.map((option) => (
              <Select.Option key={option.value} value={option.value} label={option.label}>
                {option.label} {/* Display full name */}
              </Select.Option>
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
        <Input disabled={!newContact} />
      </Form.Item>

      <Form.Item label="Mesto" name="city">
        <Input disabled={!newContact} />
      </Form.Item>
      <Form.Item label="Adresa" name="address">
        <Input disabled={!newContact} />
      </Form.Item>
      {/* <Form.Item label="Ostalo" name="other" className="mb-4 mr-10 ml-10">
        <TextArea disabled={!newContact} />
      </Form.Item> */}
      <div className="flex flex-row justify-between mt-5">
        {newContact && <ActionButton onClickHandler={() => handleSaveContact(true)} title="Dodaj kontakt" />}
        <ActionButton
          onClickHandler={() => handleSaveContact(true)}
          title={!newContact ? 'Nastavi' : 'Dodaj i nastavi'}
        />
      </div>
    </Form>
  )
}

// Possible reasons for the issue and why setTimeout helps:

// React's controlled components and state updates: React's controlled components rely on state updates to reflect changes in the UI. It's possible that the FormContactCreate.setFieldValue call was happening before the input's internal state had fully updated with the latest character, causing the last character to be missed during submission.

// Event handling and timing: The onKeyDown event fires before the input's value is actually updated in the DOM. By using setTimeout, we delay the setFieldValue call until the next event loop tick, giving the browser enough time to update the input's value, thus ensuring that the last character is included.

export default CreateContactForm
