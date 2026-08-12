import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/products";

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const shipping = subtotal >= 999 || items.length === 0 ? 0 : 60;
  const total = subtotal + shipping;

  const [loading, setLoading] = useState(false);

  // Ensure Razorpay script is loaded
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const customerName = formData.get("name") as string;
    const customerEmail = formData.get("email") as string;
    const phone = formData.get("phone") as string;

    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      const res = await fetch(`${API_URL}/api/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total * 100,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          customerName,
          customerEmail,
          products: items.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
        }),
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.message);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Dhiyaash Trendhub",
        description: "Order Payment",
        order_id: orderData.order_id,
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          try {
            const verifyRes = await fetch(`${API_URL}/api/payments/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: orderData.dbOrderId,
              }),
            });

            if (verifyRes.ok) {
              setOrderId(response.razorpay_order_id);
              setPlaced(true);
              clear();
            } else {
              alert("Payment verification failed");
            }
          } catch (error) {
            alert("Error verifying payment");
          }
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp1 = new (window as unknown as { Razorpay: any }).Razorpay(options);
      rzp1.on("payment.failed", function (response: { error: { description: string } }) {
        alert(`Payment failed: ${response.error.description}`);
      });
      rzp1.open();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message || "Payment initiation failed");
      } else {
        alert("Payment initiation failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !placed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-serif text-4xl">Your cart is empty</h1>
        <Link
          to="/shop"
          className="btn-gold mt-6 inline-flex rounded-full px-6 py-3 text-sm font-semibold"
        >
          Shop now
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl sm:text-5xl">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <form
          onSubmit={onSubmit}
          className="space-y-6 rounded-2xl border border-border/60 bg-card p-6"
        >
          <h2 className="font-serif text-2xl">Shipping Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" name="name" required />
            <Field label="Phone" name="phone" type="tel" required placeholder="+91" />
          </div>
          <Field label="Email" name="email" type="email" required />
          <Field label="Address" name="address" required />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="City" name="city" required />
            <Field label="State" name="state" required />
            <Field label="PIN Code" name="pin" required />
          </div>

          <h3 className="font-serif text-xl pt-2">Payment</h3>
          <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            Pay securely with Razorpay (Cards, UPI, NetBanking).
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-50"
          >
            {loading ? "Processing..." : `Pay ${formatINR(total)}`}
          </button>
        </form>

        <aside className="h-fit rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="font-serif text-xl">Order Summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-center gap-3">
                <img src={product.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-1 text-sm font-medium">{product.name}</div>
                  <div className="text-xs text-muted-foreground">Qty {quantity}</div>
                </div>
                <div className="text-sm font-semibold">{formatINR(product.price * quantity)}</div>
              </li>
            ))}
          </ul>
          <div className="my-4 border-t border-border" />
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatINR(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatINR(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatINR(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>

      {placed && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-charcoal/60 p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-background p-8 text-center shadow-2xl">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold/20 text-gold">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h3 className="mt-5 font-serif text-3xl">Order Placed!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Thank you for shopping with Dhiyaash Trendhub. Your order{" "}
              <span className="font-semibold text-foreground">#{orderId}</span> is confirmed. We'll
              reach out on your provided contact shortly.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => navigate("/shop")}
                className="btn-gold inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate("/")}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Back to home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
        {required && " *"}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30"
      />
    </label>
  );
}
