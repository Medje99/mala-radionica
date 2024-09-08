import React, { useEffect, useState } from 'react'
import { Table, Input, Space } from 'antd'

interface SearchableTableProps<T> {
  data: T[]
  columns: any[]
  pageSize?: number
  placeholder?: string
  expandable?: {
    expandedRowRender: (record: T) => React.ReactNode
    rowKey: string
  }
}

const SearchableTable: React.FC<SearchableTableProps<any>> = ({
  data,
  columns,
  pageSize = 14,
  placeholder = 'Pretrazi...',
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<any[]>(data)

  useEffect(() => {
    const filtered = data.filter((item) => {
      const searchText = searchTerm.toLowerCase()
      return Object.values(item).some((value) => String(value).toLowerCase().includes(searchText))
    })
    setFilteredData(filtered)
  }, [searchTerm, data])

  return (
    <div>
      <Space id="search-container" className="">
        <Input
          className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm"
          type="text"
          aria-label={placeholder}
          placeholder={placeholder}
          id="search"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Space>
      <section className="w-full px-24 ">
        <Table
          size="small"
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize }}
          rowKey="id"
          className="p-7 mt-5 rounded-xl"
        />
      </section>
    </div>
  )
}

export default SearchableTable
