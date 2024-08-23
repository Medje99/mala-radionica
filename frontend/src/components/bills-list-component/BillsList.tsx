import React, { useState, useEffect } from 'react'
import { Table, Typography, Input, Popconfirm, message, Modal, Form, Space, Button } from 'antd'
import { Link } from 'react-router-dom'
import BillService, { IBillResponse } from '@/service/BillService'
import useGetAllBills from '@/CustomHooks/useGetAllBills'
import moment from 'moment'

const BillsList: React.FC = () => {
  const { bills } = useGetAllBills()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredBills, setFilteredBills] = useState<IBillResponse[]>([])
  const [editingBill, setEditingBill] = useState<IBillResponse>({} as IBillResponse)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm<IBillResponse>()

  useEffect(() => {
    const filtered = bills.filter((bill) => {
      const searchText = searchTerm.toLowerCase()
      return (
        bill.contact_id.toString().includes(searchText) ||
        bill.job_id.toString().includes(searchText) ||
        bill.parts_cost?.toString().includes(searchText)
      )
    })
    setFilteredBills(filtered)
  }, [searchTerm, bills])

  const handleEdit = (record: IBillResponse) => {
    setEditingBill(record)
    form.setFieldsValue(record)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    message.success('Bill deleted successfully')
    BillService.deleteBill(id)
    setFilteredBills(filteredBills.filter((bill) => bill.id !== id))
  }

  const handleSave = async () => {
    const values = await form.validateFields()
    const updatedBill = { ...editingBill, ...values } as IBillResponse
    BillService.updateBill(updatedBill)
    const updatedBills = filteredBills.map((bill) => (bill.id === editingBill.id ? { ...bill, ...values } : bill))
    setFilteredBills(updatedBills)
    setIsModalOpen(false)

    message.success('Bill updated successfully')
  }

  const columns = [
    {
      title: 'Contact name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Job name',
      dataIndex: 'job_name',
      key: 'job_name',
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (endDate: string | null) => {
        if (endDate) {
          const formattedDate = moment(endDate).format('MMM Do YY') // Calculate time difference from endDate
          return formattedDate
        } else {
          return 'N/A' // Return "N/A" if end_date is null
        }
      },
    },

    {
      title: 'Parts and Labor Cost',
      dataIndex: 'parts_cost',
      key: 'parts_cost',
    },
    {
      title: 'Paid',
      dataIndex: 'paid',
      key: 'paid',

      filters: [
        { text: 'Placeni', value: 1 },
        { text: 'Ne placeni', value: 0 },
      ],
      onFilter: (value: any, record: any) => {
        return record.paid === parseInt(value, 10) // Parse value to number for comparison
      },
    },
    {
      title: 'Actions',
      key: 'action',
      render: (record: IBillResponse) => (
        <Space size="large">
          <Button type="primary" ghost onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this bill?"
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
        Bills:
      </Typography.Title>
      <hr />

      <Input.Search
        placeholder="Search bills"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      <Table columns={columns} dataSource={filteredBills} pagination={{ pageSize: 7 }} rowKey="bill_id" />

      <Modal title="Edit Bill" open={isModalOpen} onOk={handleSave} onCancel={() => setIsModalOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item
            label="Contact ID"
            name="contact_id"
            rules={[{ required: true, message: 'Please enter the contact ID' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Job ID" name="job_id" rules={[{ required: true, message: 'Please enter the job ID' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="End Date"
            name="end_date"
            rules={[{ required: true, message: 'Please enter the end date' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Labor Cost"
            name="labor_cost"
            rules={[{ required: true, message: 'Please enter the labor cost' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Total Cost"
            name="total_cost"
            rules={[{ required: true, message: 'Please enter the total cost' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Products Used"
            name="products_used"
            rules={[{ required: true, message: 'Please enter the products used' }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      {filteredBills.length === 0 && (
        <Link to="/BillCreate" className="text-center">
          <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
            Add Bill
          </h1>
        </Link>
      )}
    </div>
  )
}

export default BillsList
