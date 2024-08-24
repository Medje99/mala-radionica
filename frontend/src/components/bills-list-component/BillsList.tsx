import React, { useState, useEffect, Key } from 'react'
import { Table, Typography, Input, Popconfirm, message, Modal, Form, Space, Button, DatePicker } from 'antd'
import { Link } from 'react-router-dom'
import BillService from '@/service/BillService'
import useGetAllBills from '@/CustomHooks/useGetAllBills'
import moment from 'moment'
import { IBillResponse } from '@/model/response/IBillResponse'
import dayjs from 'dayjs'

const BillsList: React.FC = () => {
  const { bills } = useGetAllBills()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredBills, setFilteredBills] = useState<IBillResponse[]>([])
  const [editingBill, setEditingBill] = useState<IBillResponse>({} as IBillResponse)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [FormBillList] = Form.useForm<IBillResponse>()
  useEffect(() => {
    setFilteredBills(bills)
    const filtered = bills.filter((bill) => {
      const searchText = searchTerm.toLowerCase()
      return (
        bill.firstName?.toString().includes(searchText) ||
        bill.job_name?.toString().includes(searchText) ||
        bill.labor_cost?.toString().includes(searchText)
      )
    })
    setFilteredBills(filtered)
  }, [searchTerm, bills])

  const handleEdit = (record: IBillResponse) => {
    setEditingBill(record)
    FormBillList.setFieldsValue(record)
    setIsModalOpen(true)
  }

  const handleDelete = (bill_id: number) => {
    message.success('Bill deleted successfully')
    BillService.deleteBill(bill_id)
    setFilteredBills(filteredBills.filter((bill) => bill.bill_id !== bill_id))
  }

  const handleSave = async () => {
    const values = await FormBillList.validateFields()
    const updatedBill = { ...editingBill, ...values } as IBillResponse
    BillService.updateBill(updatedBill)
    const updatedBills = filteredBills.map((bill) =>
      bill.bill_id === editingBill.bill_id ? { ...bill, ...values } : bill,
    )
    setFilteredBills(updatedBills)
    setIsModalOpen(false)

    message.success('Bill updated successfully')
  }

  // table colums
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
          const formattedDate = moment(endDate).format('DD/MM/YYYY/ HH:mm') // Calculate time difference from endDate
          return formattedDate
        } else {
          return 'N/A' // Return "N/A" if end_date is null
        }
      },
    },

    {
      title: 'Cena usluge',
      dataIndex: 'labor_cost',
      key: 'labor_cost',
    },
    {
      title: 'Paid',
      dataIndex: 'paid',
      key: 'paid',
      render: (paid: number) => {
        return paid ? (
          'PLACENO'
        ) : (
          <div className="flex items-center">
            <p className="mr-2">Nije placeno</p>
            <Button>Naplata</Button>
          </div>
        )
      },

      filters: [
        { text: 'Placeni', value: 1 },
        { text: 'Ne placeni', value: 0 },
      ],
      onFilter: (value: boolean | Key, record: IBillResponse) => {
        return record.paid === value // Parse value to number for comparison
      },
    },
    {
      title: 'Actions',
      key: 'action',
      render: (record: IBillResponse) => (
        <Space size="large">
          <Button type="primary" ghost onClick={() => handleEdit(record)} key={record.bill_id}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this bill?"
            onConfirm={() => handleDelete(record.bill_id)} // Use bill_id here
            onCancel={() => message.error('Delete canceled')}
            key={record.bill_id + 'delete'} // Add a unique key for the Popconfirm
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
        <Form
          form={FormBillList}
          layout="vertical"
          initialValues={{
            end_date: FormBillList.getFieldValue('end_date'),
          }}
        >
          <Form.Item
            label="End Date"
            name="end_date"
            rules={[{ required: true, message: 'Please enter the end date' }]}
          >
            <Space direction="vertical">
              <DatePicker
                showTime={{ minuteStep: 15 }}
                format="MMM-DD HH:mm"
                name="end_date"
                defaultOpenValue={dayjs(FormBillList.getFieldValue('end_date'))}
                defaultValue={dayjs(FormBillList.getFieldValue('end_date'))}
                onChange={(date) => FormBillList.setFieldValue('end_date', date)}
              />
            </Space>
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
            rules={[{ required: false, message: 'Please enter the total cost' }]}
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
