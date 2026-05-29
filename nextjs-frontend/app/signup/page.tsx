'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaPhone, FaStar, FaUserTie, FaUserCircle, FaCheck } from 'react-icons/fa'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const roles = [
    { id: 'customer', name: 'Customer', icon: FaUserCircle },
    { id: 'employee', name: 'Employee', icon: FaUserTie }
  ]

  const benefits = [
    'Exclusive member-only offers',
    'Priority reservations',
    'Birthday rewards',
    'Points on every order'
  ]

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role
        })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        switch (data.user.role) {
          case 'employee':
            router.push('/employee')
            break
          default:
            router.push('/dashboard')
        }
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200"
          alt="Restaurant Interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        <div className="absolute inset-0 flex flex-col justify-center p-16">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-2xl">G</span>
            </div>
            <span className="font-playfair text-3xl font-bold text-white">Gastronome</span>
          </div>
          <h2 className="font-playfair text-5xl font-bold text-white mb-4">
            Join Our<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Culinary Family</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-md">
            Create an account to unlock exclusive benefits, personalized recommendations, and a seamless dining experience.
          </p>
          
          {/* Benefits */}
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <FaCheck className="text-amber-400 text-xs" />
                </div>
                <span className="text-gray-300">{benefit}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-10">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-sm" />
              ))}
            </div>
            <span className="text-gray-400 text-sm">Join 50,000+ happy members</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-white to-gray-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md py-8"
        >
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xl">G</span>
            </div>
            <span className="font-playfair text-2xl font-bold text-charcoal">Gastronome</span>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-bold text-charcoal mb-2">Create Account</h1>
            <p className="text-gray-500">Join our culinary community today</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-charcoal mb-3">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                  <label
                    key={role.id}
                    className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all text-center ${
                      formData.role === role.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.id}
                      checked={formData.role === role.id}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="sr-only"
                    />
                    <role.icon className={`text-2xl mx-auto mb-2 ${formData.role === role.id ? 'text-amber-600' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${formData.role === role.id ? 'text-amber-700' : 'text-gray-600'}`}>{role.name}</p>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Phone Number</label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-10 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Confirm</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-12 pr-10 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-black py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-amber-600 hover:text-amber-700 font-semibold">
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <Link href="/" className="text-gray-400 hover:text-amber-600 text-sm inline-flex items-center gap-2">
              ← Back to Website
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
