import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatINR, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <div className="group card-hover flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card">
      <Link
        to={`/products/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-secondary"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-charcoal">
          {product.category}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <Link
            to={`/products/${product.id}`}
            className="line-clamp-1 font-serif text-lg font-semibold text-foreground hover:text-gold"
          >
            {product.name}
          </Link>
          <div className="mt-1 text-base font-semibold text-charcoal">
            {formatINR(product.price)}
          </div>
        </div>
        <button
          onClick={() => {
            add(product);
            toast.success(`${product.name} added to cart`);
          }}
          className="btn-gold mt-auto inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
