import React, { useState, useEffect } from 'react'
import { ITaskResponse } from '@/model/response/ITaskResponse'
import { Table, Typography, Input, Popconfirm, message, Modal, Form, Space, Button, Switch } from 'antd'
import { customer_firstName, customer_lastName, taskName, taskDescription, paid, creation_date } from './constants'
import { Link } from 'react-router-dom'
import useGetAllTasks from '@/CustomHooks/useGetAllTasks'
import TasksAdvancedActions from './actions'

const TasksList: React.FC = () => {
  const { allTasks } = useGetAllTasks()
  const { handleEdit, handleDelete, handleSave } = TasksAdvancedActions()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTasks, setFilteredTasks] = useState<ITaskResponse[]>([])
  const [editingTask, setEditingTask] = useState<ITaskResponse>({} as ITaskResponse)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm<ITaskResponse>()

  useEffect(() => {
    if (allTasks) {
      const filtered = allTasks.filter((task) => {
        const searchText = searchTerm.toLowerCase()
        return (
          task.job_name?.toLowerCase().includes(searchText) || task.job_description?.toLowerCase().includes(searchText)
        )
      })
      setFilteredTasks(filtered)
    }
  }, [searchTerm, allTasks])

  const columns = [
    customer_firstName,
    customer_lastName,
    taskName,
    taskDescription,
    paid,
    creation_date,
    {
      title: 'Actions',
      key: 'action',
      render: (record: ITaskResponse) => (
        <Space size="middle">
          <Button type="primary" ghost onClick={() => handleEdit(record, setEditingTask, form, setIsModalOpen)}>
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
        Task List
      </Typography.Title>

      <Input.Search
        placeholder="Search tasks"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      <Table columns={columns} dataSource={filteredTasks} pagination={{ pageSize: 7 }} rowKey="id" />

      <Modal
        title="Edit Task"
        open={isModalOpen}
        onOk={() => handleSave(form, editingTask, filteredTasks, setFilteredTasks, setIsModalOpen)}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
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

          <Form.Item label="Paid" name="paid" valuePropName="checked">
            <Switch />
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
