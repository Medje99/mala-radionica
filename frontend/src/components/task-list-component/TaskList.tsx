import { useState, useEffect } from 'react'
import { ITaskResponse } from '@/model/response/ITaskResponse'
import { Table, Input, Popconfirm, message, Modal, Form, Space, Button, Tooltip, Typography } from 'antd'
import { customer_firstName, customer_lastName, taskName, creation_date } from './constants'
import useGetUnfinishedTasks from '@/CustomHooks/useGetUnfinishedTasks'
import TasksAdvancedActions from './actions'
import CreateBillForm from '../modal-form-parts/CreateBillForm' // Import CreateBillForm
import { ICustomerContact, useGlobalContext } from '@/contexts/GlobalContextProvider'
import { DeleteOutlined, EditOutlined, FileDoneOutlined } from '@ant-design/icons'

export const TasksList = () => {
  const { setCustomerContact, setJob, setHeaderTitle } = useGlobalContext()
  const { UnfinishedOnes } = useGetUnfinishedTasks()
  const { handleEdit, handleDelete, handleSave } = TasksAdvancedActions()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTasks, setFilteredTasks] = useState<ITaskResponse[]>([])
  const [editingTask, setEditingTask] = useState<ITaskResponse>({} as ITaskResponse)
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [isBillModalOpen, setIsBillModalOpen] = useState(false) // State for the bill

  useEffect(() => {
    setHeaderTitle('Aktivni poslovi')
  }, [])

  const [FormTaskList] = Form.useForm<ITaskResponse>()

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

  const columns = [
    customer_firstName,
    customer_lastName,
    taskName,
    creation_date,
    // actions
    {
      title: <div className="text-center flex justify-center">Radnje</div>,
      key: 'action',
      width: 200,

      render: (record: ITaskResponse) => (
        <Space className="gap-2 flex justify-center items-center">
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
            cancelText="Joj ne!"
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
                setJob({
                  task_id: record.id,
                })
                setIsBillModalOpen(true)
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
    <div className=" flex flex-col ">
      {/*edit FormTaskList*/}

      <Modal
        open={isEditModalOpen}
        onOk={() => handleSave(FormTaskList, editingTask, filteredTasks, setFilteredTasks, setEditModalOpen)}
        onCancel={() => setEditModalOpen(false)}
      >
        <Form form={FormTaskList} layout="vertical">
          <Form.Item label="Naziv posla" name="job_name" rules={[{ required: true, message: 'Unesi naziv posla' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Detalji posla" name="job_description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      {/* Bill Modal */}
      <Modal open={isBillModalOpen} onCancel={() => setIsBillModalOpen(false)}>
        <CreateBillForm />
      </Modal>

      <Input.Search
        className="mx-auto w-90"
        size="large"
        placeholder="Pretrazi poslove"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Table
        style={{ width: '96%', margin: 'auto' }}
        virtual
        scroll={{ y: '10vh' }}
        pagination={{ hideOnSinglePage: true, pageSize: 20 }}
        className="pr-20 border-2 border-grey-500 shadow-2xl task"
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <Typography key={record.job_name} className="text-center ">
              {record.job_description}
            </Typography>
          ),

          rowExpandable: (record) => !!record.job_description,

          columnWidth: 50, // Adjust width as needed
          expandIconColumnIndex: 2, // Index of the taskName column
        }}
        dataSource={filteredTasks}
        rowKey="id"
      />
    </div>
  )
}

export default TasksList
