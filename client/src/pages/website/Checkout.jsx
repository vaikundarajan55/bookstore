import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Plus,
  Wallet,
  CreditCard,
  Landmark,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";
// import { getCartData } from "../../Redux/slices/cartSlice"; // adjust to your actual cart slice
// import { getAddresses, placeOrder } from "../../Redux/slices/orderSlice"; // adjust to your actual order slice

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", helper: "Pay via any UPI app", icon: Wallet },
  { id: "card", label: "Card", helper: "Credit or debit card", icon: CreditCard },
  { id: "cod", label: "Cash on Delivery", helper: "Pay when it arrives", icon: Landmark },
];

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const status = useSelector((state) => state.cart?.status);
  const cartItems = useSelector((state) => state.cart?.items ?? []);
  // Adjust to your actual address slice shape
  const addresses = useSelector((state) => state.order?.addresses ?? []);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("upi");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    // if (status === 'idle') dispatch(getCartData());
    // dispatch(getAddresses());
  }, [dispatch, status]);

  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      const defaultAddr = addresses.find((a) => a.is_default) ?? addresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses, selectedAddressId]);

  const isLoading = status === "loading" || status === "idle";

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.book_price) || 0) * (item.quantity ?? 1),
    0
  );
  const shipping = subtotal > 0 ? 49 : 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    if (!selectedAddressId || cartItems.length === 0) return;
    setIsPlacingOrder(true);
    // dispatch(placeOrder({ addressId: selectedAddressId, paymentMethod: selectedPayment }))
    //   .unwrap()
    //   .then(() => navigate("/orders"))
    //   .finally(() => setIsPlacingOrder(false));
    setTimeout(() => setIsPlacingOrder(false), 1200); // placeholder
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 checkout-header">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors duration-150"
            >
              <ArrowLeft size={18} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
              <p className="text-sm text-gray-500">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your order
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 h-40 animate-pulse" />
              <div className="bg-white rounded-2xl border border-gray-100 p-6 h-40 animate-pulse" />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 h-56 animate-pulse" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center checkout-empty-state">
            <div className="w-24 h-24 rounded-full bg-purple-50 flex items-center justify-center mb-5 checkout-empty-icon">
              <ShoppingBag size={36} className="text-purple-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Your cart is empty</h3>
            <p className="text-sm text-gray-400 mt-1 mb-6">Add some books before checking out.</p>
            <Link
              to="/"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-purple-700 hover:bg-purple-800 text-white transition-all duration-200 active:scale-95"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Shipping address */}
              <div className="checkout-section bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={16} className="text-purple-700" />
                  Shipping Address
                </h3>

                <div className="space-y-3">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <button
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`w-full text-left rounded-xl border p-4 flex items-start gap-3 transition-all duration-150
                          ${isSelected
                            ? "border-purple-700 bg-purple-50/60 ring-1 ring-purple-700"
                            : "border-gray-200 hover:border-gray-300"}`}
                      >
                        <div
                          className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                            ${isSelected ? "border-purple-700" : "border-gray-300"}`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-purple-700" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 text-sm">{addr.label ?? "Address"}</span>
                            {addr.is_default && (
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5 truncate">
                            {addr.line1}, {addr.city}, {addr.state} {addr.pincode}
                          </p>
                        </div>
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setShowAddressForm((v) => !v)}
                    className="w-full rounded-xl border border-dashed border-gray-300 p-4 flex items-center justify-center gap-2 text-sm font-medium text-purple-700 hover:bg-purple-50/60 transition-colors duration-150"
                  >
                    <Plus size={16} />
                    Add a new address
                  </button>

                  {showAddressForm && (
                    <div className="rounded-xl border border-gray-200 p-4 space-y-3 checkout-address-form">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Full name"
                          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                        />
                        <input
                          type="tel"
                          placeholder="Phone number"
                          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Address line"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="City"
                          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                        />
                        <input
                          type="text"
                          placeholder="State"
                          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                        />
                        <input
                          type="text"
                          placeholder="Pincode"
                          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setShowAddressForm(false)}
                          className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-150"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => setShowAddressForm(false)}
                          className="px-4 py-2 rounded-lg text-sm font-semibold bg-purple-700 hover:bg-purple-800 text-white transition-colors duration-150"
                        >
                          Save Address
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment method */}
              <div className="checkout-section bg-white rounded-2xl border border-gray-100 p-5" style={{ animationDelay: "80ms" }}>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Wallet size={16} className="text-purple-700" />
                  Payment Method
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PAYMENT_METHODS.map((method) => {
                    const isSelected = selectedPayment === method.id;
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`rounded-xl border p-4 flex flex-col items-start gap-2 text-left transition-all duration-150
                          ${isSelected
                            ? "border-purple-700 bg-purple-50/60 ring-1 ring-purple-700"
                            : "border-gray-200 hover:border-gray-300"}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <Icon size={18} className={isSelected ? "text-purple-700" : "text-gray-400"} />
                          {isSelected && <CheckCircle2 size={16} className="text-purple-700" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{method.label}</p>
                          <p className="text-xs text-gray-400">{method.helper}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Item list (compact) */}
              <div className="checkout-section bg-white rounded-2xl border border-gray-100 p-5" style={{ animationDelay: "140ms" }}>
                <h3 className="font-semibold text-gray-900 mb-4">Items</h3>
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <div
                        className="w-12 h-14 rounded-lg shrink-0 overflow-hidden flex items-center justify-center text-center p-1 text-[9px] font-semibold"
                        style={{ backgroundColor: item.bg || "#EEEDFE", color: item.color || "#26215C" }}
                      >
                        {item.book_image_url ? (
                          <img
                            src={item.book_image_url}
                            alt={item.book_name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                        ) : (
                          item.book_name
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.book_name}</p>
                        <p className="text-xs text-gray-400">Qty {item.quantity ?? 1}</p>
                      </div>
                      <span className="text-sm font-semibold text-purple-800 shrink-0">
                        ₹{((Number(item.book_price) || 0) * (item.quantity ?? 1)).toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit lg:sticky lg:top-6 checkout-summary">
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
                onClick={handlePlaceOrder}
                disabled={!selectedAddressId || isPlacingOrder}
                className="w-full mt-6 py-3 rounded-xl text-sm font-semibold bg-purple-700 hover:bg-purple-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isPlacingOrder ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>

              {!selectedAddressId && (
                <p className="text-xs text-red-400 text-center mt-2">Select an address to continue</p>
              )}

              <Link
                to="/cart"
                className="block text-center text-sm text-purple-700 font-medium mt-3 hover:text-purple-800"
              >
                Back to Cart
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes checkoutFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .checkout-header {
          animation: checkoutFadeUp 0.4s ease-out both;
        }
        .checkout-section {
          animation: checkoutFadeUp 0.4s ease-out both;
        }
        .checkout-summary {
          animation: checkoutFadeUp 0.5s ease-out 0.2s both;
        }
        .checkout-address-form {
          animation: checkoutFadeUp 0.25s ease-out both;
        }

        @keyframes checkoutEmptyFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .checkout-empty-icon {
          animation: checkoutEmptyFloat 2.5s ease-in-out infinite;
        }
        .checkout-empty-state {
          animation: checkoutFadeUp 0.5s ease-out both;
        }
      `}</style>
    </div>
  );
}