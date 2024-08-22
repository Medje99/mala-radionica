import { useState, useEffect } from 'react'
import BillService, { IBillResponse } from '@/service/BillService'

const useGetAllBills = () => {
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

export default useGetAllBills
