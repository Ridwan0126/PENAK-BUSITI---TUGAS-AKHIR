import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCartStore } from '../stores/cartStore'

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCartStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Start adding services to your cart!</p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-6 border-b border-gray-200 last:border-b-0">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">{item.category}</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="px-3 py-1 font-semibold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Price and Remove */}
                    <div className="text-right flex flex-col justify-between">
                      <div>
                        <p className="text-xl font-bold text-gray-900">
                          Rp{(item.price * item.quantity).toLocaleString('id-ID')}
                        </p>
                        <p className="text-sm text-gray-500">
                          Rp{item.price.toLocaleString('id-ID')} each
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1 justify-end"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={clearCart}
                className="mt-4 text-red-600 hover:text-red-700 font-medium"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Rp{getTotalPrice().toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>Rp{Math.round(getTotalPrice() * 0.1).toLocaleString('id-ID')}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-gray-900">
                    <span>Total</span>
                    <span>Rp{Math.round(getTotalPrice() * 1.1).toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="w-full block text-center px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-green-700 transition mb-3"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to="/products"
                  className="w-full block text-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Continue Shopping
                </Link>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Items in cart:</span> {getTotalItems()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
