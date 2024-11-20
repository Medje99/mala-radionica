
import { Form, Select, Typography } from "antd"
import contactFormActions from '../../forms/create-task-form-components/actions'
import { useEffect, useState } from "react"
import { concateFullName } from "@/Utilities/setFullName"
import SelectProductsComponent from "@/components/SelectProductsComponent"
const { useGetAllContacts } = contactFormActions()
const SellItemForm = () => {

    const [rows, setRows] = useState<{ product: any; quantity: number }[]>([]) // we store rows here before giving them to Ant Form why ?
    const addRow = () => {
      setRows([...rows, { product: null, quantity: 1 }])
    }
    const removeRow = () => {
      if (rows.length > 0) {
        // if there are rows at all
        const newRows = [...rows] //put current rows into newRows
        newRows.pop() // Remove the last entry
        setRows(newRows) //set newRows to list without last item
        console.log(newRows, 'newRows') // verify its done correctly
        sellItemForm.setFieldsValue({
          products_used: newRows, // Update Ant Form's field value to reflect change
        })
      }
    }





    const [searchTerm, setContactSearchTerm] = useState<string>('')
    const [selectedLabel, setSelectedLabel] = useState<string>('')
    const [sellItemForm] = Form.useForm()
    const { allContacts } = useGetAllContacts()
      const [fullVLI, setFullVLI] = useState<
      {
        value: string
        label: string ///..................... type definition
        id: number
      }[]
    >()
    useEffect(() => {
        setFullVLI(
          allContacts.map((item) => ({
            label: item.id.toLocaleString(),
            value: concateFullName(item.firstName, item.lastName),
            id: item.id,
          })),
        )
      }, [allContacts])
      //workie
console.log(fullVLI)
// const [searchTerm, setContactSearchTerm] = useState<string>('')
 const filteredVLIs = fullVLI?.filter((item) => item.value.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="mt-10">

 <Form form={sellItemForm} layout="vertical" id="musterija-form">
 <Typography className="font-bold text-xl mb-12 text-center">Prodaja proizvoda</Typography>
    <Form.Item label="Izaberi musteriju" name="fullName">
    <Select
            showSearch
            placeholder="Izaberi"
            value={selectedLabel}
            onSearch={setContactSearchTerm}
            filterOption={true}
            allowClear
            notFoundContent={null}
          >
            {filteredVLIs?.map((vli) => (
              <option key={vli.id} label={vli.id.toLocaleString()} value={vli.value}></option>
              // value is what is rendered and submitted
              //label is what is beeing searched !
            ))}
          </Select>
    </Form.Item>
    <div id="select-products-component">
        <SelectProductsComponent
          form={sellItemForm} // Pass the form instance here
          rows={rows}
          addRow={addRow}
          removeRow={removeRow}
          setRows={setRows}
        />
      </div>
    </Form>
    
    </div>
  )
}

export default SellItemForm
