import React, { useState, useEffect } from 'react'
import { Table, Typography, Input, Popconfirm, message, Modal, Form, Space, Button, Tooltip } from 'antd'
import { ErrorResponse, Link } from 'react-router-dom'
import { IContacts } from '@/model/response/IContactResponse'
import useGetAllContacts from '@/CustomHooks/useGetAllContants'
import ContactService from '@/service/ContactsService'
import { useGlobalContext } from '@/contexts/GlobalContextProvider'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { AxiosError } from 'axios'

const ContactsList: React.FC = () => {
  const { setHeaderTitle } = useGlobalContext()
  useEffect(() => {
    setHeaderTitle('Kontakti')
  }, [])
  const { customers: contacts } = useGetAllContacts()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredContacts, setFilteredContacts] = useState<IContacts[]>([])
  const [editingContact, setEditingContact] = useState<IContacts>({} as IContacts)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [FormContactList] = Form.useForm<IContacts>()

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

  const handleEdit = (record: IContacts) => {
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
    const updatedProduct = { ...editingContact, ...values } as IContacts
    ContactService.updateContactCustomer(updatedProduct)
    const updatedContacts = filteredContacts.map((contact) =>
      contact.id === editingContact.id ? { ...contact, ...values } : contact,
    )
    setFilteredContacts(updatedContacts)
    setIsModalOpen(false)

    message.success('Contact updated successfully')
  }

  const columns = [
    {
      title: 'Ime',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Prezime',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Mesto',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Telefon',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: <div className="text-center">Radnje</div>,
      key: 'action',
      render: (record: IContacts) => (
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
          >
            <Tooltip title="Obrisi">
              <Button danger ghost>
                <DeleteOutlined />
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="flex flex-col">
      <Input.Search placeholder="Pretrazi kontakte" onChange={(e) => setSearchTerm(e.target.value)} />

      <Table
        columns={columns}
        dataSource={filteredContacts}
        pagination={{ pageSize: 10 }}
        rowKey="id"
        className=" w-full  mx-auto"
      />

      <Modal title="Uredi kontakt" open={isModalOpen} onOk={handleSave} onCancel={() => setIsModalOpen(false)}>
        <Form form={FormContactList} layout="vertical">
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: 'Please enter the first name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: false, message: 'Please enter the last name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="City" name="city" rules={[{ required: false, message: 'Please enter the city' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: false, message: 'Please enter the phone number' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input />
          </Form.Item>
          <Form.Item label="Other" name="other">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {filteredContacts.length === 0 && (
        <Link to="/ContactCreate" className="text-center">
          <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
            Add Contact
          </h1>
        </Link>
      )}
    </div>
  )
}

export default ContactsList
