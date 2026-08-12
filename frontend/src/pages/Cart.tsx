import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/products";

export default function CartPage() {
  const { items, setQty, remove, subtotal, count } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-secondary">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-serif text-4xl">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Start exploring our curated collection.</p>
        <Link
          to="/shop"
          className="btn-gold mt-8 inline-flex rounded-full px-6 py-3 text-sm font-semibold"
        >
          Shop now
        </Link>
      </div>
    );
  }

  const shipping = subtotal >= 999 ? 0 : 60;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl sm:text-5xl">Your Cart</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {count} item{count === 1 ? "" : "s"}
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-4">
          {items.map(({ product, quantity }) => (
            <li
              key={product.id}
              className="grid grid-cols-[80px_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 sm:grid-cols-[100px_minmax(0,1fr)_auto_auto]"
            >
              <img
                src={product.image}
                alt={product.name}
                className="aspect-square w-full rounded-xl object-cover"
              />
              <div className="min-w-0">
                <Link
                  to={`/products/${product.id}`}
                  className="line-clamp-1 font-serif text-lg hover:text-gold"
                >
                  {product.name}
                </Link>
                <div className="text-xs text-muted-foreground">{product.category}</div>
                <div className="mt-1 text-sm font-semibold text-charcoal">
                  {formatINR(product.price)}
                </div>
              </div>
              <div className="col-span-3 flex items-center justify-between gap-3 sm:col-span-1">
                <div className="inline-flex items-center rounded-full border border-border">
                  <button
                    onClick={() => setQty(product.id, quantity - 1)}
                    className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
                    aria-label="Decrease"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-7 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQty(product.id, quantity + 1)}
                    className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
                    aria-label="Increase"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="col-start-3 flex flex-col items-end gap-2 sm:col-start-4">
                <div className="font-semibold">{formatINR(product.price * quantity)}</div>
                <button
                  onClick={() => remove(product.id)}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="font-serif text-xl">Order Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatINR(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatINR(shipping)}</dd>
            </div>
          </dl>
          <div className="my-4 border-t border-border" />
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-serif text-2xl text-charcoal">{formatINR(total)}</span>
          </div>
          <Link
            to="/checkout"
            className="btn-gold mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
          >
            Proceed to Checkout <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/shop"
            className="mt-3 block text-center text-sm text-muted-foreground hover:text-foreground"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
