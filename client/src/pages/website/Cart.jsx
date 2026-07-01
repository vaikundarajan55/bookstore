import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
// import { getCartData, updateCartQuantity, removeFromCart } from "../../Redux/slices/cartSlice"; // adjust to your actual cart slice

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Adjust these selectors to match your actual cart slice shape
  const status = useSelector((state) => state.cart?.status);
  const cartItems = useSelector((state) => state.cart?.items ?? []);

  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    // if (status === 'idle') dispatch(getCartData());
  }, [dispatch, status]);

  const isLoading = status === 'loading' || status === 'idle';

  const handleQtyChange = (item, delta) => {
    const newQty = (item.quantity ?? 1) + delta;
    if (newQty < 1) return;
    // dispatch(updateCartQuantity({ id: item.id, quantity: newQty }));
  };

  const handleRemove = (item) => {
    setRemovingId(item.id);
    setTimeout(() => {
      // dispatch(removeFromCart(item.id));
      setRemovingId(null);
    }, 300); // matches the exit animation duration below
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.book_price) || 0) * (item.quantity ?? 1),
    0
  );
  const shipping = subtotal > 0 ? 49 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 cart-header">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors duration-150"
            >
              <ArrowLeft size={18} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
              <p className="text-sm text-gray-500">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 animate-pulse">
                  <div className="w-24 h-28 bg-gray-200 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 h-56 animate-pulse" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center cart-empty-state">
            <div className="w-24 h-24 rounded-full bg-purple-50 flex items-center justify-center mb-5 cart-empty-icon">
              <ShoppingBag size={36} className="text-purple-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Your cart is empty</h3>
            <p className="text-sm text-gray-400 mt-1 mb-6">Looks like you haven't added any books yet.</p>
            <Link
              to="/"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-purple-700 hover:bg-purple-800 text-white transition-all duration-200 active:scale-95"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`cart-item bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 hover:shadow-md transition-shadow duration-200
                    ${removingId === item.id ? "cart-item-exit" : ""}`}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div
                    className="w-24 h-28 rounded-xl shrink-0 overflow-hidden flex items-center justify-center text-center p-2 text-xs font-semibold"
                    style={{ backgroundColor: item.bg || "#EEEDFE", color: item.color || "#26215C" }}
                  >
                    {item.book_image_url ? (
                      <img
                        src={item.book_image_url}
                        alt={item.book_name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      item.book_name
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="font-semibold text-gray-900 truncate">{item.book_name}</h3>
                      <p className="text-sm text-gray-500 truncate">{item.book_author}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity stepper */}
                      <div className="flex items-center gap-1 border border-gray-200 rounded-lg">
                        <button
                          onClick={() => handleQtyChange(item, -1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-l-lg transition-colors duration-150 active:scale-90"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-gray-800">
                          {item.quantity ?? 1}
                        </span>
                        <button
                          onClick={() => handleQtyChange(item, 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-r-lg transition-colors duration-150 active:scale-90"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-purple-800">
                          ₹{((Number(item.book_price) || 0) * (item.quantity ?? 1)).toFixed(0)}
                        </span>
                        <button
                          onClick={() => handleRemove(item)}
                          className="text-gray-400 hover:text-red-500 transition-colors duration-150 active:scale-90"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit lg:sticky lg:top-6 cart-summary">
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-800">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-gray-800">₹{shipping}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between font-semibold text-gray-900">
                  <span>Total</span>
                  <span className="text-purple-800">₹{total.toFixed(0)}</span>
                </div>
              </div>
              <button
                className="w-full mt-6 py-3 rounded-xl text-sm font-semibold bg-purple-700 hover:bg-purple-800 text-white transition-all duration-200 active:scale-[0.98]"
              >
                Proceed to Checkout
              </button>
              <Link
                to="/"
                className="block text-center text-sm text-purple-700 font-medium mt-3 hover:text-purple-800"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes cartFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cart-header {
          animation: cartFadeUp 0.4s ease-out both;
        }
        .cart-item {
          animation: cartFadeUp 0.4s ease-out both;
        }
        .cart-summary {
          animation: cartFadeUp 0.5s ease-out 0.15s both;
        }

        @keyframes cartItemExit {
          from { opacity: 1; transform: translateX(0); max-height: 200px; margin-bottom: 16px; }
          to { opacity: 0; transform: translateX(40px); max-height: 0; margin-bottom: 0; padding-top: 0; padding-bottom: 0; overflow: hidden; }
        }
        .cart-item-exit {
          animation: cartItemExit 0.3s ease-in forwards;
        }

        @keyframes cartEmptyFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .cart-empty-icon {
          animation: cartEmptyFloat 2.5s ease-in-out infinite;
        }
        .cart-empty-state {
          animation: cartFadeUp 0.5s ease-out both;
        }
      `}</style>
    </div>
  );
}