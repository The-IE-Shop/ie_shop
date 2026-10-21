"use client";
import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {

  useEffect(() => {
    console.error(error);
  }, [error]);

  return(
    <html lang="en">
      <head>
        <title>Something went wrong | IE SHOP</title>
      </head>
      <body>
        <main id="global-error-page">
          <section 
            id="global-error-wrapper" 
            className="wrapper"
          >
            <h1>Sorry, something went wrong...</h1>
            <p>
              An unexpected error has occured in the site
            </p>
            <button 
              type="button"
              className="global-error-btn"
              onClick={() => reset()}
              aria-label="Attempt to recover and reload the page"
            >
              Reset
            </button>
          </section>
        </main>
      </body>
    </html>
  )
}