"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import * as pixel from "@/lib/metaPixel";

export default function MetaPixel() {
  const [loaded, setLoaded] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!loaded) return;
    pixel.pageview();
  }, [pathname, searchParams, loaded]);

  if (!pixel.PIXEL_ID) return null;

  if (typeof window !== "undefined") {
    (window as any).__META_PIXEL_ID__ = pixel.PIXEL_ID;
  }
  
  return (
    <>
      <Script
        id="fb-pixel"
        src="/scripts/pixel.js"
        strategy="afterInteractive"
        onLoad={() => setLoaded(true)}
        data-pixel-id={pixel.PIXEL_ID}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixel.PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
