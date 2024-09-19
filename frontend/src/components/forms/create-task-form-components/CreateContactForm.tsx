import { Form, Input, Select, Typography, message } from 'antd'
import contactFormActions from './actions'
import { useEffect, useState } from 'react'
import ContactService from '@/services/ContactsService'
import { IContactsResponse } from '@/model/response/IContactResponse'
import { concateFullName } from '@/Utilities/setFullName'
import { separateFullName } from '@/Utilities/getSeparatedFullName'
import { VLI } from './types'
import ActionButton from '../../CustomButtons/ActionButton'
import { useGlobalContext } from '../../GlobalContextProvider'
import { AxiosError } from 'axios'

const { useGetAllContacts } = contactFormActions()

const CreateContactForm = () => {
  const { setContextContact, setCurrentPage, currentPage } = useGlobalContext()
  const [newContact, setNewContact] = useState(false)
  const { allContacts } = useGetAllContacts()
  const [contactForm] = Form.useForm<IContactsResponse>()
  const [selectedLabel, setSelectedLabel] = useState<string | undefined>('')
  const [searchTerm, setContactSearchTerm] = useState<string>(selectedLabel as string)
  const [fullVLI, setFullVLI] = useState<VLI[]>()

  useEffect(() => {
    setFullVLI(
      allContacts.map((item) => ({
        label: item.id.toLocaleString(),
        value: concateFullName(item.firstName, item.lastName),
        id: item.id,
      })),
    )
  }, [allContacts])

  const deducedSelectedCustomer = allContacts.find(
    (item) => concateFullName(item.firstName, item.lastName) === selectedLabel,
  )
  const filteredVLIs = fullVLI?.filter((item) => item.value.toLowerCase().includes(searchTerm.toLowerCase()))

  useEffect(() => {
    if (deducedSelectedCustomer) {
      setNewContact(false)
      contactForm.setFieldsValue({ ...deducedSelectedCustomer }) // Direktno postavljamo vrednosti iz objekta
    } else {
      setNewContact(true)
      contactForm.resetFields(['phoneNumber', 'city', 'address', 'other'])
    }

    setContextContact(
      deducedSelectedCustomer
        ? {
            id: deducedSelectedCustomer.id,
            fullName: concateFullName(deducedSelectedCustomer.firstName, deducedSelectedCustomer.lastName),
          }
        : undefined,
    ) // Postavljamo context samo ako postoji deducedSelectedCustomer
  }, [deducedSelectedCustomer, newContact, searchTerm, contactForm])

  const handleSaveContact = async (advanceToNextForm = false) => {
    try {
      if (newContact) {
        const values = await contactForm.validateFields()
        const { fullName, ...rest } = values //no problem
        const { firstName, lastName } = separateFullName(fullName)

        const contact = (await ContactService.createContact({ ...rest, firstName, lastName })).data

        setContextContact({
          id: contact.id,
          fullName: concateFullName(contact.firstName, contact.lastName),
        })

        contactForm.resetFields()
        message.success('Kontakt uspesno kreiran!')
      } else if (deducedSelectedCustomer) {
        setContextContact({
          id: deducedSelectedCustomer.id,
          fullName: concateFullName(deducedSelectedCustomer.firstName, deducedSelectedCustomer.lastName),
        })
      }

      if (advanceToNextForm) {
        setCurrentPage(currentPage + 1)
      }
    } catch (error: any | AxiosError) {
      console.error('Error creating/setting contact:', error)
      if (error?.response.data.error?.includes('Duplicate entry')) {
        message.error('Kontakt sa istim brojem telefona već postoji.')
      } else {
        message.error('Problem sa dodavanjem/postavljanjem kontakta, kontaktirajte administratora.')
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
