"use client";

import type { FormEvent } from "react";
import { Modal } from "@/components/modal";
import { formatPrice, type Product } from "@/lib/products";

export type SizeIntent = "cart" | "buy";

export function SizeDialog({ product, intent, onChoose, onClose }: { product: Product; intent: SizeIntent; onChoose: (size: string) => void; onClose: () => void }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const size = new FormData(event.currentTarget).get("size");
    if (typeof size === "string") onChoose(size);
  }

  return (
    <Modal label={`Choose a size for ${product.name}`} className="modal-small" onClose={onClose}>
      <form className="size-form" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Choose your size</p>
          <h2 className="modal-title">{product.name}</h2>
          <p className="modal-price">{formatPrice(product.price)}</p>
        </div>
        <fieldset className="field">
          <legend className="field-label">Size</legend>
          <div className="choice-row">
            {product.sizes.map((size) => (
              <label className="choice" key={size}>
                <input type="radio" name="size" value={size} required />
                <span>{size}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <button className="button button-dark order-submit" type="submit">
          {intent === "cart" ? "Add to cart" : "Continue to checkout"} <span aria-hidden="true">↗</span>
        </button>
      </form>
    </Modal>
  );
}
