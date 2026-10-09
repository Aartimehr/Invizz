import type { Metadata } from "next";
import { ThankYou } from "@/components/thank-you";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false },
};

export default function ThankYouPage() {
  return (
    <main>
      <ThankYou />
    </main>
  );
}
