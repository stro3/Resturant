import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { menuAPI, orderAPI } from '../services/api'
import { toast } from 'react-toastify'
import './OrderOnline.css'

function OrderOnline() {
  const [menuItems, setMenuItems] = useState([])
  const [cart, setCart] = useState([])
  const [orderType, setOrderType] = useState('delivery')
  const [showCheckout, setShowCheckout] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  useEffect(() => {
    fetchMenu()
  }, [])

  const fetchMenu = async () => {
    try {
      const response = await menuAPI.getAll()
      setMenuItems(response.data)
    } catch (error) {
      toast.error('Failed to load menu')
    }
  }

  const addToCart = (item) => {
    const existing = cart.find(cartItem => cartItem._id === item._id)
    if (existing) {
      setCart(cart.map(cartItem => 
        cartItem._id === item._id 
          ? {...cartItem, quantity: cartItem.quantity + 1}
          : cartItem
      ))
    } else {
      setCart([...cart, {...item, quantity: 1}])
    }
    toast.success(`${item.name} added to cart`)
  }

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item._id !== itemId))
  }

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCart(cart.map(item => 
      item._id === itemId ? {...item, quantity} : item
    ))
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)
  }

  const onSubmit = async (data) => {
    if (cart.length === 0) {
      toast.error('Cart is empty')
      return
    }

    const orderData = {
      ...data,
      order_type: orderType,
      items: cart.map(item => ({
        item_id: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: calculateTotal()
    }

    try {
      const response = await orderAPI.create(orderData)
      toast.success(`Order placed! Order number: ${response.data.order_number}`)
      setCart([])
      setShowCheckout(false)
      reset()
    } catch (error) {
      toast.error('Order failed. Please try again.')
    }
  }

  return (
    <div className="order-page">
      <section className="order-header">
        <h1>Order Online</h1>
        <p>Enjoy our food in the comfort of your home</p>
      </section>

      <div className="container">
        <div className="order-type-selector">
          <button 
            className={orderType === 'delivery' ? 'type-btn active' : 'type-btn'}
            onClick={() => setOrderType('delivery')}
          >
            Delivery
          </button>
          <button 
            className={orderType === 'takeaway' ? 'type-btn active' : 'type-btn'}
            onClick={() => setOrderType('takeaway')}
          >
            Takeaway
          </button>
          <button 
            className={orderType === 'dine-in' ? 'type-btn active' : 'type-btn'}
            onClick={() => setOrderType('dine-in')}
          >
            Dine-In
          </button>
        </div>

        <div className="order-content">
          <div className="menu-items-section">
            <h2>Select Items</h2>
            <div className="grid grid-2">
              {menuItems.map(item => (
                <div key={item._id} className="order-item-card">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <span className="item-price">${item.price}</span>
                  </div>
                  <button 
                    className="add-btn btn btn-primary"
                    onClick={() => addToCart(item)}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-section">
            <div className="cart-sticky">
              <h2>Your Cart ({cart.length})</h2>
              
              {cart.length === 0 ? (
                <p className="empty-cart">Cart is empty</p>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item._id} className="cart-item">
                        <div className="cart-item-info">
                          <h4>{item.name}</h4>
                          <span>${item.price}</span>
                        </div>
                        <div className="quantity-controls">
                          <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                        </div>
                        <button 
                          className="remove-btn"
                          onClick={() => removeFromCart(item._id)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="cart-total">
                    <h3>Total: ${calculateTotal()}</h3>
                  </div>

                  <button 
                    className="btn btn-primary checkout-btn"
                    onClick={() => setShowCheckout(true)}
                  >
                    Proceed to Checkout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {showCheckout && (
          <div className="checkout-modal">
            <div className="checkout-content">
              <button className="close-modal" onClick={() => setShowCheckout(false)}>✕</button>
              
              <h2>Checkout</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && <span className="error-message">{errors.name.message}</span>}
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    {...register('phone', { required: 'Phone is required' })}
                  />
                  {errors.phone && <span className="error-message">{errors.phone.message}</span>}
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    {...register('email', { required: 'Email is required' })}
                  />
                  {errors.email && <span className="error-message">{errors.email.message}</span>}
                </div>

                {orderType === 'delivery' && (
                  <div className="form-group">
                    <label>Delivery Address</label>
                    <textarea 
                      rows="3"
                      {...register('address', { required: 'Address is required for delivery' })}
                    />
                    {errors.address && <span className="error-message">{errors.address.message}</span>}
                  </div>
                )}

                <div className="form-group">
                  <label>Special Instructions (Optional)</label>
                  <textarea 
                    rows="2"
                    {...register('instructions')}
                  />
                </div>

                <div className="order-summary">
                  <h3>Order Summary</h3>
                  <p>Type: {orderType}</p>
                  <p>Items: {cart.length}</p>
                  <p className="summary-total">Total: ${calculateTotal()}</p>
                </div>

                <button type="submit" className="btn btn-primary">Place Order</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderOnline
