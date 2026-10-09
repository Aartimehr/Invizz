import type { Metadata } from "next";
import { CollectionPage } from "@/components/collection-page";

export const metadata: Metadata = {
  title: "Women",
  description: "Invizz for women: our exclusives, new arrivals and everyday essentials.",
};

export default function WomenPage() {
  return <CollectionPage gender="women" />;
}
