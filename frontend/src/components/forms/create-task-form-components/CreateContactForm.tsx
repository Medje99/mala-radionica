import { Form, Input, Select, Typography, message,Image } from 'antd'
import contactFormActions from './actions'
import { useEffect, useState } from 'react'
import ContactService from '@/services/ContactsService'
import { IContactsResponse } from '@/model/response/IContactResponse'
import { concateFullName } from '@/Utilities/setFullName'
import { separateFullName } from '@/Utilities/getSeparatedFullName'
import ActionButton from '../../CustomButtons/ActionButton'
import { useGlobalContext } from '../../GlobalContextProvider'
import { AxiosError } from 'axios'
import spiderman from "..//..//../assets/spiderman.png";
import TaskService from '@/services/TaskService'
// import { creation_date } from '@/components/tables/task-table-components/constants'
import dayjs from 'dayjs'
import { ShoppingCartOutlined } from '@ant-design/icons'
import chainsaw from "..//..//../assets/chainsaw.svg";
import cart from "..//..//../assets/cart.svg";
import heli from "..//..//../assets/heli.svg";



const { useGetAllContacts } = contactFormActions()

const CreateContactForm = () => {
  const { setContextContact, setCurrentPage, currentPage,Contact,setCurrentTask } = useGlobalContext()
  const [newContact, setNewContact] = useState(false)
  const { allContacts } = useGetAllContacts()
  const [contactForm] = Form.useForm<IContactsResponse>()
  const [selectedLabel, setSelectedLabel] = useState<string>('')
  const [searchTerm, setContactSearchTerm] = useState<string>('')
  const [fullVLI, setFullVLI] = useState<
    {
      value: string
      label: string
      id: number
    }[]
  >()
  const filteredVLIs = fullVLI?.filter((item) => item.value.toLowerCase().includes(searchTerm.toLowerCase()))

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

  useEffect(() => {
    if (deducedSelectedCustomer) {
      setNewContact(false)
      contactForm.setFieldsValue({ ...deducedSelectedCustomer })
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
    )
  }, [deducedSelectedCustomer, newContact, searchTerm, contactForm])

  const handleSaveContact = async (advanceToNextForm = false, task_name="") => {
    try {
      if (newContact) {
        const values = await contactForm.validateFields()
        const { fullName, ...rest } = values
        const { firstName, lastName } = separateFullName(fullName)

        const contact = (await ContactService.createContact({ ...rest, firstName, lastName, fullName })).data

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
        if (task_name!=="") {
          const fullData = {
          job_name:task_name,
          isFinished:true,
         creation_date:(dayjs(Date.now())),
            contact_id:Contact?.id ?? 0,
          }
          TaskService.createTask(fullData)
          .then((response) => {
            console.log(fullData, 'data')
            console.log(response, 'response')
            message.success('Posao uspesno kreiran!')
            // Update the job object in the context
            setCurrentTask({
              task_id: response.data.id,
            })
          })
           setCurrentPage(currentPage + 2)
        }
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
    <Form form={contactForm} layout="vertical" id="glowic" className='bg-white opacity-90'>
      <Typography className="font-bold text-xl mb-12 text-center">Izaberi ili unesi novu musteriju</Typography>

      <Form.Item label={newContact ? 'Nova musterija' : 'Izabrana musterija '} name="fullName">
        {newContact && deducedSelectedCustomer ? null : (
          <Select
            showSearch
            placeholder="Izaberi ili dodaj"
            value={selectedLabel}
            onChange={(event: string) => {
              setSelectedLabel(event), setContactSearchTerm('')
            }}
            onSearch={setContactSearchTerm}
            filterOption={true}
            allowClear
            onKeyDown={(event: any) => {
              setTimeout(() => {
                contactForm.setFieldValue('fullName', event.target.value)
              }, 0)
            }}
            notFoundContent={null}
          >
            {filteredVLIs?.map((vli) => (
              <option key={vli.id} label={vli.id.toLocaleString()} value={vli.value}></option>
            ))}
          </Select>
        )}
      </Form.Item>

      <Form.Item label="Broj telefona:" name="phoneNumber" rules={[{ pattern: /^\d+$/, message: 'Samo brojevi!' }, { max: 13, message: 'Proveri broj telefona, broj nesme da sadrži više od 13 cifara' }]}>
        <Input disabled={!newContact} />
      </Form.Item>

      <Form.Item label="Mesto" name="city">
        <Input disabled={!newContact} />
      </Form.Item>
      <Form.Item label="Adresa" name="address">
        <Input disabled={!newContact} />
      </Form.Item>

      <div className="flex flex-col items-center mt-5">
        <div className="flex flex-row justify-between w-full">
        <div onClick={() => handleSaveContact(true, "Ostrenje")} style={{ cursor: "pointer" }}>
  <Image 
    src={chainsaw} 
    className="buto"
    title="Ostrenje"
    preview={false} 
  />
</div>

<div onClick={() => handleSaveContact(true, "Kasa")} style={{ cursor: "pointer" }}>
  <Image 
    src={cart} 
    className="buto"
    preview={false} 
  />
</div>

<div 
  onClick={() => handleSaveContact(true)} 
  style={{ cursor: "pointer", marginTop: "-10px" }} // Adjust this value as needed
>
  <Image 
    src={heli} 
    className="buto" 
    style={{ 
      transform: "scale(-1.5, 1.5)", 
      transformOrigin: "center" 
    }} 
    preview={false} 
  />
</div>




       </div>
        <img src={spiderman} alt="Spiderman" width="300" height="300"   className="mt-10 mx-auto opacity-80 hover:opacity-100 transition duration-300"  
 />
      <div className="flex flex-col justify-center items-center gap-7 mt-10">
  <Typography.Link href="https://www.tehnomotornis.rs/pocetna" target="_blank" rel="noopener noreferrer">
    <img src="https://www.tehnomotornis.rs/fajlovi/logo/logo3.png" className="h-7 transition-transform hover:scale-150" alt="Tehnomotornis" />
  </Typography.Link>

  <Typography.Link href="https://swordsrbija.com/" target="_blank" rel="noopener noreferrer">
    <img src="https://swordsrbija.com/wp-content/uploads/2023/05/sword-logo.png" className="h-9 transition-transform hover:scale-150" alt="Swords Srbija" />
  </Typography.Link>

  <Typography.Link href="https://www.venerabike.rs/" target="_blank" rel="noopener noreferrer">
    <img src="https://www.venerabike.rs/icons/venera-bike.svg" className="h-7 transition-transform hover:scale-150" alt="Venera Bike" />
  </Typography.Link>  
</div>

      </div>
    </Form>
  )
}

export default CreateContactForm