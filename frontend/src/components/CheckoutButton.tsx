import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CheckoutButtonProps {
  amount: number; // Amount in rupees
  customerName: string;
  customerEmail: string;
  products: { productId: string; productName: string; quantity: number; price: number }[];
}

export function CheckoutButton({
  amount,
  customerName,
  customerEmail,
  products,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create order on backend
      const res = await fetch(`${API_URL}/api/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount * 100, // convert to paise
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          customerName,
          customerEmail,
          products,
        }),
      });

      const orderData = await res.json();

      if (!res.ok) {
        throw new Error(orderData.message || "Failed to create order");
      }

      // 2. Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Dhiyaash Trendhub",
        description: "Test Transaction",
        order_id: orderData.order_id,
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          // 3. Verify signature on backend
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

            const verifyData = await verifyRes.json();

            if (verifyRes.ok) {
              toast.success("Payment successful!");
              // In a real app, clear cart and redirect to order success page
            } else {
              toast.error(verifyData.message || "Payment verification failed");
            }
          } catch (error) {
            toast.error("Error verifying payment");
          }
        },
        prefill: {
          name: customerName,
          email: customerEmail,
        },
        theme: {
          color: "#3399cc",
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp1 = new (window as unknown as { Razorpay: any }).Razorpay(options);

      rzp1.on("payment.failed", function (response: { error: { description: string } }) {
        toast.error(`Payment failed: ${response.error.description}`);
      });

      rzp1.open();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Payment initiation failed");
      } else {
        toast.error("Payment initiation failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePayment} disabled={loading} className="w-full mt-4">
      {loading ? "Processing..." : `Pay ₹${amount}`}
    </Button>
  );
}
