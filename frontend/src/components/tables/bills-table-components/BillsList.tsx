import React, { useState, useEffect, Key } from 'react'
import { Table, Input, Popconfirm, message, Modal, Form, Space, Button, Tooltip, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { IBillResponse } from '@/model/response/IBillResponse'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { firstName, taskName, endDate, laborCost, total_cost, parts_cost, lastName } from './contants'
import { useGlobalContext } from '@/components/GlobalContextProvider'
import { useGetAllBills, markAsPaid, handleEdit, handleDelete } from './actions'

const BillsList: React.FC = () => {
  const { setHeaderTitle, currentTask, setCurrentTask } = useGlobalContext() // working on edditing
  useEffect(() => {
    setHeaderTitle('Zavrseni poslovi')
  }, [])
  const { bills } = useGetAllBills()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredBills, setFilteredBills] = useState<IBillResponse[]>([])
  // const [editingBill, setEditingBill] = useState<IBillResponse>({} as IBillResponse) //working on edditing
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const [FormBillList] = Form.useForm<IBillResponse>()

  useEffect(() => {
    setFilteredBills(bills)
    const filtered = bills.filter((bill) => {
      const searchText = searchTerm.toLowerCase()
      return (
        bill.firstName?.toString().toLowerCase().includes(searchText) ||
        bill.lastName?.toString().toLowerCase().includes(searchText) ||
        bill.job_name?.toString().toLowerCase().includes(searchText) ||
        bill.job_description?.toString().toLowerCase().includes(searchText)
      )
    })
    setFilteredBills(filtered)
  }, [searchTerm, bills])

  const columns = [
    firstName,
    lastName,
    taskName,
    Table.EXPAND_COLUMN,
    endDate,
    laborCost,
    parts_cost,
    total_cost,

    //mark as paid
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
              onConfirm={() => markAsPaid(record, filteredBills, setFilteredBills)}
              onCancel={() => message.warning('Otkazano!')}
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
    //actions
    {
      align: 'center',
      title: 'Actions',
      key: 'action',
      render: (record: IBillResponse) => (
        <Space size="large">
          {/* <Tooltip title="Izmeni">
            <Button
              type="primary"
              ghost
              onClick={() => handleEdit(record, setEditingBill, setCurrentTask, FormBillList, setIsModalOpen)}
              key={record.bill_id}
            >
              <EditOutlined />
            </Button>
          </Tooltip> */}
          <Popconfirm
            title="Jeste li sigurni da zelite izbrisati ovaj racun?!"
            onConfirm={() => handleDelete(record.bill_id, setFilteredBills)}
            onCancel={() => message.warning('Radnja otkazana!')}
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
    <div className=" flex-row bill  overflow-y-auto h-[calc(100vh-6rem)]  ">
      <Space id="search-container" className="">
        <Input
          className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm"
          type="text"
          aria-label="Pretrazi racune"
          placeholder="Pretrazi racune"
          id="search"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Space>

      {/* BillTable container */}
      <section className="mx-24">
        <Table
          className="p-7 mt-5 rounded-xl"
          size="small"
          columns={columns} // it doesnt like   defaultSortOrder in combination with custom sorter
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
                    <Typography className="text-lg">
                      <strong>Upotrebljeni delovi:</strong>

                      <ul>
                        {record?.products_used.map((part) => (
                          <li key={part?.product_id}>
                            {part?.quantity + ' x'} {part?.manufacturer} {part?.name}{' '}
                            {'(' + part?.total_price / part?.quantity + 'RSD)'}
                            <strong>{' =' + part?.total_price + ' RSD'}</strong>
                          </li>
                        ))}
                      </ul>
                    </Typography>
                  </div>
                )}
              </div>
            ),
            rowExpandable: (record) => !!record.job_description || record.products_used?.length > 0,
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

      {filteredBills?.length === 0 && (
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
