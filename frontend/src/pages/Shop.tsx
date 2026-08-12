import { Link, useSearchParams } from "react-router-dom";
import { useProducts, type Category } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { cn } from "@/lib/utils";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const { products, categories, loading } = useProducts();

  const category = categories.includes(categoryParam as Category)
    ? (categoryParam as Category)
    : undefined;

  const filtered = category ? products.filter((p) => p.category === category) : products;

  const filters: { label: string; value: Category | undefined }[] = [
    { label: "All", value: undefined },
    ...categories.map((c) => ({ label: c, value: c })),
  ];

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center text-muted-foreground">
        Loading products...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 border-b border-border pb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Our Shop
        </span>
        <h1 className="font-serif text-4xl text-foreground sm:text-5xl">
          {category ?? "All Products"}
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Explore our full catalogue of premium kitchenware, return gifts, and home essentials.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = f.value === category;
          const searchString = f.value ? `?category=${encodeURIComponent(f.value)}` : "";
          return (
            <Link
              key={f.label}
              to={`/shop${searchString}`}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-charcoal bg-charcoal text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-gold hover:text-gold",
              )}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        Showing {filtered.length} product{filtered.length === 1 ? "" : "s"}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
