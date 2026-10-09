"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatPrice, type Product } from "@/lib/products";

export function ShopCard({ product }: { product: Product }) {
  const { pickSize } = useCart();

  return (
    <article className="shop-card">
      <Link className={`shop-card-image launch-image ${product.tone}`} href={`/your-styles/${product.slug}`} aria-label={`See ${product.name}`}>
        <Image
          src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=700&q=85`}
          alt={product.name}
          fill
          sizes="(max-width: 680px) 45vw, (max-width: 1100px) 30vw, 18vw"
        />
        <span className="product-label">{product.soldOut ? "Sold out" : product.label}</span>
      </Link>
      <h3>{product.name}</h3>
      <p className="shop-card-price">{formatPrice(product.price)}</p>
      <div className="shop-card-actions">
        <button className="button button-dark" type="button" disabled={product.soldOut} onClick={() => pickSize(product, "buy")}>Buy now</button>
        <button className="button button-outline" type="button" disabled={product.soldOut} onClick={() => pickSize(product, "cart")}>Add to cart</button>
      </div>
    </article>
  );
}
