import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'

interface LoginForm {
  email: string
  password: string
}

interface LoginResponse {
  token?: string
  message?: string
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    console.log('Login form data:', data)
    setIsLoading(true)

    try {
      // Use Axios generic typing instead of importing AxiosResponse
      const res = await api.post<LoginResponse>('/auth/login', {
        email: data.email,
        password: data.password
      })

      const resData = res && res.data ? res.data : ({} as LoginResponse)

      if (resData.token && typeof resData.token === 'string' && resData.token.length > 0) {
        localStorage.setItem('hb_token', resData.token)
        toast.success('Login successful!')
        navigate('/')
      } else {
        const msg = resData.message && typeof resData.message === 'string' && resData.message.length > 0
          ? resData.message
          : 'Invalid email or password'
        toast.error(msg)
      }
    } catch (err: any) {
      let msg = 'Invalid email or password'

      if (err) {
        if (err.response && err.response.data) {
          const d = err.response.data
          if (d.message && typeof d.message === 'string') {
            msg = d.message
          } else if (typeof d === 'string') {
            msg = d
          }
        } else if (err.message && typeof err.message === 'string') {
          msg = err.message
        }
      }

      console.error('Login error:', msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 relative overflow-hidden">

      {/* Background Lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 text-6xl font-bold text-primary-200 opacity-20 transform -rotate-12">
          SCAN
        </div>
        <div className="absolute top-40 right-20 text-5xl font-bold text-primary-300 opacity-15 transform rotate-12">
          DECODE
        </div>
        <div className="absolute bottom-20 left-1/2 text-4xl font-bold text-primary-200 opacity-20 transform -rotate-6">
          SIMPLIFY
        </div>
        <div className="absolute top-1/2 right-10 text-3xl font-bold text-primary-300 opacity-10 transform rotate-45">
          PAY
        </div>
        <div className="absolute bottom-40 right-1/3 text-5xl font-bold text-primary-200 opacity-15 transform -rotate-12">
          RECEIPT
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-24 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                  <img
                    src="/FUTUREOFBUSINESS.png"
                    alt="Hindustan Bills Logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-600 mt-2">Sign in to your Hindustan Bills account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
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

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-500">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-500 font-semibold">
                  Sign up here
                </Link>
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
