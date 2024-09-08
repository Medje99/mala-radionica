import React, { useState, useEffect } from 'react'
import { Table, Input, Popconfirm, message, Modal, Form, Space, Button, Tooltip } from 'antd'
import { ErrorResponse } from 'react-router-dom'
import { IContactsResponse } from '@/model/response/IContactResponse'
import useGetAllContacts from '@/CustomHooks/useGetAllContants'
import ContactService from '@/service/ContactsService'
import { useGlobalContext } from '@/contexts/GlobalContextProvider'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { AxiosError } from 'axios'
import { customer_city, customer_firstName, customer_lastName, customer_phoneNumber } from './constants'

const ContactsList: React.FC = () => {
  const { setHeaderTitle } = useGlobalContext()
  useEffect(() => {
    setHeaderTitle('Kontakti')
  }, [])
  const { customers: contacts } = useGetAllContacts()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredContacts, setFilteredContacts] = useState<IContactsResponse[]>([])
  const [editingContact, setEditingContact] = useState<IContactsResponse>({} as IContactsResponse)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [FormContactList] = Form.useForm<IContactsResponse>()

  useEffect(() => {
    const filtered = contacts.filter((contact) => {
      const searchText = searchTerm.toLowerCase()
      return (
        contact.firstName?.toLowerCase().includes(searchText) ||
        contact.lastName?.toLowerCase().includes(searchText) ||
        contact.city?.toLowerCase().includes(searchText) ||
        contact.phoneNumber?.toLowerCase().includes(searchText)
      )
    })
    setFilteredContacts(filtered)
  }, [searchTerm, contacts])

  const handleEdit = (record: IContactsResponse) => {
    setEditingContact(record)
    FormContactList.setFieldsValue(record)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    ContactService.deleteContactCustomer(id)
      .then(() => {
        message.success('Kontakt izbrisan')
        setFilteredContacts(filteredContacts.filter((contact) => contact.id !== id))
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error('Error deleting contact:', error)
        message.error('Kontakt nije obrisan. ')
        message.warning('Nije dozvoljeno obrisati kontakt za koji postoji aktivan posao! ')
      })
  }

  const handleSave = async () => {
    const values = await FormContactList.validateFields()
    const updatedProduct = { ...editingContact, ...values } as IContactsResponse
    ContactService.updateContactCustomer(updatedProduct)
    const updatedContacts = filteredContacts.map((contact) =>
      contact.id === editingContact.id ? { ...contact, ...values } : contact,
    )
    setFilteredContacts(updatedContacts)
    setIsModalOpen(false)

    message.success('Contact updated successfully')
  }
  const actions = {
    title: 'Radnje',
    align: 'center',
    key: 'action',
    render: (record: IContactsResponse) => (
      <Space size="large" className="flex justify-center gap-12">
        <Tooltip title="Izmeni">
          <Button type="primary" ghost onClick={() => handleEdit(record)}>
            <EditOutlined />
          </Button>
        </Tooltip>
        <Popconfirm
          title="Da li ste sigurni da zelite izbrisati ovaj kontakt?"
          onConfirm={() => handleDelete(record.id)}
          onCancel={() => message.error('Brisanje otkazano')}
          okText="Da"
          cancelText="Ne"
          okButtonProps={{ style: { background: 'green' } }}
          cancelButtonProps={{ style: { background: 'red' } }}
        >
          <Tooltip title="Obrisi">
            <Button danger ghost>
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </Popconfirm>
      </Space>
    ),
  }
  const columns = [customer_firstName, customer_lastName, customer_city, customer_phoneNumber, actions]

  return (
    <div className=" flex-row contact">
      <Space id="search-container" className="col-span-12 flex ">
        <Input.Search
          size="large"
          placeholder="Pretraži proizvode"
          onChange={(e) => setSearchTerm(e.target.value)}
          id="search"
        />
      </Space>
      <section className="w-full px-24 ">
        <Table
          size="small"
          columns={columns} //don't like align center
          dataSource={filteredContacts}
          pagination={{ pageSize: 14 }} // Adjust page size as needed
          rowKey="id" // Use 'id' as the row key
          className="p-7 mt-5 rounded-xl"
        />
      </section>
      <Modal
        title="Uredi kontakt"
        className="flex"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={FormContactList} layout="vertical">
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: 'Please enter the first name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Last Name" name="lastName">
            <Input />
          </Form.Item>
          <Form.Item label="City" name="city" rules={[{ required: false, message: 'Please enter the city' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Phone Number" name="phoneNumber">
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ContactsList
