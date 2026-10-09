import type { Metadata } from "next";
import { CollectionPage } from "@/components/collection-page";

export const metadata: Metadata = {
  title: "Men",
  description: "Invizz for men: our exclusives, new arrivals and everyday essentials.",
};

export default function MenPage() {
  return <CollectionPage gender="men" />;
}
