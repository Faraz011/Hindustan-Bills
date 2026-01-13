
import { useEffect, useState } from 'react'
import { getRetailCart, updateRetailCartItem, removeFromRetailCart, placeOrder } from '../lib/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function CartPage(){
  const [cart, setCart] = useState<any>(null)
  const nav = useNavigate()

  useEffect(()=>{ fetchCart() }, [])

  const fetchCart = async ()=> {
    try{
      const res = await getRetailCart()
      setCart(res)
    }catch(err:any){
      // ignore
    }
  }

  const changeQty = async (pid:string, qty:number)=>{
    try{
      await updateRetailCartItem(pid, qty)
      fetchCart()
    }catch(err:any){ toast.error('Failed') }
  }

  const remove = async (pid:string)=>{
    try{
      await removeFromRetailCart(pid)
      fetchCart()
    }catch(err:any){ toast.error('Failed') }
  }

  const checkout = () => {
    console.log("Redirecting to checkout page");
    nav("/checkout");
  };



  if(!cart) return <div className="min-h-screen p-6">Cart empty</div>

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-3">Your Cart</h2>
        <div className="space-y-2">
          {cart.items.map((it:any)=>(
            <div key={it.product?._id} className="flex justify-between items-center">
              <div>
                <div className="font-medium">{it.product?.name}</div>
                <div className="text-sm text-gray-600">₹{it.price}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>changeQty(it.product._id, Math.max(1,it.quantity-1))} className="px-2 py-1 border rounded">-</button>
                <div>{it.quantity}</div>
                <button onClick={()=>changeQty(it.product._id, it.quantity+1)} className="px-2 py-1 border rounded">+</button>
                <button onClick={()=>remove(it.product._id)} className="px-3 py-1 border rounded">Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="font-semibold">Total: ₹{cart.total || cart.items.reduce((s:any,it:any)=>s+it.price,0)}</div>
          <button
            type="button"
            onClick={checkout}
            className="px-4 py-2 bg-primary-600 text-white rounded"
          >
            Pay & Place Order
          </button>

        </div>
      </div>
    </div>
  )
}
