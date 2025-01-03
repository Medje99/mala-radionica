import React, { useState, useEffect } from 'react'
import { Table, Input, Popconfirm, message, Modal, Form, Space, Button, Tooltip } from 'antd'
import { IContactsResponse } from '@/model/response/IContactResponse'
import { useGlobalContext } from '../../GlobalContextProvider'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { contact_city, contact_firstName, contact_lastName, contact_phoneNumber } from './constants'
import { handleEdit, handleDelete, handleSave, useGetAllContacts } from './actions' // Import actions

const ContactsList: React.FC = () => {
  const { setHeaderTitle } = useGlobalContext()
  useEffect(() => {
    setHeaderTitle('Kontakti')
  }, [])
  //set title header

  const { contacts } = useGetAllContacts()
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

  const actions = {
    title: 'Radnje',
    align: 'center',
    key: 'action',
    render: (record: IContactsResponse) => (
      <Space size="large" className="flex justify-center lg:gap-12 gap-2">
        <Tooltip title="Izmeni">
          <Button
            type="primary"
            ghost
            onClick={() => handleEdit(record, setEditingContact, FormContactList, setIsModalOpen)}
          >
            <EditOutlined />
          </Button>
        </Tooltip>
        <Popconfirm
          title="Da li ste sigurni da zelite izbrisati ovaj kontakt?"
          onConfirm={() => handleDelete(record.id, filteredContacts, setFilteredContacts)}
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
  const columns = [contact_firstName, contact_lastName, contact_city, contact_phoneNumber, actions]

  return (
    <div className=" flex-row contact h-[calc(100vh-6rem)] bg-gradient-to-r from-orange-400 to-rose-400">
      <Space id="search-container" className="col-span-12 flex ">
        <Input.Search
          size="large"
          placeholder="Pretraži kontakte"
          onChange={(e) => setSearchTerm(e.target.value)}
          id="search"
        />
      </Space>
      {/* //search */}
      <section className="w-full lg:px-24 ">
        <Table
          size="small"
          columns={columns} //don't like align center
          dataSource={filteredContacts}
          pagination={{ pageSize: 14 }} // Adjust page size as needed
          rowKey="id" // Use 'id' as the row key
          className="lg:p-7 mt-5 rounded-xl"
        />
      </section>
      <Modal
        title="Uredi kontakt"
        className="flex"
        open={isModalOpen}
        onOk={() => handleSave(FormContactList, editingContact, filteredContacts, setFilteredContacts, setIsModalOpen)}
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
