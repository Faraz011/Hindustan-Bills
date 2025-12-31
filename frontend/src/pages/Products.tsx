// import { useState } from 'react'
// import { motion } from 'framer-motion'
// import { ShoppingCart, Plus, Minus, CreditCard, QrCode } from 'lucide-react'
// import toast from 'react-hot-toast'

// interface Product {
//   id: number
//   name: string
//   price: number
//   image: string
//   category: string
//   description: string
// }

// interface CartItem extends Product {
//   quantity: number
// }

// const Products = () => {
//   const [cart, setCart] = useState<CartItem[]>([])
//   const [showCart, setShowCart] = useState(false)
//   const [showPayment, setShowPayment] = useState(false)

//   const products: Product[] = [
//     {
//       id: 1,
//       name: "Fresh Apples",
//       price: 120,
//       image: "🍎",
//       category: "Fruits",
//       description: "Fresh red apples, perfect for snacking"
//     },
//     {
//       id: 2,
//       name: "Bananas",
//       price: 60,
//       image: "🍌",
//       category: "Fruits",
//       description: "Sweet yellow bananas, rich in potassium"
//     },
//     {
//       id: 3,
//       name: "Milk",
//       price: 45,
//       image: "🥛",
//       category: "Dairy",
//       description: "Fresh cow milk, 1 liter"
//     },
//     {
//       id: 4,
//       name: "Bread",
//       price: 35,
//       image: "🍞",
//       category: "Bakery",
//       description: "Fresh white bread, soft and delicious"
//     },
//     {
//       id: 5,
//       name: "Eggs",
//       price: 80,
//       image: "🥚",
//       category: "Dairy",
//       description: "Farm fresh eggs, pack of 12"
//     },
//     {
//       id: 6,
//       name: "Rice",
//       price: 150,
//       image: "🍚",
//       category: "Grains",
//       description: "Basmati rice, 1kg pack"
//     }
//   ]

//   const addToCart = (product: Product) => {
//     const existingItem = cart.find(item => item.id === product.id)
//     if (existingItem) {
//       setCart(cart.map(item => 
//         item.id === product.id 
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       ))
//     } else {
//       setCart([...cart, { ...product, quantity: 1 }])
//     }
//     toast.success(`${product.name} added to cart!`)
//   }

//   const removeFromCart = (productId: number) => {
//     setCart(cart.filter(item => item.id !== productId))
//     toast.success('Item removed from cart!')
//   }

//   const updateQuantity = (productId: number, quantity: number) => {
//     if (quantity === 0) {
//       removeFromCart(productId)
//     } else {
//       setCart(cart.map(item => 
//         item.id === productId 
//           ? { ...item, quantity }
//           : item
//       ))
//     }
//   }

//   const getTotalPrice = () => {
//     return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
//   }

//   const handleCheckout = () => {
//     setShowPayment(true)
//   }

//   const handlePayment = (method: string) => {
//     toast.success(`Payment successful with ${method}!`)
//     setCart([])
//     setShowPayment(false)
//     setShowCart(false)
//   }

//   return (
//     <div className="pt-20">
//       {/* Header */}
//       <section className="gradient-bg section-padding">
//         <div className="container-custom">
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-center max-w-4xl mx-auto"
//           >
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
//               Our <span className="text-primary-600">Products</span>
//             </h1>
//             <p className="text-xl text-gray-600 leading-relaxed mb-8">
//               Browse and select from our wide range of fresh products. Add items to your cart and checkout seamlessly.
//             </p>
            
