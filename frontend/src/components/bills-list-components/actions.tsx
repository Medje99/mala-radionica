import { message } from 'antd'
import BillService from '@/services/BillService'
import { IBillResponse } from '@/model/response/IBillResponse'
import { FormInstance } from 'antd/es/form/Form'
import { useEffect, useState } from 'react'

export const useGetAllBills = () => {
  const [bills, setBills] = useState<IBillResponse[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await BillService.getAllBills()
        setBills(response.data)
      } catch (err) {
        console.error('Failed to fetch bills:', err)
        setError('Failed to fetch bills')
      } finally {
        setLoading(false)
      }
    }

    fetchBills()
  }, [])

  return { bills, loading, error }
}

export const handleEdit = (
  record: IBillResponse,
  setEditingBill: (bill: IBillResponse) => void,
  setCurrentTask: (task: IBillResponse) => void,
  FormBillList: FormInstance<IBillResponse>,
  setIsModalOpen: (open: boolean) => void,
) => {
  setEditingBill(record)
  setCurrentTask(record)
  FormBillList.setFieldsValue(record)
  setIsModalOpen(true)
}

export const handleDelete = async (bill_id: number, setFilteredBills: (bills: IBillResponse[]) => void) => {
  try {
    await BillService.deleteBill(bill_id)
    setFilteredBills((prevBills) => prevBills.filter((bill) => bill.bill_id !== bill_id))
    message.success('Racun izbrisan uspesno!')
  } catch (error) {
    message.error('Greška prilikom brisanja racuna! Kontaktirajte administratora.')
  }
}

export const markAsPaid = async (
  record: IBillResponse,
  filteredBills: IBillResponse[],
  setFilteredBills: (bills: IBillResponse[]) => void,
) => {
  try {
    const updatedBill = { ...record, paid: true } as IBillResponse
    await BillService.updateBill(updatedBill) // Wait for the update to complete

    const updatedBills = filteredBills.map((bill) => (bill.bill_id === record.bill_id ? { ...bill, paid: true } : bill))
    setFilteredBills(updatedBills)
    message.success('Racun oznacen kao placen')
  } catch (error) {
    console.error('Error marking bill as paid:', error)
    message.error('Greška prilikom oznacavanja racuna kao plaćenog!')
  }
}
