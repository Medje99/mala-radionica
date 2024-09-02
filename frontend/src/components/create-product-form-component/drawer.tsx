import React, { useState } from 'react'
import { Button, Drawer, Space } from 'antd'
import InsertProductFormComponent from './insertProductFormComponent'
import { FileAddOutlined } from '@ant-design/icons'

export const DrawerWithExtraActions: React.FC = () => {
  const [open, setOpen] = useState(false)

  const showDrawer = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Space>
        <Button size="large" type="primary" icon="Dodaj novi proizvod" onClick={showDrawer}>
          <FileAddOutlined />
        </Button>
      </Space>
      <Drawer placement={'left'} width={500} onClose={onClose} open={open}>
        <InsertProductFormComponent />
      </Drawer>
    </>
  )
}
