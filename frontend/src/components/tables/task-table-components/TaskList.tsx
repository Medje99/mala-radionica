import { useState, useEffect } from 'react'
import { ITaskResponse } from '@/model/response/ITaskResponse'
import { Table, Input, Popconfirm, message, Modal, Form, Space, Button, Tooltip, Typography } from 'antd'
import { contact_firstName, contact_lastName, creation_date, contact_phoneNumber, taskName } from './constants'
import { DeleteOutlined, EditOutlined, FileDoneOutlined } from '@ant-design/icons'
import { IContact } from '@/model/response/IContactResponse'
import { useGetAllTasks, handleEdit, handleDelete, handleSave } from './actions'
import { useGlobalContext } from '@/components/GlobalContextProvider'
import CreateBillForm from '@/components/forms/create-task-form-components/CreateBillForm'

export const TasksList = () => {
  const { setContextContact: setContextcontact, setCurrentTask, setHeaderTitle, setCurrentPage } = useGlobalContext()
  useEffect(() => {
    setHeaderTitle('Aktivni poslovi')
  }, [])
  //Task set title header

  const { tasks } = useGetAllTasks()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTasks, setFilteredTasks] = useState<ITaskResponse[]>([])
  const [editingTask, setEditingTask] = useState<ITaskResponse>({} as ITaskResponse)
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [billModalOpen, setBillModalOpen] = useState(false)
  const [FormTaskList] = Form.useForm<ITaskResponse>()

  ////Task update list on search/product change main useEffect in useGetUnfinishedTasks !
  useEffect(() => {
    const filtered = tasks?.filter((task) => {
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
  }, [searchTerm, tasks])

  //Columns imported clean
  const columns = [
    contact_firstName,
    contact_lastName,
    contact_phoneNumber,
    taskName,
    Table.EXPAND_COLUMN,
    creation_date,

    //Actions column
    {
      title: 'Akcije',
      key: 'action',
      width: 30,
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
            onCancel={() => message.warning('Brisanje posla otkazano!')}
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
                setContextcontact({
                  id: record.contact_id,
                  fullName: `${record.firstName} ${record.lastName}`,
                } as IContact)
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
    <div className=" flex-row task h-[calc(100vh-6rem)]  overflow-y-auto bg-gradient-to-r from-teal-400 to-gray-800">
      {/*edit FormTaskList*/}

      <Modal
        open={isEditModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
        closeIcon={null}
        title="Izmeni posao :"
        className="flex editModal "
      >
        <Form form={FormTaskList}>
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
        // onClose={()=>CreateBillForm.ResetForm()}
        open={billModalOpen}
        onCancel={() => {
          setBillModalOpen(false)
        }}
        footer={null}
        closeIcon={null}
        className="flex billModal"
      >
        <CreateBillForm
          callback={() => {
            setBillModalOpen(false)
            setCurrentPage(0)
            //just to refresh tasklist ... task-> actions has a useEffect that triggers re-render on page change
          }}
        />
        {/* Pass the closing logic */}
      </Modal>

      {/* Task Search Bar */}
      <Space id="search-container" className=" ">
        <Input
          className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm"
          type="text"
          aria-label="Pretrazi aktivne poslove"
          placeholder="Pretrazi aktivne poslove"
          id="search"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Space>

      {/* task Table */}

      <section
        className=" display: grid
  place-items: center"
      >
        <Table
          className="px-12 pt-8"
          size="small"
          pagination={{
            hideOnSinglePage: true,
            pageSize: 18,
            showSizeChanger: false,
            showTotal: (total) => `Ukupno ${total} aktivnih  poslova`,
          }}
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
