import Link from "next/link";
import { LockedNotice } from "@/components/locked-notice";
import { ShopCard } from "@/components/shop-card";
import { collections, getCollection, type Gender } from "@/lib/products";

const copy = {
  women: { label: "Women", title: "For her,", accent: "her own way.", note: "Three edits, fifteen pieces. Pick a size, add it to your bag, or buy it straight away.", other: "men", otherLabel: "Shop men" },
  men: { label: "Men", title: "For him,", accent: "no fuss.", note: "Three edits, fifteen pieces. Pick a size, add it to your bag, or buy it straight away.", other: "women", otherLabel: "Shop women" },
} as const;

export function CollectionPage({ gender }: { gender: Gender }) {
  const page = copy[gender];

  return (
    <main className="locked-page">
      {/* The men and women pages are locked until the first drop: everything in locked-content is blurred and cannot be clicked.
          To unlock them, remove the LockedNotice and the locked-content wrapper (keep what is inside it). */}
      <LockedNotice text="The first drop is on its way. This page opens when it arrives." />
      <div className="locked-content" inert aria-hidden="true">
      <section className="page-hero page-wrap">
        <div>
          <p className="eyebrow">The Invidzz collection / {page.label}</p>
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
      </div>
    </main>
  );
}
