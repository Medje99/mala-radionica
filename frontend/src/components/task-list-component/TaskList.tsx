import { useState, useEffect } from 'react'
import { ITaskResponse } from '@/model/response/ITaskResponse'
import { Table, Input, Popconfirm, message, Modal, Form, Space, Button, Tooltip, Typography } from 'antd'
import { customer_firstName, customer_lastName, taskName, creation_date } from './constants'
import useGetUnfinishedTasks from '@/CustomHooks/useGetUnfinishedTasks'
import TasksAdvancedActions from './actions'
import CreateBillForm from '../forms/CreateBillForm' // Import CreateBillForm
import { ICustomerContact, useGlobalContext } from '@/contexts/GlobalContextProvider'
import { DeleteOutlined, EditOutlined, FileDoneOutlined } from '@ant-design/icons'

export const TasksList = () => {
  const { setContextCustomer: setCustomerContact, setCurrentTask, setHeaderTitle } = useGlobalContext()
  const { UnfinishedOnes } = useGetUnfinishedTasks()
  const { handleEdit, handleDelete, handleSave } = TasksAdvancedActions()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTasks, setFilteredTasks] = useState<ITaskResponse[]>([])
  const [editingTask, setEditingTask] = useState<ITaskResponse>({} as ITaskResponse)
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const { modalIsOpen, setModalIsOpen } = useGlobalContext()

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
                setCurrentTask({
                  task_id: record.id,
                  task_name: record.job_name,
                })
                setCurrentTask({
                  task_id: record.id,
                })
                setModalIsOpen(true)
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
        onOk={() => handleSave(FormTaskList, editingTask, filteredTasks, setFilteredTasks, setEditModalOpen)}
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
        </Form>
      </Modal>

      {/* Bill Modal */}
      <Modal
        open={modalIsOpen}
        onCancel={() => setModalIsOpen(false)}
        footer={null}
        closeIcon={null}
        className="billModal"
      >
        <CreateBillForm />
      </Modal>
      <Space id="search-container" className="w-full col-span-12 flex task ">
        <Input.Search
          id="search"
          size="large"
          placeholder="Pretrazi poslove"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Space>
      <section className="w-full px-24 task">
        <Table
          className="task  ml-12 mr-12 mt-6 p-2 rounded-xl"
          size="small"
          id="tableContainer"
          virtual
          scroll={{ y: 500 }}
          pagination={{ hideOnSinglePage: true, pageSize: 10000 }}
          columns={columns}
          expandable={{
            expandedRowRender: (record) => (
              <Typography key={record.id} className="text-center ">
                {record.job_description}
              </Typography>
            ),

            rowExpandable: (record) => !!record.job_description,
            columnWidth: 50, // Adjust width as needed
          }}
          dataSource={filteredTasks}
          rowKey="id"
        />
      </section>
      {/* 
    tableclose */}
    </div>
  )
}

export default TasksList