//             {/* Cart Button */}
//             <div className="flex justify-center">
//               <button
//                 onClick={() => setShowCart(true)}
//                 className="btn-primary inline-flex items-center"
//                 disabled={cart.length === 0}
//               >
//                 <ShoppingCart className="w-5 h-5 mr-2" />
//                 Cart ({cart.length})
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Products Grid */}
//       <section className="section-padding bg-white">
//         <div className="container-custom">
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {products.map((product, index) => (
//               <motion.div
//                 key={product.id}
//                 initial={{ opacity: 0, y: 50 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, delay: index * 0.1 }}
//                 viewport={{ once: true }}
//                 className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 card-hover"
//               >
//                 <div className="text-center mb-6">
//                   <div className="text-6xl mb-4">{product.image}</div>
//                   <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
//                   <p className="text-gray-600 text-sm mb-2">{product.description}</p>
//                   <span className="inline-block bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium">
//                     {product.category}
//                   </span>
//                 </div>
                
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
//                   <button
//                     onClick={() => addToCart(product)}
//                     className="btn-primary flex items-center"
//                   >
//                     <Plus className="w-4 h-4 mr-1" />
//                     Add to Cart
//                   </button>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Cart Modal */}
//       {showCart && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
//           >
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-2xl font-bold text-gray-900">Shopping Cart</h3>
//                 <button
//                   onClick={() => setShowCart(false)}
//                   className="p-2 hover:bg-gray-100 rounded-full"
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>

//             <div className="p-6 max-h-96 overflow-y-auto">
//               {cart.length === 0 ? (
//                 <div className="text-center py-12">
//                   <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                   <p className="text-gray-600">Your cart is empty</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {cart.map((item) => (
//                     <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                       <div className="flex items-center space-x-4">
//                         <div className="text-3xl">{item.image}</div>
//                         <div>
//                           <h4 className="font-semibold text-gray-900">{item.name}</h4>
//                           <p className="text-sm text-gray-600">₹{item.price} each</p>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center space-x-3">
//                         <button
//                           onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                           className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
//                         >
//                           <Minus className="w-4 h-4" />
//                         </button>
//                         <span className="w-8 text-center font-semibold">{item.quantity}</span>
//                         <button
//                           onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                           className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
//                         >
//                           <Plus className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => removeFromCart(item.id)}
//                           className="text-red-500 hover:text-red-700 ml-2"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {cart.length > 0 && (
//               <div className="p-6 border-t border-gray-200">
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-lg font-semibold">Total:</span>
//                   <span className="text-2xl font-bold text-primary-600">₹{getTotalPrice()}</span>
//                 </div>
//                 <button
//                   onClick={handleCheckout}
//                   className="w-full btn-primary"
//                 >
//                   Proceed to Checkout
//                 </button>
//               </div>
//             )}
//           </motion.div>
//         </motion.div>
//       )}

//       {/* Payment Modal */}
//       {showPayment && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
//           >
//             <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choose Payment Method</h3>
            
//             <div className="space-y-4">
//               <button
//                 onClick={() => handlePayment('UPI')}
//                 className="w-full p-4 border-2 border-primary-500 rounded-lg hover:bg-primary-50 transition-colors duration-200 flex items-center justify-center"
//               >
//                 <QrCode className="w-6 h-6 mr-3 text-primary-600" />
//                 <span className="font-semibold">Pay with UPI</span>
//               </button>
              
//               <button
//                 onClick={() => handlePayment('Credit Card')}
//                 className="w-full p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
//               >
//                 <CreditCard className="w-6 h-6 mr-3 text-gray-600" />
//                 <span className="font-semibold">Credit/Debit Card</span>
//               </button>
              
//               <button
//                 onClick={() => handlePayment('Cash')}
//                 className="w-full p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
//               >
//                 <span className="text-2xl mr-3">💵</span>
//                 <span className="font-semibold">Cash on Delivery</span>
//               </button>
//             </div>
            
//             <button
//               onClick={() => setShowPayment(false)}
//               className="w-full mt-4 text-gray-600 hover:text-gray-800"
//             >
//               Cancel
//             </button>
//           </motion.div>
//         </motion.div>
//       )}
//     </div>
//   )
// }

// export default Products
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingCart,
  Plus,
  Minus,
  CreditCard,
  QrCode,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"
import toast from "react-hot-toast"

import StoreDetector from "../components/StoreDetector"
import { getProducts } from "../lib/api"
import type { Product } from "../lib/api"

/* ================= TYPES ================= */

// Cart must ALWAYS have _id
interface CartItem extends Product {
  _id: string
  quantity: number
}

/* ================= COMPONENT ================= */

const Products = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [step, setStep] = useState<"cart" | "checkout" | "payment" | "success">(
    "cart"
  )
  const [currentShop, setCurrentShop] = useState<{ _id: string } | null>(null)

  /* ================= USER / ROLE ================= */

  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const isRetailer = user?.role === "retailer"

  /* ================= AUTO-SET SHOP FOR RETAILER ================= */

  useEffect(() => {
    if (isRetailer && user?.shopId) {
      setCurrentShop({ _id: user.shopId })
    }
  }, [isRetailer, user?.shopId])

  /* ================= FETCH PRODUCTS ================= */

  useEffect(() => {
    if (!currentShop?._id) {
      setProducts([])
      return
    }

    getProducts(currentShop._id)
      .then((data) => setProducts(data))
      .catch(() => toast.error("Failed to load products"))
  }, [currentShop])

  /* ================= CART LOGIC ================= */

  const addToCart = (product: Product) => {
    if (!product._id) return

    setCart((prev) => {
      const existing = prev.find((i) => i._id === product._id)
      if (existing) {
        return prev.map((i) =>
          i._id === product._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...(product as CartItem), quantity: 1 }]
    })

    toast.success(`${product.name} added to cart`)
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i._id !== id))
  }

  const updateQuantity = (id: string, q: number) => {
    if (q <= 0) removeFromCart(id)
    else
      setCart((prev) =>
        prev.map((i) => (i._id === id ? { ...i, quantity: q } : i))
      )
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const handleProceed = () => {
    if (step === "cart") setStep("checkout")
    else if (step === "checkout") setStep("payment")
  }

  /* ================= PAYMENT + RECEIPT ================= */

  const handlePayment = async (method: string) => {
    try {
      setStep("success")

      const res = await fetch("http://localhost:5000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((i) => ({
            productId: i._id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          paymentMethod: method,
        }),
      })

      const data = await res.json()

      toast.success(`Payment successful via ${method}`)
      setCart([])
      setShowCart(false)
      setStep("cart")

      // Redirect to receipt verification
      window.location.href = `/receipt/${data.receiptId}`
    } catch {
      toast.error("Payment failed")
      setStep("payment")
    }
  }

  /* ================= UI ================= */

  return (
    <div className="pt-20">
      {/* HEADER */}
      <section className="section-padding text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl font-bold mb-4">
            Store <span className="text-primary-600">Products</span>
          </h1>

          {/* CUSTOMER ONLY */}
          {!isRetailer && (
            <div className="flex justify-center mb-6">
              <StoreDetector onSelect={setCurrentShop} />
            </div>
          )}

          <button
            onClick={() => setShowCart(true)}
            className="btn-primary inline-flex items-center"
            disabled={cart.length === 0}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            View Cart ({cart.length})
          </button>
        </motion.div>
      </section>

      {/* PRODUCTS GRID */}
      <section className="bg-white section-padding">
        <div className="container-custom grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl shadow border p-6 flex flex-col justify-between"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="mx-auto h-20 object-contain"
                    />
                  ) : (
                    "🛒"
                  )}
                </div>
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{p.description}</p>
                {p.category && (
                  <span className="inline-block bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm">
                    {p.category}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mt-6">
                <span className="text-xl font-bold">₹{p.price}</span>
                <button
                  onClick={() => addToCart(p)}
                  className="btn-primary flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CART MODAL */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl"
            >
              <div className="px-6 py-4 border-b flex justify-between">
                <h3 className="text-xl font-bold">
                  {step === "cart"
                    ? "Your Cart"
                    : step === "checkout"
                    ? "Checkout"
                    : step === "payment"
                    ? "Payment"
                    : "Success"}
                </h3>
                <button onClick={() => setShowCart(false)}>✕</button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {step === "cart" &&
                  cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded mb-2"
                    >
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          ₹{item.price} × {item.quantity}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                        >
                          <Minus />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                        >
                          <Plus />
                        </button>
                      </div>
                    </div>
                  ))}

                {step === "payment" && (
                  <div className="space-y-3">
                    <button
                      onClick={() => handlePayment("UPI")}
                      className="payment-btn"
                    >
                      <QrCode className="mr-2" /> UPI / QR
                    </button>
                    <button
                      onClick={() => handlePayment("Card")}
                      className="payment-btn"
                    >
                      <CreditCard className="mr-2" /> Card
                    </button>
                  </div>
                )}

                {step === "success" && (
                  <div className="text-center py-10">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold">
                      Payment Successful
                    </h3>
                  </div>
                )}
              </div>

              {step !== "success" && cart.length > 0 && (
                <div className="px-6 py-4 border-t flex justify-end">
                  <button
                    onClick={handleProceed}
                    className="btn-primary flex items-center"
                  >
                    Continue <ArrowRight className="ml-2" />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Products
