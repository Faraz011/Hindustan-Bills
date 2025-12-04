// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import { useForm } from 'react-hook-form'
// import { Eye, EyeOff, Mail, Lock, User, Building } from 'lucide-react'
// import toast from 'react-hot-toast'

// interface RegisterForm {
//   firstName: string
//   lastName: string
//   email: string
//   password: string
//   confirmPassword: string
//   businessName: string
//   businessType: string
//   agreeToTerms: boolean
// }

// const Register = () => {
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const navigate = useNavigate()

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors }
//   } = useForm<RegisterForm>()

//   const password = watch('password')

//   const onSubmit = async (data: RegisterForm) => {
//     console.log("Register form data:", data)
//     setIsLoading(true)
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1500))
//       toast.success('Registration successful! Welcome to Hindustan Bills!')
//       navigate('/login')
//     } catch (error) {
//       toast.error('Registration failed. Please try again.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="max-w-2xl mx-auto"
//       >
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <div className="text-center mb-8">
//             <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="text-white font-bold text-2xl">HB</span>
//             </div>
//             <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
//             <p className="text-gray-600 mt-2">Join Hindustan Bills and transform your business</p>
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             <div className="grid md:grid-cols-2 gap-6">
//               <div>
//                 <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
//                   First Name
//                 </label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     {...register('firstName', { required: 'First name is required' })}
//                     type="text"
//                     className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
//                     placeholder="Enter your first name"
//                   />
//                 </div>
//                 {errors.firstName && (
//                   <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
//                 )}
//               </div>

//               <div>
//                 <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
//                   Last Name
//                 </label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     {...register('lastName', { required: 'Last name is required' })}
//                     type="text"
//                     className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
//                     placeholder="Enter your last name"
//                   />
//                 </div>
//                 {errors.lastName && (
//                   <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
//                 )}
//               </div>
//             </div>

//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   {...register('email', {
//                     required: 'Email is required',
//                     pattern: {
//                       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                       message: 'Invalid email address'
//                     }
//                   })}
//                   type="email"
//                   className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
//                   placeholder="Enter your email"
//                 />
//               </div>
//               {errors.email && (
//                 <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
//               )}
//             </div>

//             <div className="grid md:grid-cols-2 gap-6">
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     {...register('password', {
//                       required: 'Password is required',
//                       minLength: {
//                         value: 6,
//                         message: 'Password must be at least 6 characters'
//                       }
//                     })}
//                     type={showPassword ? 'text' : 'password'}
//                     className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
//                     placeholder="Create a password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
//                 )}
//               </div>

//               <div>
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                   Confirm Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     {...register('confirmPassword', {
//                       required: 'Please confirm your password',
//                       validate: value => value === password || 'Passwords do not match'
//                     })}
//                     type={showConfirmPassword ? 'text' : 'password'}
//                     className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
//                     placeholder="Confirm your password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                   </button>
//                 </div>
//                 {errors.confirmPassword && (
//                   <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
//                 )}
//               </div>
//             </div>

//             <div className="grid md:grid-cols-2 gap-6">
//               <div>
//                 <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
//                   Business Name
//                 </label>
//                 <div className="relative">
//                   <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     {...register('businessName', { required: 'Business name is required' })}
//                     type="text"
//                     className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
//                     placeholder="Enter your business name"
//                   />
//                 </div>
//                 {errors.businessName && (
//                   <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
//                 )}
//               </div>

//               <div>
//                 <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
//                   Business Type
//                 </label>
//                 <select
//                   {...register('businessType', { required: 'Business type is required' })}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
//                 >
//                   <option value="">Select business type</option>
//                   <option value="retail">Retail Store</option>
//                   <option value="restaurant">Restaurant</option>
//                   <option value="supermarket">Supermarket</option>
//                   <option value="pharmacy">Pharmacy</option>
//                   <option value="other">Other</option>
//                 </select>
//                 {errors.businessType && (
//                   <p className="text-red-500 text-sm mt-1">{errors.businessType.message}</p>
//                 )}
//               </div>
//             </div>

//             <div className="flex items-center">
//               <input
//                 {...register('agreeToTerms', { required: 'You must agree to the terms and conditions' })}
//                 type="checkbox"
//                 className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//               />
//               <label className="ml-2 block text-sm text-gray-700">
//                 I agree to the{' '}
//                 <Link to="/terms" className="text-primary-600 hover:text-primary-500">
//                   Terms and Conditions
//                 </Link>{' '}
//                 and{' '}
//                 <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
//                   Privacy Policy
//                 </Link>
//               </label>
//             </div>
//             {errors.agreeToTerms && (
//               <p className="text-red-500 text-sm">{errors.agreeToTerms.message}</p>
//             )}

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? 'Creating Account...' : 'Create Account'}
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-gray-600">
//               Already have an account?{' '}
//               <Link to="/login" className="text-primary-600 hover:text-primary-500 font-semibold">
//                 Sign in here
//               </Link>
//             </p>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   )
// }

// export default Register

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock, User, Building } from 'lucide-react'
import toast from 'react-hot-toast'

interface RegisterForm {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  businessName: string
  businessType: string
  agreeToTerms: boolean
}

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [accountType, setAccountType] = useState<'retailer' | 'user'>('retailer')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>()

  const password = watch('password')

  const onSubmit = async (data: RegisterForm) => {
    console.log('Register form data:', data)
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast.success('Registration successful! Welcome to Hindustan Bills!')
      navigate('/login')
    } catch (error) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">HB</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600 mt-2">
              Join Hindustan Bills and transform your business
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Account type */}
            <div className="flex items-center gap-4">
              <label className="px-3 py-2 rounded-md cursor-pointer">
                <input
                  type="radio"
                  name="accountType"
                  value="retailer"
                  checked={accountType === 'retailer'}
                  onChange={() => setAccountType('retailer')}
                  className="mr-2"
                />
                Retailer
              </label>
              <label className="px-3 py-2 rounded-md cursor-pointer">
                <input
                  type="radio"
                  name="accountType"
                  value="user"
                  checked={accountType === 'user'}
                  onChange={() => setAccountType('user')}
                  className="mr-2"
                />
                User
              </label>
            </div>

            {/* Name fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('firstName', { required: 'First name is required' })}
                    type="text"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Enter your first name"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('lastName', { required: 'Last name is required' })}
                    type="text"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Enter your last name"
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) =>
                        value === password || 'Passwords do not match',
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Business fields (only for retailer) */}
            {accountType === 'retailer' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="businessName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Business Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('businessName', {
                        required: 'Business name is required',
                      })}
                      type="text"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Enter your business name"
                    />
                  </div>
                  {errors.businessName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.businessName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="businessType"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Business Type
                  </label>
                  <select
                    {...register('businessType', {
                      required: 'Business type is required',
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="">Select business type</option>
                    <option value="retail">Retail Store</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="supermarket">Supermarket</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.businessType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.businessType.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Terms */}
            <div className="flex items-center">
              <input
                {...register('agreeToTerms', {
                  required: 'You must agree to the terms and conditions',
                })}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <Link
                  to="/terms"
                  className="text-primary-600 hover:text-primary-500"
                >
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link
                  to="/privacy"
                  className="text-primary-600 hover:text-primary-500"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-sm">
                {errors.agreeToTerms.message}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-500 font-semibold"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
