import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Trash2, CreditCard, MapPin } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { ordersAPI } from '../services/api';
import './Checkout.css';

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postal_code: '',
    country: ''
  });
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const { items, removeFromCart, updateQuantity, getTotalAmount, clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create payment intent
      const orderItems = items.map(item => ({
        artwork_id: item.id,
        quantity: item.quantity
      }));

      const paymentIntentResponse = await ordersAPI.createPaymentIntent({
        items: orderItems,
        shipping_address: shippingInfo
      });

      // Confirm payment
      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        paymentIntentResponse.data.client_secret,
        {
          payment_method: {
            card: cardElement,
          }
        }
      );

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm with backend
        await ordersAPI.confirmPayment({
          payment_intent_id: paymentIntent.id
        });

        setPaymentSuccess(true);
        clearCart();
        
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const generatePlaceholderImage = (width = 100, height = 100) => {
    return `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`;
  };

  if (paymentSuccess) {
    return (
      <div className="checkout">
        <div className="container">
          <div className="success-message card">
            <div className="success-icon">✓</div>
            <h2>Payment Successful!</h2>
            <p>Thank you for your purchase. You will be redirected shortly.</p>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout">
        <div className="container">
          <div className="empty-cart card">
            <h2>Your cart is empty</h2>
            <p>Add some artworks to your cart to proceed with checkout.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/portfolio?for_sale=true')}
            >
              Browse Artworks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="container">
        <div className="checkout-content">
          <div className="checkout-main">
            <h1 className="checkout-title">Checkout</h1>

            {/* Cart Items */}
            <div className="cart-section card">
              <h2 className="section-title">Order Summary</h2>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img
                      src={item.image_url ? `http://localhost:5000${item.image_url}` : generatePlaceholderImage()}
                      alt={item.title}
                      className="cart-item-image"
                    />
                    <div className="cart-item-info">
                      <h3 className="cart-item-title">{item.title}</h3>
                      <p className="cart-item-description">{item.description}</p>
                      <p className="cart-item-price">${item.price}</p>
                    </div>
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="remove-btn"
                      >
                        <Trash2 className="icon" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <strong>Total: ${getTotalAmount().toFixed(2)}</strong>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="shipping-section card">
              <h2 className="section-title">
                <MapPin className="icon" />
                Shipping Information
              </h2>
              <div className="shipping-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      className="form-input"
                      placeholder="Street address"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      className="form-input"
                      placeholder="City"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Postal Code</label>
                    <input
                      type="text"
                      name="postal_code"
                      value={shippingInfo.postal_code}
                      onChange={handleShippingChange}
                      className="form-input"
                      placeholder="Postal code"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      className="form-input"
                      placeholder="Country"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="payment-sidebar">
            <div className="payment-section card">
              <h2 className="section-title">
                <CreditCard className="icon" />
                Payment Details
              </h2>
              
              <form onSubmit={handlePayment} className="payment-form">
                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}

                <div className="card-element-container">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#2c3e50',
                          '::placeholder': {
                            color: '#7f8c8d',
                          },
                        },
                      },
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary payment-btn"
                  disabled={!stripe || loading}
                >
                  {loading ? 'Processing...' : `Pay $${getTotalAmount().toFixed(2)}`}
                </button>
              </form>

              <div className="payment-note">
                <p>
                  <strong>Test Card:</strong> 4242 4242 4242 4242<br />
                  Any future date, any CVC
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;