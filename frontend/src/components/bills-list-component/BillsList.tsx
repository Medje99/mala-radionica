import React, { useState, useEffect, Key } from 'react'
import { Table, Input, Popconfirm, message, Modal, Form, Space, Button, DatePicker, Tooltip, Typography } from 'antd'
import { Link } from 'react-router-dom'
import BillService from '@/service/BillService'
import useGetAllBills from '@/CustomHooks/useGetAllBills'
import { IBillResponse } from '@/model/response/IBillResponse'
import dayjs from 'dayjs'
import { useGlobalContext } from '@/contexts/GlobalContextProvider'
import moment from 'moment'
import ProductsComponent from '../modal-form-parts/test/ProductsComponent'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

const BillsList: React.FC = () => {
  const { setHeaderTitle } = useGlobalContext()
  useEffect(() => {
    setHeaderTitle('Zavrseni poslovi')
  }, [])
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
        bill.firstName?.toString().toLowerCase().includes(searchText) ||
        bill.job_name?.toString().toLowerCase().includes(searchText) ||
        bill.job_description?.toString().toLowerCase().includes(searchText)
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

    message.success('Racun izmenjen uspesno')
  }

  const markAsPaid = async (record: IBillResponse) => {
    const updatedBill = { ...record, paid: true } as IBillResponse
    BillService.updateBill(updatedBill)
    const updatedBills = filteredBills.map((bill) => (bill.bill_id === record.bill_id ? { ...bill, paid: true } : bill))
    setFilteredBills(updatedBills)
    message.success('Racun oznacen kao placen')
  }

  // table colums
  const columns = [
    {
      title: 'Musterija',
      dataIndex: 'firstName',
      key: 'firstName',
    },

    {
      title: 'Naslov posla',
      dataIndex: 'job_name',
      key: 'job_name',
    },
    // {
    //   title: 'Opis posla',
    //   dataIndex: 'job_description',
    //   key: 'job_description',
    // },
    {
      title: 'Datum zavrsetka',
      dataIndex: 'end_date',
      key: 'end_date',
      sorter: (a, b) => {
        if (a.end_date && b.end_date) {
          return new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
        } else {
          return 0 // Handle cases where end_date is null or undefined
        }
      },
      defaultSortOrder: 'ascend', // Set default sort order to new first

      render: (endDate: string | null) => {
        if (endDate) {
          const formattedDate = moment(endDate).fromNow() // Calculate time difference from endDate
          return formattedDate
        } else {
          return 'Nije definisano! ' // Return "N/A" if end_date is null
        }
      },
    },

    {
      title: 'Cena usluge',
      dataIndex: 'labor_cost',
      key: 'labor_cost',
    },
    {
      title: 'Placeno',
      dataIndex: 'paid',
      key: 'paid',
      render: (paid: number, record: IBillResponse) => {
        // Pass 'record' as an argument
        return paid ? (
          <Button type="primary" style={{ backgroundColor: 'green', borderColor: 'green' }}>
            Placeno
          </Button>
        ) : (
          <div className="flex items-center">
            <Popconfirm
              title="Da li ste sigurni da zelite oznaciti kao isplaceno?"
              onConfirm={() => markAsPaid(record)}
              onCancel={() => message.error('Otkazano!')}
              okText="Da"
              cancelText="Ne"
            >
              <Button type="primary" danger>
                Izmiri dug
              </Button>
            </Popconfirm>
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
          <Tooltip title="Izmeni">
            <Button type="primary" ghost onClick={() => handleEdit(record)} key={record.bill_id}>
              <EditOutlined />
            </Button>
          </Tooltip>
          <Popconfirm
            title="Jeste li sigurni da zelite izbrisati ovaj racun?!"
            onConfirm={() => handleDelete(record.bill_id)} // Use bill_id here
            onCancel={() => message.error('Racun izbrisan!')}
            key={record.bill_id + 'delete'} // Add a unique key for the Popconfirm
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
    <div>
      <Input.Search placeholder="Pretrazi racune" onChange={(e) => setSearchTerm(e.target.value)} />

      <Table
        columns={columns}
        dataSource={filteredBills}
        pagination={{ pageSize: 15 }}
        rowKey="job_name"
        expandable={{
          expandedRowRender: (record) => (
            <Typography key={record.job_name} className="text-center py-4 text-lg ">
              Detalji posla: {record.job_description}
            </Typography>
          ),

          rowExpandable: (record) => !!record.job_description,

          columnWidth: 50, // Adjust width as needed
          expandIconColumnIndex: 2, // Index of the taskName column
        }}
      />

      <Modal title="Izmeni racun" open={isModalOpen} onOk={handleSave} onCancel={() => setIsModalOpen(false)}>
        <Form
          form={FormBillList}
          layout="vertical"
          initialValues={{
            end_date: FormBillList.getFieldValue('end_date'),
          }}
        >
          <Form.Item label="Završetak" name="end_date" rules={[{ required: false }]}>
            <Space direction="vertical">
              <DatePicker
                showTime={{ minuteStep: 15 }}
                format="MMM-DD HH:mm"
                name="end_date"
                defaultOpenValue={dayjs(FormBillList.getFieldValue('end_date'))}
                onChange={(date) => FormBillList.setFieldValue('end_date', date)}
              />
            </Space>
          </Form.Item>
          <Form.Item
            label="Cena usluge"
            name="labor_cost"
            rules={[{ required: true, message: 'Molimo unesite cenu usluge' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ukupna cena"
            name="total_cost"
            rules={[{ required: false, message: 'Please enter the total cost' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item label="Uportrebljeni materijal" name="products_used" rules={[{ required: false }]}>
            <ProductsComponent />
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
