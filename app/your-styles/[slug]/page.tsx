import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderForm } from "@/components/order-form";
import { formatPrice, getProduct, products } from "@/lib/products";
import { store } from "@/lib/store";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps<"/your-styles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return product ? { title: product.name, description: product.description } : {};
}

export default async function ProductPage({ params }: PageProps<"/your-styles/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <main>
      <section className="product-page page-wrap">
        <div className="product-photo">
          <Image
            src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=1400&q=85`}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 680px) 100vw, 50vw"
          />
          <span className="product-label">{product.soldOut ? "Sold out" : product.label}</span>
        </div>
        <div className="product-detail">
          <Link className="product-back" href="/your-styles"><span aria-hidden="true">←</span> All styles</Link>
          <p className="eyebrow">The Invizz collection</p>
          <h1>{product.name}</h1>
          <p className="product-detail-price">{formatPrice(product.price)}</p>
          <p className="product-detail-copy">{product.description}</p>
          <ul className="order-assurances">
            <li>Dispatched in {store.dispatchDays} working days</li>
            <li>{store.returnWindowDays}-day returns and exchanges</li>
            <li>Order confirmed by a real person on WhatsApp</li>
          </ul>
          {product.soldOut ? (
            <p className="sold-out-note">This piece is sold out for now. Message us on WhatsApp at {store.whatsappDisplay} and we&apos;ll tell you when it&apos;s back.</p>
          ) : (
            <OrderForm product={product} />
          )}
        </div>
      </section>
    </main>
  );
}
