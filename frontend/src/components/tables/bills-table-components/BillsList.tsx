import React, { useState, useEffect, Key } from 'react'
import { Table, Input, Popconfirm, message, Modal, Form, Space, Button, Tooltip, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { IBillResponse } from '@/model/response/IBillResponse'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { firstName, taskName, endDate, laborCost, total_cost, parts_cost, lastName } from './contants'
import { useGlobalContext } from '@/components/GlobalContextProvider'
import { useGetAllBills, markAsPaid, handleEdit, handleDelete } from './actions'
import { Card} from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

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

  const [currentFilter, setCurrentFilter] = useState<number | null>(null);
  const [totalCost, setTotalCost] = useState<number>(0);  
  const handlePrintUnpaidBills = () => {
    const unpaidBills = filteredBills.filter((bill) => !bill.paid);
  
    if (unpaidBills.length === 0) {
      message.warning("Nema neplaćenih računa za štampu.");
      return;
    }
  
    // Izračunavanje ukupne cene neplaćenih računa
    const totalUnpaidCost = unpaidBills.reduce((sum, bill) => sum + (bill.total_cost || 0), 0);
  
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
  
    printWindow.document.write(`
      <html>
        <head>
          <title>Neplaćeni računi</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { font-weight: bold; font-size: 18px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h2>Lista neplaćenih računa</h2>
          <table>
            <thead>
              <tr>
                <th>Ime</th>
                <th>Prezime</th>
                <th>Posao</th>
                <th>Datum završetka</th>
                <th>Cena usluge (RSD)</th>
                <th>Ukupna cena (RSD)</th>
              </tr>
            </thead>
            <tbody>
              ${unpaidBills
                .map(
                  (bill) => `
                  <tr>
                    <td>${bill.firstName}</td>
                    <td>${bill.lastName}</td>
                    <td>${bill.job_name}</td>
                    <td>${bill.end_date}</td>
                    <td>${bill.labor_cost}</td>
                    <td>${bill.total_cost}</td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>
          <p class="total">Ukupna cena neplaćenih računa: <strong>${totalUnpaidCost.toFixed(2)} RSD</strong></p>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };
  
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

  useEffect(() => {
    let calculatedTotal = 0;
  
    if (currentFilter === 1) {
      // Calculate total for "Placeno" (paid) bills
      calculatedTotal = filteredBills
        .filter((bill) => bill.paid == true)
        .reduce((sum, bill) => sum + (bill.total_cost || 0), 0);
    } else if (currentFilter === 0) {
      // Calculate total for "Neplaceno" (unpaid) bills
      calculatedTotal = filteredBills
        .filter((bill) => bill.paid == false)
        .reduce((sum, bill) => sum + (bill.total_cost || 0), 0);
    } else {
      // Calculate total for all bills (no filter selected)
      calculatedTotal = filteredBills.reduce((sum, bill) => sum + (bill.total_cost || 0), 0);
    }
  
    setTotalCost(calculatedTotal); // Update the total cost state
  }, [filteredBills, currentFilter]);

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
      filtersChange: [
        { text: 'Placeni', value: true },
        { text: 'Ne placeni', value: false },
      ],
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
        setCurrentFilter(value as number);
        return record.paid === value // Parse value to number for comparison
      },
    },
    //actions
    {
      align: 'center',
      title: 'Radnje',
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
    <div className=" flex-row bill  overflow-y-auto h-[calc(100vh-6rem)] bg-gradient-to-r from-teal-400 to-gray-800 ">
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
      <section className="lg:mx-24">
        <Table
              scroll={{ x: 'max-content' }}
          className="lg:p-7 mt-5 rounded-xl"
          size="small"
          columns={columns} // it doesnt like   defaultSortOrder in combination with custom sorter
          dataSource={filteredBills}
          pagination={{ pageSize: 15 }}
          rowKey="bill_id"
          onChange={(pagination, filtersChange) => {
            // Handle filter reset
            if (filtersChange.paid === null || filtersChange.paid === undefined) {
              setCurrentFilter(null); // Reset the filter state
            }
          }}
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

      <div className="lg:mx-24 mt-4">
        <Card className="bg-gradient-to-r from-black-500 to-purple-500 border-2 border-blue-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-5">
          <Typography className="text-lg font-bold text-center text-white">
            {currentFilter === 1 ? (
              <>
                <CheckCircleOutlined className="text-green-300 mr-2" />
                Ukupna cena plaćenih računa: <span className="text-green-300">{totalCost.toFixed(2)} RSD</span>
              </>
            ) : currentFilter === 0 ? (
              <>
                <CloseCircleOutlined className="text-red-300 mr-2" />
                Ukupna cena neplaćenih računa: <span className="text-red-300">{totalCost.toFixed(2)} RSD</span>
              </>
            ) : (
              `Ukupna cena svih računa: ${totalCost.toFixed(2)} RSD`
            )}
          </Typography>
          <div className="mt-4 flex justify-center">
            <Button 
              type="primary" 
              onClick={() => {
                const unpaidBills = filteredBills.filter((bill) => !bill.paid);
                if (unpaidBills.length === 0) {
                  message.warning("Nema neplaćenih računa za štampu.");
                  return;
                }
                const totalUnpaidCost = unpaidBills.reduce((sum, bill) => sum + (bill.total_cost || 0), 0);
                const printWindow = window.open("", "_blank");
                if (!printWindow) return;
                printWindow.document.write(`
                  <html>
                    <head>
                      <title>Neplaćeni računi</title>
                      <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid black; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .total { font-weight: bold; font-size: 18px; margin-top: 20px; }
                      </style>
                    </head>
                    <body>
                      <h2>Lista neplaćenih računa</h2>
                      <table>
                        <thead>
                          <tr>
                            <th>Ime</th>
                            <th>Prezime</th>
                            <th>Posao</th>
                            <th>Detalji posla</th>
                            <th>Datum završetka</th>
                            <th>Cena usluge (RSD)</th>
                            <th>Ukupna cena (RSD)</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${unpaidBills
                            .map(
                              (bill) => `
                              <tr>
                                <td>${bill.firstName}</td>
                                <td>${bill.lastName}</td>
                                <td>${bill.job_name}</td>
                                <td>${bill.job_description || "Nema opisa"}</td>
                                <td>${bill.end_date}</td>
                                <td>${bill.labor_cost}</td>
                                <td>${bill.total_cost}</td>
                              </tr>
                            `
                            )
                            .join("")}
                        </tbody>
                      </table>
                      <p class="total">Ukupna cena neplaćenih računa: <strong>${totalUnpaidCost.toFixed(2)} RSD</strong></p>
                      <script>
                        window.onload = function() { window.print(); }
                      </script>
                    </body>
                  </html>
                `);
                printWindow.document.close();
              }}
              className="bg-white text-blue-600 border-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-300"
            >
              Štampaj neplaćene račune
            </Button>
          </div>
        </Card>
      </div>


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
