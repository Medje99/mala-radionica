/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormContext } from '@/contexts/FormContextProvider'
import { Form, Input, DatePicker } from 'antd'

const CreateTaskFormPt2 = () => {
  const [form2] = Form.useForm()
  const { form } = useFormContext()
  console.log(form.getFieldsValue())
  return (
    <Form
      form={form2}
      name="job-form"
      layout="vertical"
      className="bg-white p-5 rounded-lg"
    >
      {/* Job Name */}
      <Form.Item
        label="Job Name"
        name="job_name"
        rules={[{ required: true, message: 'Please input the job name!' }]}
      >
        <Input />
      </Form.Item>

      {/* Job Description */}
      <Form.Item
        label="Job Description"
        name="job_description"
        rules={[
          { required: true, message: 'Please input the job description!' },
        ]}
      >
        <Input.TextArea />
      </Form.Item>

      {/* Contact ID */}
      <Form.Item
        label="Contact ID"
        name="contact_id"
        rules={[{ required: true, message: 'Please input the contact ID!' }]}
      >
        <Input type="number" />
      </Form.Item>

      {/* Creation Date */}
      <Form.Item
        label="Creation Date"
        name="creation_date"
        rules={[
          { required: true, message: 'Please select the creation date!' },
        ]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      {/* Finish Date */}
      <Form.Item
        label="Finish Date"
        name="finish_date"
        rules={[{ required: false, message: 'Please select the finish date!' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
    </Form>
  )
}

export default CreateTaskFormPt2
