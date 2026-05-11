import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { createCheckout, getMyCoupons, getEventById, getPoint } from "../service/api";

export default function Checkout() {
  const { id } = useParams();
  const eventId = Number(id);

  const [event, setEvent] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("BANK");
  const [couponId, setCouponId] = useState<number | "">("");
  const [coupons, setCoupons] = useState<any[]>([]);
  const [usePoint, setUsePoint] = useState(false);
  const [userPoint, setUserPoint] = useState(0);
  
  const fetchEvent = async () => {
    try {
      const data = await getEventById(eventId);
      setEvent(data);
    } catch (err) {
      console.error("FETCH EVENT ERROR:", err);
    }
  };

  const fetchCoupons = async () => {
    try {
      const data = await getMyCoupons();
      setCoupons(data);
    } catch (err) {
      console.error("Coupon error:", err);
    }
  };

  const fetchPoint = async () => {
    try {
      const data = await getPoint();

      console.log("POINT DATA:", data);

      setUserPoint(data.data[0]?.amount || 0);
    } catch (err) {
      console.error("Point error:", err);
    }
  };

  useEffect(() => {
    if (eventId) fetchEvent();
    fetchCoupons();
    fetchPoint();
  }, [eventId]);

  const handlePayment = async () => {
    try {
      setLoading(true);

      await createCheckout({
        eventId,
        quantity,
        couponId: couponId || undefined,
        usePoint,
      });

      alert("Checkout successful!");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!event) return <p className="p-4 sm:p-6 text-gray-400">Loading...</p>;

  const totalPrice = event.price * quantity;

  const selectedCoupon = coupons.find((c) => c.id === couponId);

  const discount = selectedCoupon
    ? (totalPrice * selectedCoupon.discount) / 100
    : 0;

  const pointDiscount = usePoint ? userPoint : 0;

  const finalPrice = Math.max(
    totalPrice - discount - pointDiscount,
    0
  );

  return (
    <div className="text-white p-4 sm:p-6 max-w-xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6">
        Checkout
      </h1>

      <div className="bg-gray-900 p-3 sm:p-4 rounded-xl mb-4 border border-gray-800">
        <h2 className="font-bold text-base sm:text-lg text-white mb-1">
          {event.title}
        </h2>

        <p className="text-sm">
          Price:{" "}
          <span className="text-yellow-400">
            Rp {event.price.toLocaleString()}
          </span>
        </p>

        <p className="text-xs sm:text-sm text-gray-400">
          Available Seat: {event.availableSeats}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        
        <div>
          <label className="text-xs sm:text-sm text-gray-400">
            Quantity
          </label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="p-2 rounded bg-gray-800 text-white w-full mt-1"
          />
        </div>

        <div>
          <label className="text-xs sm:text-sm text-gray-400">
            Select Coupon
          </label>
          <select
            value={couponId}
            onChange={(e) =>
              setCouponId(e.target.value ? Number(e.target.value) : "")
            }
            className="p-2 rounded bg-gray-800 text-white w-full mt-1"
          >
            <option value="">-- No Coupon --</option>

            {coupons.map((c) => (
              <option key={c.id} value={c.id}>
                Diskon {c.discount}% (exp:{" "}
                {new Date(c.expiresAt).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        <div
          onClick={() => setUsePoint(!usePoint)}
          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition
            ${
              usePoint
                ? "bg-gray-800 border-gray-600"
                : "bg-gray-900 border-gray-800 hover:bg-gray-800"
            }
          `}
        >
          <span className="text-xs sm:text-sm font-medium text-white">
            Use Point
          </span>

          <div
            className={`w-5 h-5 rounded border flex items-center justify-center transition
              ${
                usePoint
                  ? "bg-gray-700 border-gray-500"
                  : "border-gray-500"
              }
            `}
          >
            {usePoint && <span className="text-xs text-white">✓</span>}
          </div>
        </div>

        <div>
          <label className="text-xs sm:text-sm text-gray-400">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white w-full mt-1"
          >
            <option value="BANK">Bank</option>
            <option value="EWALLET">E-Wallet</option>
          </select>
        </div>
      </div>

      <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-gray-900 rounded-xl border border-gray-800 space-y-2">

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Subtotal</span>
          <span>Rp {totalPrice.toLocaleString()}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-400">
            <span>Coupon Discount</span>
            <span>- Rp {discount.toLocaleString()}</span>
          </div>
        )}

        {usePoint && (
          <div className="flex justify-between text-sm text-green-400">
            <span>Point Used</span>
            <span>- Rp {pointDiscount.toLocaleString()}</span>
          </div>
        )}

        <div className="border-t border-gray-700 pt-2 flex justify-between font-bold text-base sm:text-lg">
          <span>Total Payment</span>

          <span className="text-yellow-400">
            Rp {finalPrice.toLocaleString()}
          </span>
        </div>

      </div>

      
      <button
        onClick={handlePayment}
        disabled={loading}
        className="mt-4 w-full bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:opacity-90 text-sm sm:text-base"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}