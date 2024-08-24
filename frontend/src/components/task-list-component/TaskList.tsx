import React, { useState, useEffect } from 'react'
import { ITaskResponse } from '@/model/response/ITaskResponse'
import { Table, Typography, Input, Popconfirm, message, Modal, Form, Space, Button, Switch } from 'antd'
import { customer_firstName, customer_lastName, taskName, taskDescription, creation_date } from './constants'
import { Link } from 'react-router-dom'
import useGetUnfinishedTasks from '@/CustomHooks/useGetUnfinishedTasks'
import TasksAdvancedActions from './actions'

const TasksList: React.FC = () => {
  const { allTasks: UnfinishedOnes } = useGetUnfinishedTasks()
  const { handleEdit, handleDelete, handleSave } = TasksAdvancedActions()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTasks, setFilteredTasks] = useState<ITaskResponse[]>([])
  const [editingTask, setEditingTask] = useState<ITaskResponse>({} as ITaskResponse)
  const [isModalOpen, setIsModalOpen] = useState(false)
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
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={() => handleDelete(record.id, filteredTasks, setFilteredTasks)}
            onCancel={() => message.error('Delete canceled')}
            okText="Yes"
            cancelText="No"
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
      <Typography.Title level={2} className="mb-4">
        Aktivni Poslovi
      </Typography.Title>

      <Input.Search
        placeholder="Search tasks"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      <Table columns={columns} dataSource={filteredTasks} pagination={{ pageSize: 100 }} rowKey="id" />

      <Modal
        title="Edit Task"
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

      {filteredTasks.length === 0 && (
        <div className="text-center mt-10">
          <Link to="/TaskCreate">
            <Button type="primary" size="large">
              Add Task
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default TasksList
