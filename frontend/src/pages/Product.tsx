import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { useProduct, useProducts, formatINR } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { ProductCard } from "@/components/product-card";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading: productLoading } = useProduct(id);
  const { products, loading: productsLoading } = useProducts();

  const { add } = useCart();
  const [qty, setQty] = useState(1);

  if (productLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center text-muted-foreground">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-serif text-4xl">Product not found</h1>
        <Link
          to="/shop"
          className="btn-gold mt-6 inline-flex rounded-full px-6 py-3 text-sm font-semibold"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/shop"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2 md:items-start">
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            {product.category}
          </span>
          <h1 className="mt-2 font-serif text-4xl text-foreground sm:text-5xl">{product.name}</h1>
          <div className="mt-4 text-3xl font-semibold text-charcoal">
            {formatINR(product.price)}
          </div>
          <div className="mt-2 inline-flex items-center rounded-full bg-green-100/80 px-2.5 py-0.5 text-xs font-medium text-green-800">
            In Stock (Ready to dispatch)
          </div>
          <p className="mt-5 text-muted-foreground">{product.description}</p>

          <div className="mt-8 flex items-center gap-4">
            <div className="inline-flex items-center rounded-full border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-11 w-11 place-items-center rounded-full hover:bg-secondary"
                aria-label="Decrease"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="grid h-11 w-11 place-items-center rounded-full hover:bg-secondary"
                aria-label="Increase"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => {
                add(product, qty);
                toast.success(`Added ${qty} × ${product.name} to cart`);
              }}
              className="btn-gold inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
            >
              <ShoppingBag className="h-4 w-4" /> Add to Cart
            </button>
            <button
              onClick={() => {
                add(product, qty);
                navigate("/checkout");
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-charcoal/90"
            >
              Buy Now
            </button>
          </div>

          <ul className="mt-8 space-y-2 border-t border-border pt-6 text-sm text-muted-foreground">
            <li>• Premium quality, thoughtfully curated</li>
            <li>• Gift-ready packaging available</li>
            <li>• Ships across India from Tirupur, Tamil Nadu</li>
          </ul>
        </div>
      </div>

      {!productsLoading && related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-2xl sm:text-3xl">You may also like</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
