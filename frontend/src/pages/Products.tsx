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
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Plus, Minus, CreditCard, QrCode, ArrowRight, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  description: string
}

interface CartItem extends Product {
  quantity: number
}

const Products = () => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [step, setStep] = useState<'cart' | 'checkout' | 'payment' | 'success'>('cart')
  const [paymentMethod, setPaymentMethod] = useState<string>('')

  const products: Product[] = [
    { id: 1, name: 'Fresh Apples', price: 120, image: '🍎', category: 'Fruits', description: 'Fresh red apples, perfect for snacking' },
    { id: 2, name: 'Bananas', price: 60, image: '🍌', category: 'Fruits', description: 'Sweet yellow bananas, rich in potassium' },
    { id: 3, name: 'Milk', price: 45, image: '🥛', category: 'Dairy', description: 'Fresh cow milk, 1 liter' },
    { id: 4, name: 'Bread', price: 35, image: '🍞', category: 'Bakery', description: 'Soft and fresh white bread loaf' },
    { id: 5, name: 'Eggs', price: 80, image: '🥚', category: 'Dairy', description: 'Farm-fresh eggs, pack of 12' },
    { id: 6, name: 'Rice', price: 150, image: '🍚', category: 'Grains', description: 'Premium basmati rice, 1kg pack' },
  ]

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    toast.success(`${product.name} added to cart!`)
  }

  const removeFromCart = (id: number) => {
    setCart(cart.filter(i => i.id !== id))
  }

  const updateQuantity = (id: number, q: number) => {
    if (q <= 0) removeFromCart(id)
    else setCart(cart.map(i => (i.id === id ? { ...i, quantity: q } : i)))
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const handleProceed = () => {
    if (step === 'cart') setStep('checkout')
    else if (step === 'checkout') setStep('payment')
  }

  const handlePayment = (method: string) => {
    setPaymentMethod(method)
    setStep('success')
    toast.success(`Payment successful via ${method}`)
    setCart([])
    setTimeout(() => {
      setShowCart(false)
      setStep('cart')
    }, 2500)
  }

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="gradient-bg section-padding text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <h1 className="text-5xl font-bold mb-4">
            Our <span className="text-primary-600">Products</span>
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Add items to your cart and experience a clean, smooth checkout.
          </p>
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

      {/* Product Grid */}
      <section className="bg-white section-padding">
        <div className="container-custom grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg border p-6 flex flex-col justify-between hover:shadow-2xl transition-all"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{p.image}</div>
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{p.description}</p>
                <span className="inline-block bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm">{p.category}</span>
              </div>
              <div className="flex items-center justify-between mt-6">
                <span className="text-xl font-bold text-gray-900">₹{p.price}</span>
                <button onClick={() => addToCart(p)} className="btn-primary flex items-center">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cart + Checkout Modal */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h3 className="text-2xl font-bold">
                  {step === 'cart'
                    ? 'Your Cart'
                    : step === 'checkout'
                    ? 'Checkout Details'
                    : step === 'payment'
                    ? 'Select Payment'
                    : 'Order Successful 🎉'}
                </h3>
                <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-800">✕</button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {/* Step 1: Cart */}
                {step === 'cart' && (
                  <div className="space-y-4">
                    {cart.length === 0 ? (
                      <p className="text-center text-gray-600">Your cart is empty.</p>
                    ) : (
                      cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="text-3xl">{item.image}</div>
                            <div>
                              <p className="font-semibold">{item.name}</p>
                              <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="bg-gray-200 w-7 h-7 rounded-full flex items-center justify-center">-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="bg-gray-200 w-7 h-7 rounded-full flex items-center justify-center">+</button>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 ml-2">✕</button>
                          </div>
                        </div>
                      ))
                    )}
                    {cart.length > 0 && (
                      <div className="text-right font-semibold text-lg mt-4">
                        Total: <span className="text-primary-600">₹{total}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Checkout */}
                {step === 'checkout' && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg mb-2">Delivery Details</h4>
                    <input className="input w-full" placeholder="Full Name" />
                    <input className="input w-full" placeholder="Address" />
                    <input className="input w-full" placeholder="Phone Number" />
                    <p className="text-sm text-gray-500 mt-2">Estimated Delivery: 2-4 days</p>
                  </div>
                )}

                {/* Step 3: Payment */}
                {step === 'payment' && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg mb-3 text-center">Choose a Payment Method</h4>
                    <div className="space-y-3">
                      <button onClick={() => handlePayment('UPI')} className="payment-btn">
                        <QrCode className="w-5 h-5 mr-3 text-primary-600" /> UPI / QR
                      </button>
                      <button onClick={() => handlePayment('Credit Card')} className="payment-btn border-gray-400">
                        <CreditCard className="w-5 h-5 mr-3 text-gray-600" /> Credit / Debit Card
                      </button>
                      <button onClick={() => handlePayment('Cash on Delivery')} className="payment-btn border-gray-400">
                        💵 Cash on Delivery
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Success */}
                {step === 'success' && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h4 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h4>
                    <p className="text-gray-600">Your order has been placed successfully.</p>
                  </motion.div>
                )}
              </div>

              {/* Footer Buttons */}
              {step !== 'success' && cart.length > 0 && (
                <div className="border-t px-6 py-4 flex justify-end">
                  <button
                    onClick={handleProceed}
                    className="btn-primary flex items-center"
                  >
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
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
