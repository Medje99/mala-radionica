import { useState, useEffect } from 'react'
import { ITaskResponse } from '@/model/response/ITaskResponse'
import { Table, Input, Popconfirm, message, Modal, Form, Space, Button, Tooltip, Typography } from 'antd'
import { customer_firstName, customer_lastName, taskName, creation_date } from './constants'
import useGetUnfinishedTasks from '@/CustomHooks/useGetUnfinishedTasks'
import TasksActions from './actions'
import CreateBillForm from '../forms/CreateBillForm' // Import CreateBillForm
import { ICustomerContact, useGlobalContext } from '@/contexts/GlobalContextProvider'
import { CloseOutlined, DeleteOutlined, EditOutlined, FileDoneOutlined } from '@ant-design/icons'

export const TasksList = () => {
  const { setContextCustomer: setCustomerContact, setCurrentTask, setHeaderTitle } = useGlobalContext()
  const { UnfinishedOnes } = useGetUnfinishedTasks()
  const { handleEdit, handleDelete, handleSave } = TasksActions()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTasks, setFilteredTasks] = useState<ITaskResponse[]>([])
  const [editingTask, setEditingTask] = useState<ITaskResponse>({} as ITaskResponse)
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [billModalOpen, setBillModalOpen] = useState(false)

  const closeBillModal = () => {
    setBillModalOpen(false)
  }

  //Task set title
  useEffect(() => {
    setHeaderTitle('Aktivni poslovi')
  }, [])

  const [FormTaskList] = Form.useForm<ITaskResponse>()

  ////Task update list on search/product change main useEffect in UnfinishedOnes !
  useEffect(() => {
    if (UnfinishedOnes) {
      const filtered = UnfinishedOnes.filter((task) => {
        const searchText = searchTerm.toLowerCase()
        return (
          task.job_name?.toLowerCase().includes(searchText) ||
          task.job_description?.toLowerCase().includes(searchText) ||
          task.firstName?.toLowerCase().includes(searchText) ||
          task.job_description?.toLowerCase().includes(searchText) ||
          task.lastName?.toLowerCase().includes(searchText)
        )
      })
      setFilteredTasks(filtered)
    }
  }, [searchTerm, UnfinishedOnes])

  //Columns imported clean
  const columns = [
    customer_firstName,
    customer_lastName,
    taskName,
    Table.EXPAND_COLUMN,
    creation_date,

    //Actions column
    {
      title: <div className="text-">Radnje</div>,
      key: 'action',
      width: 60,
      align: 'center',

      render: (record: ITaskResponse) => (
        <Space className="gap-1 flex justify-center mr-10 items-center ">
          <Tooltip title="Izmeni">
            <Button
              type="primary"
              ghost
              onClick={() => handleEdit(record, setEditingTask, FormTaskList, setEditModalOpen)}
            >
              <EditOutlined />
            </Button>
          </Tooltip>

          <Popconfirm
            title="Da li ste sigurni da zelite izbrisati ovaj posao?"
            onConfirm={() => handleDelete(record.id, filteredTasks, setFilteredTasks)}
            onCancel={() => message.error('Delete canceled')}
            okText="Da"
            cancelText="Ne!"
            okButtonProps={{ style: { background: 'green' } }}
            cancelButtonProps={{ style: { background: 'red' } }}
          >
            <Tooltip title="Obrisi">
              <Button danger ghost>
                <DeleteOutlined />
              </Button>
            </Tooltip>
          </Popconfirm>
          <Tooltip title="Naplata">
            <Button
              type="primary"
              ghost
              onClick={() => {
                setCustomerContact({
                  id: record.contact_id,
                  fullName: `${record.firstName} ${record.lastName}`,
                } as ICustomerContact)
                setCurrentTask({
                  task_id: record.id,
                  task_name: record.job_name,
                })
                setBillModalOpen(true)
              }}
            >
              <FileDoneOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <div className=" flex-row task ">
      {/*edit FormTaskList*/}

      <Modal
        open={isEditModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
        closeIcon={null}
        title="Izmeni posao :"
        className="flex editModal"
      >
        <Form form={FormTaskList} layout="vertical">
          <Form.Item label="Naziv posla" name="job_name" rules={[{ required: true, message: 'Unesi naziv posla' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Detalji posla" name="job_description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item className="flex justify-center">
            <Button
              className="flex-1 mr-2"
              type="primary"
              onClick={() => handleSave(FormTaskList, editingTask, filteredTasks, setFilteredTasks, setEditModalOpen)}
            >
              Izmeni
            </Button>

            <Button className="flex-1 ml-2" type="primary" onClick={() => setEditModalOpen(false)}>
              Otkazi
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Bill Modal */}
      <Modal
        open={billModalOpen}
        onCancel={() => setBillModalOpen(false)}
        footer={null}
        closeIcon={null}
        title="Izmeni posao :"
        className="flex billModal"
      >
        <CreateBillForm />
      </Modal>

      {/* Task Search Bar */}
      <Space id="search-container" className="w-full col-span-12 flex task ">
        <Input.Search
          id="search"
          size="large"
          placeholder="Pretrazi poslove"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Space>

      {/* task Table */}

      <section className="w-full  flex task">
        <Table
          className="py-10 px-5 rounded-xl"
          // style={{ width: '100%', tableLayout: 'fixed' }}
          id="tableContainer"
          virtual
          scroll={{ y: 600, x: 800 }}
          rowClassName="border-b border-gray-200"
          pagination={false}
          columns={columns}
          expandable={{
            expandedRowRender: (record) => (
              <Typography key={record.id} className="text-center bg-gray-100 border-b border-gray-200 py-4 text-lg">
                {record.job_description}
              </Typography>
            ),

            rowExpandable: (record) => !!record.job_description,
            columnWidth: 20,
          }}
          dataSource={filteredTasks}
          rowKey="id"
        />
      </section>
    </div>
  )
}

export default TasksList
