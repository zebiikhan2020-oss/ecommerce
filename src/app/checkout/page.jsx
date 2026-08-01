"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // <-- useSearchParams import kiya

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedItemsParam = searchParams.get("items"); // e.g. "12,15,18"

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedCourier, setSelectedCourier] = useState("");

  const [useManualAddress, setUseManualAddress] = useState(false);
  const [useManualPayment, setUseManualPayment] = useState(false);
  
  const [manualAddress, setManualAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Pakistan",
  });

  const [manualPayment, setManualPayment] = useState({
    type: "COD",
    label: "Cash on Delivery",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [cartRes, addressesRes, paymentMethodsRes, couriersRes] =
        await Promise.all([
          fetch("/api/cart"),
          fetch("/api/addresses"),
          fetch("/api/payment-methods"),
          fetch("/api/couriers"),
        ]);

      const cartData = await cartRes.json();
      const addressesData = await addressesRes.json();
      const paymentMethodsData = await paymentMethodsRes.json();
      const couriersData = await couriersRes.json();

      let fetchedCart = cartData.cart;

      // AGAR URL MEIN SPECIFIC ITEMS HAIN, TOH SIRF UNHI KO FILTER KARO
      if (fetchedCart && fetchedCart.items && selectedItemsParam) {
        const targetIds = selectedItemsParam.split(",").map(id => Number(id));
        fetchedCart = {
          ...fetchedCart,
          items: fetchedCart.items.filter(item => targetIds.includes(item.id))
        };
      }

      setCart(fetchedCart);
      setAddresses(addressesData.addresses || []);
      setPaymentMethods(paymentMethodsData.paymentMethods || []);
      setCouriers(couriersData.couriers || []);

      if (addressesData.addresses?.length > 0) {
        const defaultAddr = addressesData.addresses.find((a) => a.isDefault);
        setSelectedAddress(String(defaultAddr?.id || addressesData.addresses[0].id));
      } else {
        setUseManualAddress(true);
      }

      if (paymentMethodsData.paymentMethods?.length > 0) {
        const defaultPM = paymentMethodsData.paymentMethods.find((p) => p.isDefault);
        setSelectedPaymentMethod(
          String(defaultPM?.id || paymentMethodsData.paymentMethods[0].id)
        );
      } else {
        setUseManualPayment(true);
      }

      if (couriersData.couriers?.length > 0) {
        setSelectedCourier(String(couriersData.couriers[0].id));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function placeOrder() {
    if (useManualAddress) {
      if (
        !manualAddress.fullName ||
        !manualAddress.phone ||
        !manualAddress.street ||
        !manualAddress.city ||
        !manualAddress.zipCode
      ) {
        alert("Please fill in all required manual address fields.");
        return;
      }
    } else if (!selectedAddress) {
      alert("Please select a saved delivery address or enter a new one.");
      return;
    }

    if (useManualPayment) {
      if (!manualPayment.label) {
        alert("Please enter a payment method label.");
        return;
      }
    } else if (!selectedPaymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    if (!selectedCourier) {
      alert("Please select a shipping courier.");
      return;
    }

    setPlacingOrder(true);
    try {
      // Cart items ki IDs nikal lein jo checkout ho rahi hain
      const itemIdsToCheckout = cart.items.map(item => item.id);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId: useManualAddress ? null : Number(selectedAddress),
          paymentMethodId: useManualPayment ? null : Number(selectedPaymentMethod),
          courierId: Number(selectedCourier),
          manualAddress: useManualAddress ? manualAddress : null,
          manualPayment: useManualPayment ? manualPayment : null,
          selectedItemIds: itemIdsToCheckout, // <-- Backend ko bhej diya taake sirf yehi items clear hon
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      alert(data.message || "Order placed successfully!");
      router.push("/buyer/orders");
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong while placing the order.");
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-700">Loading Checkout...</span>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 font-sans">
        <div className="text-center space-y-4 max-w-sm bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mx-auto border border-blue-100">
            🛒
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">No Items Selected</h2>
            <p className="text-xs text-slate-500 mt-1">Please select items from your cart to proceed.</p>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const selectedCourierData = couriers.find((c) => c.id === Number(selectedCourier));
  const shippingCost = selectedCourierData ? selectedCourierData.basePrice : 0;
  const totalPrice = subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
            Secure Process
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Checkout & Order
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Complete your delivery details, payment method, and review your order.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Forms & Selections */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Address Selection */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>📍</span> Delivery Address
                </h2>
                {addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setUseManualAddress(!useManualAddress)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    {useManualAddress ? "Select Saved Address" : "+ Enter New Address"}
                  </button>
                )}
              </div>

              {useManualAddress || addresses.length === 0 ? (
                <div className="space-y-4 pt-2">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={manualAddress.fullName}
                        onChange={(e) => setManualAddress({...manualAddress, fullName: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone *</label>
                      <input
                        type="text"
                        value={manualAddress.phone}
                        onChange={(e) => setManualAddress({...manualAddress, phone: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                        placeholder="+92 300 1234567"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Street Address *</label>
                    <input
                      type="text"
                      value={manualAddress.street}
                      onChange={(e) => setManualAddress({...manualAddress, street: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                      placeholder="House #123, Street #4, Area"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City *</label>
                      <input
                        type="text"
                        value={manualAddress.city}
                        onChange={(e) => setManualAddress({...manualAddress, city: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                        placeholder="Islamabad"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">State</label>
                      <input
                        type="text"
                        value={manualAddress.state}
                        onChange={(e) => setManualAddress({...manualAddress, state: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                        placeholder="Punjab"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Zip Code *</label>
                      <input
                        type="text"
                        value={manualAddress.zipCode}
                        onChange={(e) => setManualAddress({...manualAddress, zipCode: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                        placeholder="44000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Country</label>
                      <input
                        type="text"
                        value={manualAddress.country}
                        onChange={(e) => setManualAddress({...manualAddress, country: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                  {addresses.map((address) => {
                    const formattedDate = address.createdAt 
                      ? new Date(address.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })
                      : null;

                    return (
                      <div
                        key={address.id}
                        className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                          selectedAddress === String(address.id)
                            ? "border-blue-600 bg-blue-50/50 shadow-xs"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                        onClick={() => setSelectedAddress(String(address.id))}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="font-bold text-sm text-slate-900">{address.fullName}</p>
                            <p className="text-xs text-slate-600">{address.phone}</p>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {address.street}, {address.city}
                              {address.state && `, ${address.state}`} ({address.zipCode})
                            </p>
                            {formattedDate && (
                              <p className="text-[10px] text-slate-400 font-medium pt-1">
                                Added: {formattedDate}
                              </p>
                            )}
                          </div>
                          {address.isDefault && (
                            <span className="bg-blue-100 text-blue-700 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>💳</span> Payment Method
                </h2>
                {paymentMethods.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setUseManualPayment(!useManualPayment)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    {useManualPayment ? "Select Saved Payment" : "+ Enter New Payment"}
                  </button>
                )}
              </div>

              {useManualPayment || paymentMethods.length === 0 ? (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Payment Type</label>
                    <select
                      value={manualPayment.type}
                      onChange={(e) => {
                        const val = e.target.value;
                        let defaultLabel = "Cash on Delivery";
                        if (val === "EASYPAISA") defaultLabel = "Easypaisa Mobile Account";
                        if (val === "JAZZCASH") defaultLabel = "JazzCash Mobile Account";
                        if (val === "CARD") defaultLabel = "Credit/Debit Card";
                        if (val === "BANK_TRANSFER") defaultLabel = "Bank Transfer";

                        setManualPayment({ type: val, label: defaultLabel });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                    >
                      <option value="COD">Cash on Delivery (COD)</option>
                      <option value="EASYPAISA">Easypaisa</option>
                      <option value="JAZZCASH">JazzCash</option>
                      <option value="CARD">Credit/Debit Card</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Payment Label *</label>
                    <input
                      type="text"
                      value={manualPayment.label}
                      onChange={(e) => setManualPayment({...manualPayment, label: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                      placeholder="e.g., Cash on Delivery, Easypaisa Account"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                  {paymentMethods.map((pm) => (
                    <div
                      key={pm.id}
                      className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                        selectedPaymentMethod === String(pm.id)
                          ? "border-blue-600 bg-blue-50/50 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                      onClick={() => setSelectedPaymentMethod(String(pm.id))}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-sm text-slate-900">{pm.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {pm.type} {pm.last4 && `•••• ${pm.last4}`}
                          </p>
                        </div>
                        {pm.isDefault && (
                          <span className="bg-blue-100 text-blue-700 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Courier Selection */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
                <span>🚚</span> Shipping Courier
              </h2>
              {couriers.length === 0 ? (
                <p className="text-xs text-slate-500">No couriers available</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                  {couriers.map((courier) => (
                    <div
                      key={courier.id}
                      className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                        selectedCourier === String(courier.id)
                          ? "border-blue-600 bg-blue-50/50 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                      onClick={() => setSelectedCourier(String(courier.id))}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-bold text-sm text-slate-900">{courier.name}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{courier.description}</p>
                          <p className="text-[11px] font-semibold text-slate-600">
                            Estimated: {courier.estimatedDays} days
                          </p>
                        </div>
                        <p className="font-black text-sm text-blue-600">
                          Rs. {courier.basePrice}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
                Order Summary
              </h2>
              
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 pb-3 border-b border-slate-100"
                  >
                    <img
                      src={
                        item.product.image
                          ? `/images/${item.product.image}`
                          : "/images/no-image.png"
                      }
                      alt={item.product.title}
                      className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xs text-slate-900 truncate">
                        {item.product.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-extrabold text-xs text-slate-900">
                      Rs. {item.product.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2 text-xs font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-slate-900">Rs. {shippingCost}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-100">
                  <span>Total Amount</span>
                  <span className="text-blue-600">Rs. {totalPrice}</span>
                </div>
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={placingOrder}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl shadow-md transition-all disabled:bg-slate-300 disabled:cursor-not-allowed font-bold text-xs uppercase tracking-wider cursor-pointer text-center"
            >
              {placingOrder ? "Placing Order..." : "Confirm & Place Order 🚀"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}