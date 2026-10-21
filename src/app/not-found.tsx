import Link from "next/link";

export default function NotFound() {
  return(
    <main>
      <div id="not-found-wrapper">
        <h1>404 <br />Not Found</h1>
        <p>
          Sorry, the page you&apos;re looking for does not 
          exist or may have been moved.
        </p>
        <Link href="/" className="error-btn">
          <span className="return-to-site-btn">
            Return to home
          </span>
        </Link>
      </div>
    </main>
  )
}