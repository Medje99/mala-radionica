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

const { cutToVLI, setContactFormValues, useGetAllContacts } = contactFormActions() // createTaskFormActions

// Component main function
const CreateContactForm = () => {
  const { setContextContact, setCurrentPage, currentPage } = useGlobalContext() // context passing to form 2
  const [newContact, setNewContact] = useState(false) // definined default false
  const { allContacts } = useGetAllContacts() // getting contact full list via get request
  const [contactForm] = Form.useForm<IContactsResponse>() // create form instance useState for all fields and elements abstracted
  const [selectedLabel, setSelectedLabel] = useState<string | undefined>('') //contactSelect one from select dropdown
  const [searchTerm, setContactSearchTerm] = useState<string>(selectedLabel as string) //contact name,lastname input if no match
  const [fullVLI, setFullVLI] = useState<VLI[]>()

  const deducedSelectedCustomer = allContacts.find(
    (item) => concateFullName(item.firstName, item.lastName) === selectedLabel, //finding whole object that matches selected label
  )

  const filteredVLIs = fullVLI?.filter(
    (
      item, // Each item is compared to search term if it's matching it gets on filteredVLI list
    ) => item.value.toLowerCase().includes(searchTerm.toLowerCase()), // big diference between value and label
  ) // filter dropdown needed

  useEffect(() => {
    if (deducedSelectedCustomer) {
      setContextContact({
        id: deducedSelectedCustomer.id,
        fullName: concateFullName(deducedSelectedCustomer.firstName, deducedSelectedCustomer.lastName),
      })
    }
  }, [newContact, searchTerm, contactForm]) // if selected

  useEffect(() => {
    cutToVLI(allContacts, setFullVLI) //allContacts are full objects with all info
  }, [allContacts, setFullVLI]) //

  useEffect(() => {
    setContactFormValues(deducedSelectedCustomer, contactForm, setNewContact)
  }, [deducedSelectedCustomer])

  const handleSaveContact = (advanceToNextForm: boolean = false) => {
    if (newContact) {
      // Validate and submit the form for new contact
      contactForm.validateFields().then((values) => {
        const { fullName } = values
        const separatedName = separateFullName(fullName)
        const formatedData = {
          ...values,
          firstName: separatedName.firstName, // extracting firstName by space
          lastName: separatedName.lastName, // briliant for new customer
        }

        ContactService.createContact(formatedData)
          .then((response) => {
            const contact = response.data

            // Update the context with the new contact ID
            setContextContact({
              id: contact.id, //for new entries they get id here
              fullName: concateFullName(contact.firstName, contact.lastName), // fullname for context
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
      //existing customer
      // Set context for existing contact and advance
      if (deducedSelectedCustomer) {
        // replace deducedCustomer with new customer in if statements
        setContextContact({
          id: deducedSelectedCustomer.id, // take id directly from selection value
          fullName: concateFullName(deducedSelectedCustomer.firstName, deducedSelectedCustomer.lastName),
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
        {newContact && deducedSelectedCustomer ? null : (
          <Select
            showSearch
            placeholder="Izaberi ili dodaj"
            value={selectedLabel}
            onChange={(event: string) => {
              setSelectedLabel(event), setContactSearchTerm('')
            }} //event is selection
            //
            onSearch={setContactSearchTerm}
            filterOption={true}
            allowClear
            onKeyDown={(event: any) => {
              setTimeout(() => {
                contactForm.setFieldValue('fullName', event.target.value)
              }, 0) // fixes cutting last char when new contact
            }}
            notFoundContent={null}
          >
            {filteredVLIs?.map((vli) => (
              <option key={vli.id} label={vli.id.toLocaleString()} value={vli.value}></option>
              // value is what is rendered and submitted
              //label is what is beeing searched !
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
