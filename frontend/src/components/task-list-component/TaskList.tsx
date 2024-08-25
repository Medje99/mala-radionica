import React, { useState, useEffect } from 'react'
import { ITaskResponse } from '@/model/response/ITaskResponse'
import { Table, Input, Popconfirm, message, Modal, Form, Space, Button } from 'antd'
import { customer_firstName, customer_lastName, taskName, taskDescription, creation_date } from './constants'
import { Link } from 'react-router-dom'
import useGetUnfinishedTasks from '@/CustomHooks/useGetUnfinishedTasks'
import TasksAdvancedActions from './actions'
import CreateBillForm from '../modal-form-parts/CreateBillForm' // Import CreateBillForm
import { ContextProvider, ICustomerContact, useGlobalContext } from '@/contexts/GlobalContextProvider'

const TasksList: React.FC = () => {
  const { setCustomerContact, setJob, modalTitle, setHeaderTitle } = useGlobalContext()
  const { UnfinishedOnes } = useGetUnfinishedTasks()
  const { handleEdit, handleDelete, handleSave } = TasksAdvancedActions()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTasks, setFilteredTasks] = useState<ITaskResponse[]>([])
  const [editingTask, setEditingTask] = useState<ITaskResponse>({} as ITaskResponse)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBillModalOpen, setIsBillModalOpen] = useState(false) // State for the bill modal

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
    taskDescription,
    creation_date,
    {
      title: 'Actions',
      key: 'action',
      render: (record: ITaskResponse) => (
        <Space size="middle">
          <Button type="primary" ghost onClick={() => handleEdit(record, setEditingTask, FormTaskList, setIsModalOpen)}>
            Izmeni
          </Button>
          <Popconfirm
            title="Da li ste sigurni da zelite izbrisati ovaj posao?"
            onConfirm={() => handleDelete(record.id, filteredTasks, setFilteredTasks)}
            onCancel={() => message.error('Delete canceled')}
            okText="Da"
            cancelText="Joj ne!"
          >
            <Button danger ghost>
              Izbrisi
            </Button>
          </Popconfirm>
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
            Naplata
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Input.Search
        placeholder="Search tasks"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      <Table columns={columns} dataSource={filteredTasks} pagination={{ pageSize: 100 }} rowKey="id" />

      <Modal
        title={modalTitle}
        open={isModalOpen}
        onOk={() => handleSave(FormTaskList, editingTask, filteredTasks, setFilteredTasks, setIsModalOpen)}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={FormTaskList} layout="vertical">
          <Form.Item
            label="Job Name"
            name="job_name"
            rules={[{ required: true, message: 'Please enter the job name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Job Description"
            name="job_description"
            rules={[{ required: true, message: 'Please enter the job description' }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      {/* Bill Modal */}
      <Modal
        title={modalTitle}
        open={isBillModalOpen}
        onCancel={() => setIsBillModalOpen(false)}
        footer={null} // Remove default footer
      >
        <CreateBillForm />
      </Modal>

      {filteredTasks.length === 0 && (
        <div className="text-center mt-10">
          <Link to="/TaskCreate">
            <Button type="primary" size="large">
              Dodaj novi posao
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
export default () => (
  <ContextProvider>
    <TasksList />
  </ContextProvider>
)
