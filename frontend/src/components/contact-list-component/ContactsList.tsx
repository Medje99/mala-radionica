import React, { useState, useEffect } from 'react'
import {
  Table,
  Typography,
  Input,
  Popconfirm,
  message,
  Modal,
  Form,
  Space,
  Button,
} from 'antd'
import { Link } from 'react-router-dom'
import { IContacts } from '@/model/response/IContactResponse'
import useGetAllContacts from '@/CustomHooks/useGetAllContants'
import ContactService from '@/service/ContactsService'

const ContactsList: React.FC = () => {
  const { customers: contacts } = useGetAllContacts()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredContacts, setFilteredContacts] = useState<IContacts[]>([])
  const [editingContact, setEditingContact] = useState<IContacts>(
    {} as IContacts
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm<IContacts>()

  useEffect(() => {
    const filtered = contacts.filter((contact) => {
      const searchText = searchTerm.toLowerCase()
      return (
        contact.firstName.toLowerCase().includes(searchText) ||
        contact.lastName.toLowerCase().includes(searchText) ||
        contact.city.toLowerCase().includes(searchText) ||
        contact.phoneNumber.toLowerCase().includes(searchText)
      )
    })
    setFilteredContacts(filtered)
  }, [searchTerm, contacts])

  const handleEdit = (record: IContacts) => {
    setEditingContact(record)
    form.setFieldsValue(record)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    message.success('Contact deleted successfully')
    ContactService.deleteContactCustomer(id)
    setFilteredContacts(filteredContacts.filter((contact) => contact.id !== id))
  }

  const handleSave = async () => {
    const values = await form.validateFields()
    const updatedProduct = { ...editingContact, ...values } as IContacts
    ContactService.updateContactCustomer(updatedProduct)
    const updatedContacts = filteredContacts.map((contact) =>
      contact.id === editingContact.id ? { ...contact, ...values } : contact
    )
    setFilteredContacts(updatedContacts)
    setIsModalOpen(false)

    message.success('Contact updated successfully')
  }

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Actions',
      key: 'action',
      render: (record: IContacts) => (
        <Space size="large">
          <Button type="primary" ghost onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this contact?"
            onConfirm={() => handleDelete(record.id)}
            onCancel={() => message.error('Delete canceled')}
          >
            <Button danger ghost>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Typography.Title level={1} className="mb-2">
        Contacts:
      </Typography.Title>
      <hr />

      <Input.Search
        placeholder="Search contacts"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      <Table
        columns={columns}
        dataSource={filteredContacts}
        pagination={{ pageSize: 7 }}
        rowKey="id"
      />

      <Modal
        title="Edit Contact"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
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
            rules={[{ required: true, message: 'Please enter the last name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: 'Please enter the city' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: 'Please enter the phone number' },
            ]}
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
