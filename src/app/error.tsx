"use client";
import { useEffect, useRef } from "react";

export default function Error({ error, reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    console.error(error);
    headingRef.current?.focus();
  }, [error]);

  return(
    <main>
      <section id="error-page">
        <div id="error-page-wrapper" className="wrapper">
          <h1
            ref={headingRef} 
            tabIndex={-1} 
            style={{ outline: 'none' }}
          >
            Sorry, something <br/> went wrong...
          </h1>
          <button 
            type="button"
            className="error-page-btn"
            onClick={() => reset()}
            >
            Reset
          </button>
        </div>
      </section>
    </main>
  )
}