"use client";

import { useEffect } from "react";

// Fades each ".reveal" block up as it scrolls into view. Blocks already on screen when the page opens are
// left alone, and so is everything when the visitor's device asks for reduced motion or the script cannot run.
export function RevealOnScroll() {
  useEffect(() => {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.remove("reveal-pending");
          observer.unobserve(entry.target);
        } else {
          entry.target.classList.add("reveal-pending");
        }
      }
    }, { rootMargin: "0px 0px -8% 0px" });

    const blocks = document.querySelectorAll(".reveal");
    blocks.forEach((block) => observer.observe(block));
    return () => {
      observer.disconnect();
      blocks.forEach((block) => block.classList.remove("reveal-pending"));
    };
  }, []);

  return null;
}
