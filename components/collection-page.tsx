import Link from "next/link";
import { ShopCard } from "@/components/shop-card";
import { collections, getCollection, type Gender } from "@/lib/products";

const copy = {
  women: { label: "Women", title: "For her,", accent: "her own way.", note: "Three edits, fifteen pieces. Pick a size, add it to your bag, or buy it straight away.", other: "men", otherLabel: "Shop men" },
  men: { label: "Men", title: "For him,", accent: "no fuss.", note: "Three edits, fifteen pieces. Pick a size, add it to your bag, or buy it straight away.", other: "women", otherLabel: "Shop women" },
} as const;

export function CollectionPage({ gender }: { gender: Gender }) {
  const page = copy[gender];

  return (
    <main>
      <section className="page-hero page-wrap">
        <div>
          <p className="eyebrow">The Invizz collection / {page.label}</p>
          <h1>{page.title}<br /><em>{page.accent}</em></h1>
        </div>
        <div className="page-hero-note">
          <p>{page.note}</p>
          <Link className="text-link" href={`/your-styles/${page.other}`}>{page.otherLabel} <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      {collections.map((collection) => {
        const items = getCollection(gender, collection.id);
        if (!items.length) return null;
        return (
          <section className="shop-section page-wrap" id={collection.id} key={collection.id}>
            <div className="section-title-row">
              <div>
                <p className="eyebrow">{collection.kicker}</p>
                <h2>{collection.title}</h2>
              </div>
              <p className="section-note">{collection.note}</p>
            </div>
            <div className="shop-grid">
              {items.map((product) => <ShopCard product={product} key={product.slug} />)}
            </div>
          </section>
        );
      })}
    </main>
  );
}
