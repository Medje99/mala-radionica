import React, { useState, useEffect, Key, lazy } from 'react'
import { Table, Input, Popconfirm, message, Modal, Form, Space, Button, DatePicker, Tooltip, Typography } from 'antd'
import { Link } from 'react-router-dom'
import BillService from '@/service/BillService'
import useGetAllBills from '@/CustomHooks/useGetAllBills'
import { IBillResponse } from '@/model/response/IBillResponse'
import dayjs from 'dayjs'
import { useGlobalContext } from '@/contexts/GlobalContextProvider'
import moment from 'moment'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { firstName, taskName, endDate, laborCost, total_cost, parts_cost } from './contants'

const BillsList: React.FC = () => {
  const { setHeaderTitle, currentTask, setCurrentTask } = useGlobalContext()
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
    setCurrentTask(record)
    FormBillList.setFieldsValue(record)
    setIsModalOpen(true)
  }

  const handleDelete = async (bill_id: number) => {
    try {
      await BillService.deleteBill(bill_id)
      setFilteredBills(filteredBills.filter((bill) => bill.bill_id !== bill_id))
      message.success('Racun izbrisan uspesno!')
    } catch (error) {
      message.error('Greška prilikom brisanja racuna! Kontaktirajte administratora.')
    }
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
    firstName,
    taskName,
    Table.EXPAND_COLUMN,
    endDate,
    laborCost,
    parts_cost,
    total_cost,
    {
      align: 'center',
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
          <>
            <Popconfirm
              key={record.bill_id}
              title="Da li ste sigurni da zelite oznaciti kao isplaceno?"
              onConfirm={() => markAsPaid(record)}
              onCancel={() => message.error('Otkazano!')}
              okText="Da"
              cancelText="Ne"
              okButtonProps={{ style: { background: 'green' } }}
              cancelButtonProps={{ style: { background: 'red' } }}
            >
              <Button type="primary" danger>
                Izmiri dug
              </Button>
            </Popconfirm>
          </>
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
      align: 'center',
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
            onConfirm={() => handleDelete(record.bill_id)}
            onCancel={() => message.error('Racun izbrisan!')}
            key={record.bill_id}
            cancelButtonProps={{ style: { background: 'red' } }}
            okButtonProps={{ style: { background: 'green' } }}
            cancelText="Ne"
            okText="Da"
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
    <div className=" flex-row bill  overflow-y-auto h-[calc(100vh-4rem)]  ">
      <Space id="search-container" className="w-full col-span-12 flex bill ">
        <Input.Search placeholder="Pretrazi racune" onChange={(e) => setSearchTerm(e.target.value)} id="search" />
      </Space>
      <section className="px-24 bill">
        <Table
          className="bill ml-12 mr-12  p-2 rounded-xl center-table-content "
          size="small"
          columns={columns}
          // it doesnt like   defaultSortOrder in combination with custom sorter timewaste
          dataSource={filteredBills}
          pagination={{ pageSize: 14 }}
          rowKey="bill_id"
          expandable={{
            expandedRowRender: (record, index) => (
              <div key={index} className="bill flex flex-col items-center p-4">
                {record?.job_description && (
                  <Typography className="text-lg">
                    <strong>Detalji posla:</strong> {record?.job_description}
                  </Typography>
                )}
                {record?.products_used?.length > 0 && (
                  <div>
                    <Typography className="text-lg mt-2">
                      <strong>Upotrebljeni delovi:</strong>
                    </Typography>
                    <ul>
                      {record?.products_used.map((part) => (
                        <li key={part?.product_id}>
                          {part?.quantity + ' x'} {part?.manufacturer} {part?.name}{' '}
                          {'(' + part?.total_price / part?.quantity + 'RSD)'}
                          <strong>{' =' + part?.total_price + ' RSD'}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ),
            rowExpandable: (record) => !!record.job_description || record.products_used.length > 0,
            columnWidth: 50,
          }}
        />
      </section>

      <Modal
        title="Izmeni racun"
        className="flex"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        // onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
      >
        <Typography className="text-center m-20">Poslovi u toku,stize uskoro!</Typography>
        {/* <Form
          form={Form.useForm<IBillResponse>()[0]}
          layout="vertical"
          initialValues={{
            labor_cost: editingBill.labor_cost,
            end_date: currentTask.end_date ? dayjs(currentTask.end_date) : dayjs(moment().toDate()),
            job_name: editingBill.job_name,
          }}
        >
          <Form.Item name="job_name" label="Naslov posla">
            <Input />
          </Form.Item>

          <Form.Item label="Završetak" name="end_date" rules={[{ required: false }]}>
            <Space direction="vertical">
              <DatePicker
                showTime={{ minuteStep: 15 }}
                format="MMM-DD HH:mm"
                name="end_date"
                //FormBillList loads after this fields so that is why this is throwing error they are connected later
                defaultOpenValue={dayjs(FormBillList.getFieldValue('end_date'))}
                defaultValue={dayjs(FormBillList.getFieldValue('end_date'))}
                defaultPickerValue={dayjs(FormBillList.getFieldValue('end_date'))}
                onChange={(date) => FormBillList.setFieldValue('end_date', date)}
              />
            </Space>
          </Form.Item>
          <Form.Item
            label="Cena usluge"
            name="labor_cost"
            rules={[{ required: true, message: 'Molimo unesite cenu usluge' }]}
          >
            <Input name="labor_cost" type="number" />
          </Form.Item>
          <Form.Item
            label="Ukupna cena"
            name="total_cost"
            rules={[{ required: false, message: 'Please enter the total cost' }]}
          >
            <Input disabled />
          </Form.Item>
          {/* <SelectProductsComponent /> 
          </Form>*/}
      </Modal>

      {filteredBills.length === 0 && (
        <Link to="/Tasks" className="text-center">
          <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
            Add Bill
          </h1>
        </Link>
      )}
    </div>
  )
}

export default BillsList
