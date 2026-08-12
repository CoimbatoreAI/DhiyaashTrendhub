import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Truck, ShieldCheck } from "lucide-react";
import { useProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

const categoryImages: Record<string, string> = {
  Kitchen: "/kitchen_set.png",
  "Return Gifts": "/paper_bags.png",
  "Home & Bath": "/bath_mat.png",
};

export default function Home() {
  const { products, categories, loading } = useProducts();
  const featured = products.slice(0, 6);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_80%_20%,color-mix(in_oklab,var(--gold)_25%,transparent),transparent_70%)]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal">
              <Sparkles className="h-3.5 w-3.5" /> New Season · 2026
            </span>
            <h1 className="mt-5 font-serif text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-6xl">
              Discover Premium Trends for Your <span className="text-gold">Home &amp; Gifting</span>{" "}
              Needs
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Thoughtfully curated kitchenware, artisan return gifts, and everyday home essentials —
              designed to make every moment feel special.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
              >
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-charcoal/20 bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Contact Us
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:text-sm">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-gold" /> Pan-India delivery
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gold" /> Quality assured
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold" /> Gift-ready packing
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl border border-border/60 bg-secondary shadow-[0_30px_80px_-30px_color-mix(in_oklab,var(--charcoal)_35%,transparent)]">
              <img
                src="/hero_main.png"
                alt="Premium curated home and gifting collection"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 hidden w-56 rotate-[-4deg] overflow-hidden rounded-2xl border border-border/60 bg-card p-2 shadow-xl sm:block">
              <img
                src="/hero_side.png"
                alt=""
                className="aspect-square w-full rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Collections
            </span>
            <h2 className="mt-2 font-serif text-3xl text-foreground sm:text-4xl">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden text-sm font-semibold text-foreground hover:text-gold sm:inline-flex sm:items-center sm:gap-1"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {!loading &&
            categories.map((cat) => (
              <Link
                key={cat}
                to={`/shop?category=${encodeURIComponent(cat)}`}
                className="card-hover group relative block overflow-hidden rounded-3xl border border-border/60 bg-card"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={categoryImages[cat] || "/placeholder.png"}
                    alt={cat}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-serif text-2xl text-primary-foreground">{cat}</h3>
                  <div className="mt-1 inline-flex items-center gap-1 text-sm text-gold">
                    Explore <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Bestsellers
            </span>
            <h2 className="mt-2 font-serif text-3xl text-foreground sm:text-4xl">
              Featured Products
            </h2>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-foreground hover:text-gold">
            See all →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {loading ? (
            <div className="text-muted-foreground">Loading products...</div>
          ) : (
            featured.map((p) => <ProductCard key={p.id} product={p} />)
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-charcoal px-8 py-14 text-center text-primary-foreground sm:px-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_50%_0%,color-mix(in_oklab,var(--gold)_35%,transparent),transparent_70%)]" />
          <h2 className="font-serif text-3xl sm:text-4xl">Gifting made effortless.</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/70">
            Bulk return gifts, custom hampers, and festive collections — reach out and we'll help
            you pick the perfect fit.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-charcoal transition-transform hover:-translate-y-0.5"
          >
            Browse the Collection <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
