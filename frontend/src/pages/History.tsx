
import { useEffect, useState } from 'react'
import { getOrdersHistory } from '../lib/api'
import toast from 'react-hot-toast'

export default function History() {
  const [orders, setOrders] = useState<any[]>([])
  useEffect(()=>{ fetch() }, [])

  const fetch = async () => {
    try{
      const res = await getOrdersHistory()
      setOrders(res)
    }catch(err:any){
      toast.error('Failed to fetch history')
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Your Purchase History</h1>
        {orders.length===0 && <div className="text-gray-600">No purchases yet.</div>}
        <div className="space-y-3">
          {orders.map(o=>(
            <div key={o._id} className="bg-white p-3 rounded shadow">
              <div className="flex justify-between">
                <div>Order #{o._id}</div>
                <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <div className="mt-2">
                {o.items.map((it:any)=>(
                  <div key={it.product?._id} className="flex justify-between text-sm">
                    <div>{it.product?.name} x {it.quantity}</div>
                    <div>₹{it.price}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
